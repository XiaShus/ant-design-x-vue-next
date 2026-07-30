import type { Config as DOMPurifyConfig } from 'dompurify';
import { h, type VNode, type VNodeChild } from 'vue';
import type { StreamStatus, XMarkdownComponents } from './interface';
import { sanitizeMarkdownHtml } from './sanitize';

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

function attrsToProps(el: Element): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name;
    if (name === 'class') {
      props.class = attr.value;
    } else if (name === 'style') {
      props.style = attr.value;
    } else if (name.startsWith('on')) {
      // Block inline event handlers even if they somehow survive sanitization
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

  const componentTags = Object.keys(options.components || {}).filter((tag) => tag !== 'code');
  const clean = sanitizeMarkdownHtml(html, {
    dompurifyConfig: options.dompurifyConfig,
    componentTags,
  });

  if (typeof document === 'undefined') {
    // Fail closed: never inject unsanitized HTML via innerHTML
    return clean ? [h('div', null, clean)] : [];
  }

  const root = document.createElement('div');
  root.innerHTML = clean;

  const streamStatus = options.streamStatus ?? 'done';
  return Array.from(root.childNodes)
    .map((node) => convertNode(node, options.components, streamStatus))
    .filter((node): node is VNode | string => node !== null && node !== undefined)
    .map((node) => (typeof node === 'string' ? h('span', null, node) : (node as VNode)));
}
