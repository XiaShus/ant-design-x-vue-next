<script setup lang="tsx">
import { Tooltip, type TooltipProps } from 'ant-design-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import { computed, Transition } from 'vue';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionMenu from './ActionMenu.vue';
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
});

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

const mergedCls = computed(() => classnames(
  prefixCls,
  contextConfig.value.className,
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
}));

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

const renderSingleItem = (item: SubItemType) => {
  const { icon, label, key, disabled } = item;

  return (
    <div
      class={classnames(`${prefixCls}-list-item`, {
        [`${prefixCls}-list-item-disabled`]: disabled,
      })}
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
    <div class={mergedCls.value} {...domProps.value} style={mergedStyle.value}>
      <div class={classnames(`${prefixCls}-list`, props.variant, { block: props.block })}>
        {props.items.map((item) => {
          if (item.actionRender) {
            return typeof item.actionRender === 'function'
              ? item.actionRender(item)
              : item.actionRender;
          }
          if ('children' in item && item.children) {
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
</script>
