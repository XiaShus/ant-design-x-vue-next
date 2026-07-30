import type { Config as DOMPurifyConfig } from 'dompurify';
import { h, type VNode, type VNodeChild } from 'vue';
import AnimationText from './AnimationText.vue';
import type { AnimationConfig, StreamStatus, XMarkdownComponents } from './interface';
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

const ANIMATABLE_PARENTS = new Set(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'td', 'th', 'blockquote']);

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
  options: {
    components?: XMarkdownComponents;
    streamStatus: StreamStatus;
    enableAnimation?: boolean;
    animationConfig?: AnimationConfig;
    parentTag?: string;
    parentIsCustom?: boolean;
  },
): VNodeChild {
  const {
    components,
    streamStatus,
    enableAnimation,
    animationConfig,
    parentTag,
    parentIsCustom,
  } = options;

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (
      enableAnimation &&
      text.trim() &&
      !parentIsCustom &&
      parentTag &&
      ANIMATABLE_PARENTS.has(parentTag)
    ) {
      return h(AnimationText, { text, animationConfig });
    }
    return text;
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

  const isCustom = Boolean(components?.[tag]);
  const children = Array.from(el.childNodes).map((child) =>
    convertNode(child, {
      ...options,
      parentTag: tag,
      parentIsCustom: isCustom || parentIsCustom,
    }),
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
      const parentElTag = (
        el.parentElement?.localName ||
        el.parentElement?.tagName ||
        ''
      ).toLowerCase();
      props.block = parentElTag === 'pre';
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
      return convertNode(codeEl, options);
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
    enableAnimation?: boolean;
    animationConfig?: AnimationConfig;
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
    return clean ? [h('div', null, clean)] : [];
  }

  const root = document.createElement('div');
  root.innerHTML = clean;

  const streamStatus = options.streamStatus ?? 'done';
  return Array.from(root.childNodes)
    .map((node) =>
      convertNode(node, {
        components: options.components,
        streamStatus,
        enableAnimation: options.enableAnimation,
        animationConfig: options.animationConfig,
      }),
    )
    .filter((node): node is VNode | string => node !== null && node !== undefined)
    .map((node) => (typeof node === 'string' ? h('span', null, node) : (node as VNode)));
}
