<script setup lang="tsx">
import classnames from 'classnames';
import { computed } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import type { ThoughtChainProps } from './interface';
import { useXProviderContext } from '../x-provider';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useCollapsible from './hooks/useCollapsible';
import useStyle from './style';
import ThoughtChainNodeContextProvider from './context';
import ThoughtChainNode from './item.vue';

defineOptions({ name: 'AXThoughtChain' });

const props = withDefaults(defineProps<ThoughtChainProps>(), {
  styles: () => ({}),
  classNames: () => ({}),
  size: 'middle',
  line: true,
});

const domProps = computed(() => {
  const attrs = pickAttrs(props as Record<string, unknown>, {
    attr: true,
    aria: true,
    data: true,
  }) as Record<string, unknown>;
  // Avoid leaking component props that collide with native attr names
  const { class: _class, style: _style, size: _size, title: _title, ...rest } = attrs;
  return rest;
});

// ============================ Prefix ============================
const { getPrefixCls, direction } = useXProviderContext();

const rootPrefixCls = computed(() => getPrefixCls());

const prefixCls = computed(() => getPrefixCls('thought-chain', props.prefixCls));

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('thoughtChain');

// ============================ UseCollapsible ============================
const [enableCollapse, expandedKeys, onItemExpand] = useCollapsible(
  () => ({
    collapsible: props.collapsible,
    defaultExpandedKeys: props.defaultExpandedKeys,
    expandedKeys: props.expandedKeys,
    onExpand: props.onExpand,
  }),
  prefixCls.value,
  rootPrefixCls.value,
);

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const lineModifier = computed(() => {
  const { line } = props;
  if (line === false) return `${prefixCls.value}-line-false`;
  if (line === 'dashed') return `${prefixCls.value}-line-dashed`;
  if (line === 'dotted') return `${prefixCls.value}-line-dotted`;
  return undefined;
});

const mergedCls = computed(() =>
  classnames(
    props.class,
    (props as { className?: string }).className,
    props.rootClassName,
    prefixCls.value,
    contextConfig.value.className,
    (contextConfig.value.classNames as any)?.root,
    props.classNames.root,
    hashId.value,
    cssVarCls,
    lineModifier.value,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
    `${prefixCls.value}-${props.size}`,
  ),
);

const mergedRootStyle = computed(() => ({
  ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
  ...((contextConfig.value.styles as any)?.root || {}),
  ...(typeof props.style === 'object' ? props.style : {}),
  ...(props.styles.root || {}),
}));

defineRender(() => {
  return wrapCSSVar(
    <div
      {...domProps.value}
      class={mergedCls.value}
      style={mergedRootStyle.value}
    >
      <ThoughtChainNodeContextProvider
        value={{
          prefixCls: prefixCls.value,
          enableCollapse: enableCollapse.value,
          expandedKeys: expandedKeys.value,
          direction: direction.value,
          line: props.line,
          classNames: {
            itemHeader: classnames(
              contextConfig.value.classNames.itemHeader,
              props.classNames.itemHeader,
            ),
            itemIcon: classnames(
              (contextConfig.value.classNames as any)?.itemIcon,
              props.classNames.itemIcon,
            ),
            itemContent: classnames(
              contextConfig.value.classNames.itemContent,
              props.classNames.itemContent,
            ),
            itemFooter: classnames(
              contextConfig.value.classNames.itemFooter,
              props.classNames.itemFooter,
            ),
          },
          styles: {
            itemHeader: {
              ...contextConfig.value.styles.itemHeader,
              ...props.styles.itemHeader,
            },
            itemIcon: {
              ...((contextConfig.value.styles as any)?.itemIcon || {}),
              ...(props.styles.itemIcon || {}),
            },
            itemContent: {
              ...contextConfig.value.styles.itemContent,
              ...props.styles.itemContent,
            },
            itemFooter: {
              ...contextConfig.value.styles.itemFooter,
              ...props.styles.itemFooter,
            },
          },
        }}
      >
        {props.items?.map((item, index) => (
          <ThoughtChainNode
            key={item.key || `key_${index}`}
            class={classnames(contextConfig.value.classNames.item, props.classNames.item)}
            style={{ ...contextConfig.value.styles.item, ...props.styles.item }}
            line={props.line}
            info={{
              ...item,
              icon: item.icon || index + 1,
            }}
            onClick={onItemExpand}
            nextStatus={props.items![index + 1]?.status || item.status}
          />
        ))}
      </ThoughtChainNodeContextProvider>
    </div>,
  );
});
</script>
