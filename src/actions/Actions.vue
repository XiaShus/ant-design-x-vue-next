<script setup lang="tsx">
import { Tooltip, type TooltipProps } from 'ant-design-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import { computed, ref, Transition } from 'vue';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionMenu from './ActionMenu.vue';
import { ActionsContextProvider } from './context';
import { getItemChildren } from './getItemChildren';
import type { ActionsProps, ActionItem, SubItemType } from './interface';

import useStyle from './style';

defineOptions({ name: 'AXActions' });

const props = withDefaults(defineProps<ActionsProps>(), {
  rootClassName: '',
  variant: 'borderless',
  block: false,
  items: () => [],
  fadeIn: false,
  fadeInLeft: false,
  classNames: () => ({}),
  styles: () => ({}),
});

const containerRef = ref<HTMLDivElement | null>(null);

const emit = defineEmits<{
  click: [menuInfo: {
    item: ActionItem;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }];
}>();

// ============================ PrefixCls ============================
const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const rootPrefixCls = getPrefixCls();

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('actions');

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const motionName = computed(() =>
  props.fadeInLeft || props.fadeIn
    ? `${rootPrefixCls}-x-fade${props.fadeInLeft ? '-left' : ''}`
    : '',
);

const mergedItemClassName = computed(() =>
  classnames(
    (contextConfig.value.classNames as any)?.item,
    props.classNames?.item,
  ),
);
const mergedItemStyle = computed(() => ({
  ...((contextConfig.value.styles as any)?.item || {}),
  ...(props.styles?.item || {}),
}));
const mergedItemDropdownClassName = computed(() =>
  classnames(
    (contextConfig.value.classNames as any)?.itemDropdown,
    props.classNames?.itemDropdown,
  ),
);
const mergedItemDropdownStyle = computed(() => ({
  ...((contextConfig.value.styles as any)?.itemDropdown || {}),
  ...(props.styles?.itemDropdown || {}),
}));

const actionsContextValue = computed(() => ({
  prefixCls,
  classNames: {
    item: mergedItemClassName.value,
    itemDropdown: mergedItemDropdownClassName.value,
  },
  styles: {
    item: mergedItemStyle.value,
    itemDropdown: mergedItemDropdownStyle.value,
  },
}));

const mergedCls = computed(() => classnames(
  prefixCls,
  contextConfig.value.className,
  (contextConfig.value.classNames as any)?.root,
  props.classNames?.root,
  props.rootClassName,
  cssVarCls,
  hashId.value,
  {
    [`${prefixCls}-rtl`]: direction.value === 'rtl',
  },
));

const mergedStyle = computed(() => ({
  ...contextConfig.value.style,
  ...(typeof props.style === 'object' ? props.style : {}),
  ...((contextConfig.value.styles as any)?.root || {}),
  ...(props.styles?.root || {}),
}));

/** `border` kept as deprecated alias of `filled` (legacy Vue API). */
const normalizedVariant = computed(() => {
  const v = props.variant ?? 'borderless';
  return v === 'border' ? 'filled' : v;
});

const getTooltipNode = (node: any, title?: string, tooltipProps?: TooltipProps) => {
  if (title) {
    return (
      <Tooltip {...tooltipProps} title={title}>
        {node}
      </Tooltip>
    );
  }
  return node;
};

const handleItemClick = (
  key: string,
  item: ActionItem,
  domEvent: MouseEvent,
) => {
  if (item.disabled) {
    domEvent.preventDefault();
    return;
  }
  if (item.onItemClick) {
    item.onItemClick(item);
    return;
  }
  emit('click', {
    key,
    item,
    keyPath: [key],
    domEvent,
  });
};

const handleMenuClick = (menuInfo: {
  item: ActionItem;
  key: string;
  keyPath: string[];
  domEvent: MouseEvent | KeyboardEvent;
}) => {
  emit('click', menuInfo);
};

const renderSingleItem = (item: SubItemType & { danger?: boolean }) => {
  const { icon, label, key, disabled, danger } = item;

  return (
    <div
      class={classnames(
        `${prefixCls}-list-item`,
        mergedItemClassName.value,
        {
          [`${prefixCls}-list-item-disabled`]: disabled,
          [`${prefixCls}-list-danger`]: danger,
        },
      )}
      style={mergedItemStyle.value}
      aria-disabled={disabled || undefined}
      onClick={(domEvent: MouseEvent) => handleItemClick(key, item, domEvent)}
      key={key}
    >
      {getTooltipNode(<div class={`${prefixCls}-list-item-icon`}>{icon}</div>, label)}
    </div>
  );
};

const domProps = computed(() => pickAttrs(props, {
  aria: true,
  data: true,
}));

defineRender(() => {
  const rootNode = (
    <ActionsContextProvider value={actionsContextValue.value}>
      <div
        ref={containerRef}
        class={mergedCls.value}
        {...domProps.value}
        style={mergedStyle.value}
      >
        <div
          class={classnames(
            `${prefixCls}-list`,
            `${prefixCls}-variant-${normalizedVariant.value}`,
            { block: props.block },
          )}
        >
          {props.items.map((item) => {
            if (item.actionRender) {
              return typeof item.actionRender === 'function'
                ? item.actionRender(item)
                : item.actionRender;
            }
            if (getItemChildren(item)?.length) {
              return (
                <ActionMenu
                  key={item.key}
                  item={item}
                  prefixCls={prefixCls}
                  dropdownProps={props.dropdownProps}
                  onClick={handleMenuClick}
                />
              );
            }
            return renderSingleItem(item as SubItemType);
          })}
        </div>
      </div>
    </ActionsContextProvider>
  );

  const name = motionName.value;
  const content = name ? (
    <Transition
      appear
      enterFromClass={`${name}-enter ${name}-appear`}
      enterActiveClass={`${name}-enter ${name}-enter-active ${name}-appear ${name}-appear-active`}
      enterToClass={`${name}-enter ${name}-enter-active`}
      leaveFromClass={`${name}-leave`}
      leaveActiveClass={`${name}-leave ${name}-leave-active`}
      leaveToClass={`${name}-leave ${name}-leave-active`}
    >
      {rootNode}
    </Transition>
  ) : (
    rootNode
  );

  return wrapCSSVar(content);
});

defineExpose({
  nativeElement: containerRef,
});
</script>
