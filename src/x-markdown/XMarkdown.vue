<script setup lang="tsx">
import classnames from 'classnames';
import { computed, defineComponent } from 'vue';
import { CodeHighlighter } from '../code-highlighter';
import { Mermaid } from '../mermaid';
import { useStreaming } from './composables/useStreaming';
import { htmlToVNodes } from './htmlToVNodes';
import type { XMarkdownProps, XMarkdownSlots } from './interface';
import { parseMarkdown } from './parser';
import './style/index.css';

defineOptions({ name: 'AXXMarkdown' });

const DEFAULT_TAIL = '|';

const props = withDefaults(defineProps<XMarkdownProps>(), {
  openLinksInNewTab: false,
  escapeRawHtml: false,
});

const slots = defineSlots<XMarkdownSlots>();

const DefaultCode = defineComponent({
  name: 'AXXMarkdownDefaultCode',
  props: {
    lang: { type: String, default: '' },
    block: { type: Boolean, default: false },
    content: { type: String, default: '' },
  },
  setup(codeProps) {
    return () => {
      const text = codeProps.content || '';

      if (!codeProps.block) {
        return <code class={codeProps.lang ? `language-${codeProps.lang}` : undefined}>{text}</code>;
      }

      if (codeProps.lang === 'mermaid') {
        return <Mermaid children={text} />;
      }

      if (codeProps.lang) {
        return <CodeHighlighter lang={codeProps.lang} children={text} />;
      }

      return (
        <pre>
          <code>{text}</code>
        </pre>
      );
    };
  },
});

const markdownSource = computed(() => {
  if (typeof props.content === 'string') {
    return props.content;
  }
  if (typeof props.children === 'string') {
    return props.children;
  }
  const slotNodes = slots.default?.();
  if (!slotNodes) {
    return '';
  }
  const nodes = Array.isArray(slotNodes) ? slotNodes : [slotNodes];
  return nodes
    .map((node) => {
      if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
      }
      if (node && typeof node === 'object' && 'children' in node) {
        const child = (node as any).children;
        if (typeof child === 'string' || typeof child === 'number') {
          return String(child);
        }
      }
      return '';
    })
    .join('');
});

const mergedComponents = computed(() => ({
  code: DefaultCode,
  ...props.components,
}));

const streamingConfig = computed(() => ({
  streaming: props.streaming,
  components: mergedComponents.value,
}));

/** Incremental token cache while streaming; full content when finished */
const streamOutput = useStreaming(markdownSource, streamingConfig);

const streamStatus = computed(() =>
  props.streaming?.hasNextChunk ? ('loading' as const) : ('done' as const),
);

const shouldShowTail = computed(() => {
  const tail = props.streaming?.tail;
  return Boolean(props.streaming?.hasNextChunk && tail);
});

const tailContent = computed(() => {
  const tail = props.streaming?.tail;
  if (tail && typeof tail === 'object') {
    return tail.content ?? DEFAULT_TAIL;
  }
  return DEFAULT_TAIL;
});

const disableStyleCls = computed(() => {
  if (props.disableDefaultStyles === true) {
    return 'x-md-disable-all';
  }
  if (Array.isArray(props.disableDefaultStyles)) {
    return props.disableDefaultStyles.map((tag) => `x-md-disable-${tag}`);
  }
  return undefined;
});

const renderedNodes = computed(() => {
  const source = streamOutput.value;
  if (!source) {
    return null;
  }

  const html = parseMarkdown(source, {
    markedConfig: props.config,
    openLinksInNewTab: props.openLinksInNewTab,
    injectTail: shouldShowTail.value,
    tailContent: tailContent.value,
    escapeRawHtml: props.escapeRawHtml,
  });

  return htmlToVNodes(html, {
    components: mergedComponents.value,
    dompurifyConfig: props.dompurifyConfig,
    streamStatus: streamStatus.value,
  });
});

defineRender(() => {
  if (!streamOutput.value) {
    return null;
  }

  return (
    <div
      class={classnames(
        'x-markdown',
        disableStyleCls.value,
        props.rootClassName,
        props.className,
        props.class,
      )}
      style={props.style}
    >
      {renderedNodes.value}
    </div>
  );
});
</script>
