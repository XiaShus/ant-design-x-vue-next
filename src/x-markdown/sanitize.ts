import type { Config as DOMPurifyConfig } from 'dompurify';
import DOMPurify from 'dompurify';

/**
 * Fix for DOMPurify 3.x in environments (e.g. happy-dom) where cached
 * Node.prototype getters return incorrect values for template content nodes.
 * Ported from @ant-design/x-markdown Renderer.
 */
let patchedDOMPurify: typeof DOMPurify | null = null;

export function createPatchedDOMPurify(): typeof DOMPurify {
  if (patchedDOMPurify) return patchedDOMPurify;

  if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
    try {
      const template = document.createElement('template');
      template.innerHTML = '<test-detect></test-detect>';
      const testEl = template.content.firstChild;
      if (testEl) {
        const nodeNameGetter = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeName')?.get;
        const nodeValueGetter = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeValue')?.get;

        const needsNodeNamePatch =
          Boolean(nodeNameGetter && testEl.nodeName && !nodeNameGetter.call(testEl));

        if (needsNodeNamePatch && nodeNameGetter) {
          const originalNodeNameGet = nodeNameGetter;
          Object.defineProperty(Node.prototype, 'nodeName', {
            get: function (this: Node) {
              const value = originalNodeNameGet.call(this);
              if (value) return value;
              if (this.nodeType === 1 && 'tagName' in this) {
                return (this as unknown as { tagName: string }).tagName;
              }
              switch (this.nodeType) {
                case 3:
                  return '#text';
                case 4:
                  return '#cdata-section';
                case 7:
                  return '#processing-instruction';
                case 8:
                  return '#comment';
                case 9:
                  return '#document';
                case 11:
                  return '#document-fragment';
              }
              return value;
            },
            configurable: true,
            enumerable: true,
          });
        }

        const needsNodeValuePatch =
          Boolean(nodeValueGetter) &&
          (() => {
            template.innerHTML = '<div>test</div>';
            const textNode = template.content.firstChild?.firstChild;
            if (!textNode || !nodeValueGetter) return false;
            const viaGetter = nodeValueGetter.call(textNode);
            const viaDirect = textNode.nodeValue;
            return viaDirect != null && viaGetter == null;
          })();

        if (needsNodeValuePatch && nodeValueGetter) {
          const originalNodeValueGet = nodeValueGetter;
          Object.defineProperty(Node.prototype, 'nodeValue', {
            get: function (this: Node) {
              const value = originalNodeValueGet.call(this);
              if (value !== null && value !== undefined) return value;
              if (
                (this.nodeType === 3 || this.nodeType === 4 || this.nodeType === 8) &&
                'data' in this
              ) {
                return (this as CharacterData).data;
              }
              return value;
            },
            configurable: true,
            enumerable: true,
          });
        }

        if (needsNodeNamePatch || needsNodeValuePatch) {
          patchedDOMPurify = DOMPurify(window);
          return patchedDOMPurify;
        }
      }
    } catch {
      // fall through
    }
  }

  patchedDOMPurify = DOMPurify;
  return patchedDOMPurify;
}

const DEFAULT_ADD_ATTR = [
  'target',
  'rel',
  'data-language',
  'class',
  'style',
  'data-raw',
  'data-state',
  'data-lang',
  'data-block',
];

const DANGEROUS_TAGS = ['script', 'iframe', 'object', 'embed', 'base', 'form'];

/**
 * Pre-remove high-risk nodes before DOMPurify.
 * Needed because happy-dom + DOMPurify 3.x may wipe the entire fragment when
 * a <script> is present (siblings/text disappear). Parsing via <template>
 * avoids executing scripts in browsers.
 */
function preStripDangerousHtml(html: string): string {
  if (typeof document === 'undefined') {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }

  const template = document.createElement('template');
  template.innerHTML = html;

  DANGEROUS_TAGS.forEach((tag) => {
    template.content.querySelectorAll(tag).forEach((el) => el.remove());
  });

  template.content.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on') || attr.name === 'srcdoc') {
        el.removeAttribute(attr.name);
      }
    }
  });

  const container = document.createElement('div');
  container.appendChild(template.content.cloneNode(true));
  return container.innerHTML;
}

export type SanitizeOptions = {
  dompurifyConfig?: DOMPurifyConfig;
  /** Custom component tag names that must survive sanitization */
  componentTags?: string[];
};

/**
 * Always sanitize. Never return original HTML on failure (fail closed).
 */
export function sanitizeMarkdownHtml(html: string, options: SanitizeOptions = {}): string {
  if (!html) {
    return '';
  }

  const purifiedSource = preStripDangerousHtml(html);
  const purify = createPatchedDOMPurify();
  if (typeof purify.sanitize !== 'function') {
    // SSR / no DOM: strip remaining tags rather than inject raw HTML
    return purifiedSource.replace(/<[^>]*>/g, '');
  }

  const userConfig = options.dompurifyConfig || {};
  const userTags = Array.isArray(userConfig.ADD_TAGS) ? userConfig.ADD_TAGS : [];
  const userAttrs = Array.isArray(userConfig.ADD_ATTR) ? userConfig.ADD_ATTR : [];
  const componentTags = options.componentTags || [];

  return String(
    purify.sanitize(purifiedSource, {
      ...userConfig,
      ADD_TAGS: Array.from(new Set(['xmd-tail', ...componentTags, ...userTags])),
      ADD_ATTR: Array.from(new Set([...DEFAULT_ADD_ATTR, ...userAttrs])),
    }),
  );
}
