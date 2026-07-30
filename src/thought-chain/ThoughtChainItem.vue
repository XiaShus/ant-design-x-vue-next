<script setup lang="tsx">
import classnames from 'classnames';
import { computed, useAttrs, useId } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import type { ThoughtChainItemProps } from './item-types';
import Status from './Status.vue';
import useStyle from './style';

defineOptions({ name: 'AXThoughtChainItem', inheritAttrs: false });

const props = withDefaults(defineProps<ThoughtChainItemProps>(), {
  variant: 'solid',
  blink: false,
  disabled: false,
  rootClassName: '',
  classNames: () => ({}),
  styles: () => ({}),
});

const attrs = useAttrs();
const id = useId();

const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('thought-chain', props.prefixCls));
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const itemCls = computed(() => `${prefixCls.value}-item`);

const hasClick = computed(() => {
  return !!(attrs.onClick || (props as any).onClick);
});

const domProps = computed(() => {
  const merged = { ...attrs, ...props } as Record<string, unknown>;
  return pickAttrs(merged, {
    attr: true,
    aria: true,
    data: true,
  });
});

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    hashId.value,
    cssVarCls,
    props.className,
    props.class,
    props.rootClassName,
    props.classNames?.root,
    itemCls.value,
    {
      [`${itemCls.value}-${props.variant}`]: props.variant,
      [`${itemCls.value}-click`]: !props.disabled && hasClick.value,
      [`${itemCls.value}-error`]: props.status === 'error',
      [`${itemCls.value}-rtl`]: direction.value === 'rtl',
      [`${itemCls.value}-disabled`]: props.disabled,
    },
  ),
);

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return;
  const onClick = (attrs.onClick || (props as any).onClick) as
    | ((event: MouseEvent) => void)
    | undefined;
  onClick?.(e);
};

defineRender(() => {
  const { class: _c, style: attrStyle, onClick: _onClick, ...restDom } = {
    ...domProps.value,
    ...(attrs as Record<string, unknown>),
  } as Record<string, any>;

  return wrapCSSVar(
    <div
      {...restDom}
      key={id}
      onClick={props.disabled ? undefined : handleClick}
      style={{
        ...(typeof attrStyle === 'object' ? attrStyle : {}),
        ...(typeof props.style === 'object' ? props.style : {}),
        ...props.styles?.root,
      }}
      class={mergedCls.value}
    >
      {(props.status || props.icon) && (
        <Status
          style={props.styles?.icon}
          className={props.classNames?.icon}
          prefixCls={prefixCls.value}
          icon={props.icon}
          status={props.status}
        />
      )}
      <div
        class={classnames(`${itemCls.value}-content`, {
          [`${prefixCls.value}-motion-blink`]: props.blink,
        })}
      >
        {props.title ? (
          <div
            style={props.styles?.title}
            class={classnames(`${itemCls.value}-title`, props.classNames?.title, {
              [`${itemCls.value}-title-with-description`]: props.description,
            })}
          >
            {props.title}
          </div>
        ) : null}
        {props.description ? (
          <div
            style={props.styles?.description}
            class={classnames(
              `${itemCls.value}-description`,
              props.classNames?.description,
            )}
          >
            {props.description}
          </div>
        ) : null}
      </div>
    </div>,
  );
});
</script>
