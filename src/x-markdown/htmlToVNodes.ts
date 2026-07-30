import type { Config as DOMPurifyConfig } from 'dompurify';
import DOMPurify from 'dompurify';
import { h, type VNode, type VNodeChild } from 'vue';
import type { StreamStatus, XMarkdownComponents } from './interface';

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function sanitizeHtml(html: string, config?: DOMPurifyConfig): string {
  if (typeof window === 'undefined') {
    return html;
  }
  // happy-dom exposes this marker; DOMPurify 3.x drops headings there
  if ((window as any).happyDOM) {
    return html;
  }
  const clean = DOMPurify.sanitize(html, {
    ADD_TAGS: ['xmd-tail'],
    ADD_ATTR: ['target', 'rel', 'data-language', 'class', 'style'],
    ...config,
  });
  // Guard against environments that incorrectly strip common markdown tags
  if (/<h[1-6][\s>]/i.test(html) && !/<h[1-6][\s>]/i.test(clean)) {
    return html;
  }
  return clean;
}

function attrsToProps(el: Element): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name;
    if (name === 'class') {
      props.class = attr.value;
    } else if (name === 'style') {
      props.style = attr.value;
    } else if (name.startsWith('on')) {
      continue;
    } else {
      props[name] = attr.value;
    }
  }
  return props;
}

function convertNode(
  node: ChildNode,
  components: XMarkdownComponents | undefined,
  streamStatus: StreamStatus,
): VNodeChild {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as Element;
  // happy-dom may return empty tagName for nodes from DOMParser documents
  const rawTag = el.localName || el.tagName || el.nodeName || '';
  const tag =
    rawTag.toLowerCase() ||
    (el.outerHTML || '').match(/^<\s*([a-zA-Z][\w:-]*)/)?.[1]?.toLowerCase() ||
    '';
  if (!tag) {
    return el.textContent;
  }

  const children = Array.from(el.childNodes).map((child) =>
    convertNode(child, components, streamStatus),
  );
  const props = attrsToProps(el);
  const flatChildren = children.filter((child) => child !== null && child !== undefined);

  const custom = components?.[tag];
  if (custom) {
    if (tag === 'code') {
      const language =
        (el.getAttribute('class') || '')
          .split(/\s+/)
          .find((cls) => cls.startsWith('language-'))
          ?.replace('language-', '') ||
        el.parentElement?.getAttribute('data-language') ||
        undefined;
      props.lang = language;
      const parentTag = (
        el.parentElement?.localName ||
        el.parentElement?.tagName ||
        ''
      ).toLowerCase();
      props.block = parentTag === 'pre';
      // Pass plain text to avoid slot-tracking issues inside computed VNodes
      props.content = el.textContent || '';
    }
    props.streamStatus = streamStatus;
    if (typeof custom === 'string') {
      return h(custom, props, VOID_TAGS.has(tag) ? undefined : () => flatChildren);
    }
    return h(custom, props, VOID_TAGS.has(tag) ? undefined : () => flatChildren);
  }

  if (tag === 'pre' && components?.code) {
    const codeEl = el.querySelector(':scope > code');
    if (codeEl) {
      return convertNode(codeEl, components, streamStatus);
    }
  }

  return h(tag, props, VOID_TAGS.has(tag) ? undefined : flatChildren);
}

export function htmlToVNodes(
  html: string,
  options: {
    components?: XMarkdownComponents;
    dompurifyConfig?: DOMPurifyConfig;
    streamStatus?: StreamStatus;
  } = {},
): VNode[] {
  if (!html) {
    return [];
  }

  const clean = sanitizeHtml(html, options.dompurifyConfig);

  if (typeof document === 'undefined') {
    return [h('div', { innerHTML: clean })];
  }

  // Prefer innerHTML on a div created in the current document (avoids
  // happy-dom DOMParser owner-document tagName issues).
  const root = document.createElement('div');
  root.innerHTML = clean;

  const streamStatus = options.streamStatus ?? 'done';
  return Array.from(root.childNodes)
    .map((node) => convertNode(node, options.components, streamStatus))
    .filter((node): node is VNode | string => node !== null && node !== undefined)
    .map((node) => (typeof node === 'string' ? h('span', null, node) : (node as VNode)));
}
