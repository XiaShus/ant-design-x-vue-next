<script setup lang="tsx">
import classnames from 'classnames';
import { Typography } from 'ant-design-vue';
import { computed, ref, watch, type VNode } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { ensureFullPrism, ensureLanguage, escapeHtml, highlightCode } from './prism';
import useStyle from './style';
import type { CodeHighlighterProps, CodeHighlighterRef, CodeHighlighterSlots } from './interface';

defineOptions({ name: 'AXCodeHighlighter' });

const props = withDefaults(defineProps<CodeHighlighterProps>(), {
  prismLightMode: true,
  styles: () => ({}),
  classNames: () => ({}),
});

const slots = defineSlots<CodeHighlighterSlots>();

const rootRef = ref<HTMLDivElement | null>(null);
const highlightedHtml = ref('');
const resolvedLang = ref('');

const domProps = computed(() =>
  pickAttrs(props, {
    attr: true,
    aria: true,
    data: true,
  }),
);

// ============================ Prefix ============================
const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('codeHighlighter', props.prefixCls));

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('codeHighlighter');

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const codeText = computed(() => {
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

const normalizedCode = computed(() => codeText.value.replace(/\n$/, ''));

watch(
  [normalizedCode, () => props.lang, () => props.prismLightMode],
  async ([code, lang, lightMode]) => {
    if (!code || !lang) {
      highlightedHtml.value = '';
      resolvedLang.value = '';
      return;
    }

    // Show plain escaped code immediately while language loads
    highlightedHtml.value = escapeHtml(code);

    try {
      if (lightMode === false) {
        await ensureFullPrism();
      }
      const loadedLang = await ensureLanguage(lang);
      resolvedLang.value = loadedLang;
      highlightedHtml.value = highlightCode(code, loadedLang);
    } catch {
      highlightedHtml.value = escapeHtml(code);
    }
  },
  { immediate: true },
);

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    props.className,
    props.class,
    props.rootClassName,
    contextConfig.value.classNames?.root,
    props.classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const mergedStyle = computed(() => ({
  ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
  ...(typeof contextConfig.value.styles?.root === 'object' ? contextConfig.value.styles.root : {}),
  ...props.styles.root,
  ...props.style,
}));

const resolveHeader = (): any => {
  if (slots.header) {
    return slots.header();
  }
  if (props.header !== undefined) {
    const result =
      typeof props.header === 'function'
        ? (props.header as () => VNode | string | false | null)()
        : props.header;
    if (result === false || result === null) {
      return null;
    }
    return result;
  }
  return undefined;
};

defineExpose<CodeHighlighterRef>({
  get nativeElement() {
    return rootRef.value;
  },
});

defineRender(() => {
  const code = codeText.value;
  if (!code) {
    return null;
  }

  // No lang means no highlighting needed
  if (!props.lang) {
    return <code>{code}</code>;
  }

  const headerResult = resolveHeader();
  let headerNode: any;
  if (headerResult === null) {
    headerNode = null;
  } else if (headerResult === undefined) {
    headerNode = (
      <div
        class={classnames(
          `${prefixCls.value}-header`,
          contextConfig.value.classNames?.header,
          props.classNames.header,
        )}
        style={{
          ...(typeof contextConfig.value.styles?.header === 'object'
            ? contextConfig.value.styles.header
            : {}),
          ...props.styles.header,
        }}
      >
        <span
          class={classnames(
            `${prefixCls.value}-header-title`,
            props.classNames.headerTitle,
            contextConfig.value.classNames?.headerTitle,
          )}
          style={{
            ...(typeof contextConfig.value.styles?.headerTitle === 'object'
              ? contextConfig.value.styles.headerTitle
              : {}),
            ...props.styles.headerTitle,
          }}
        >
          {props.lang}
        </span>
        <Typography.Text copyable={{ text: code }} />
      </div>
    );
  } else {
    headerNode = headerResult;
  }

  const {
    className: highlightClassName,
    class: highlightClass,
    style: highlightStyle,
    showLineNumbers: _showLineNumbers,
    startingLineNumber: _startingLineNumber,
    ...restHighlightProps
  } = props.highlightProps || {};

  const langClass = resolvedLang.value
    ? `language-${resolvedLang.value}`
    : props.lang
      ? `language-${props.lang}`
      : '';

  return wrapCSSVar(
    <div
      {...domProps.value}
      ref={rootRef}
      class={mergedCls.value}
      style={mergedStyle.value}
    >
      {headerNode}
      <div
        class={classnames(
          `${prefixCls.value}-code`,
          contextConfig.value.classNames?.code,
          props.classNames.code,
        )}
        style={{
          ...(typeof contextConfig.value.styles?.code === 'object'
            ? contextConfig.value.styles.code
            : {}),
          ...props.styles.code,
        }}
      >
        <pre
          {...restHighlightProps}
          class={classnames(langClass, highlightClassName, highlightClass)}
          style={{
            margin: 0,
            ...(typeof highlightStyle === 'object' ? highlightStyle : {}),
          }}
        >
          <code
            class={langClass}
            style={{ background: 'transparent' }}
            innerHTML={highlightedHtml.value}
          />
        </pre>
      </div>
    </div>,
  );
});
</script>
