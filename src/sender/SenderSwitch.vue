<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import classnames from 'classnames';
import type { CSSProperties } from 'vue';
import { computed, ref, useAttrs, useSlots, watch } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';
import type { SenderSwitchProps } from './switch-types';

defineOptions({ name: 'AXSenderSwitch', inheritAttrs: false });

const containerRef = ref<HTMLDivElement>();

const props = withDefaults(defineProps<SenderSwitchProps>(), {
  prefixCls: undefined,
  rootClassName: '',
  checkedChildren: undefined,
  unCheckedChildren: undefined,
  value: undefined,
  defaultValue: false,
  icon: undefined,
  loading: false,
  disabled: false,
  classNames: () => ({}),
  styles: () => ({}),
});

const emit = defineEmits<{
  change: [checked: boolean];
  'update:value': [checked: boolean];
}>();

const attrs = useAttrs();
const slots = useSlots();
const contextConfig = useXComponentConfig('sender');
const { direction, getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('sender', props.prefixCls);
const switchCls = `${prefixCls}-switch`;
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const innerChecked = ref(props.defaultValue);
watch(
  () => props.value,
  (v) => {
    if (v !== undefined) innerChecked.value = v;
  },
  { immediate: true },
);

const mergedChecked = computed(() =>
  props.value !== undefined ? props.value : innerChecked.value,
);

const mergedCls = computed(() =>
  classnames(
    prefixCls,
    switchCls,
    attrs.class as string,
    props.rootClassName,
    (contextConfig.value as any).classNames?.switch,
    props.classNames?.root,
    hashId.value,
    cssVarCls,
    {
      [`${switchCls}-checked`]: mergedChecked.value,
      [`${switchCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const onToggle = () => {
  if (props.disabled || props.loading) return;
  const next = !mergedChecked.value;
  if (props.value === undefined) {
    innerChecked.value = next;
  }
  emit('update:value', next);
  emit('change', next);
};

defineExpose({
  nativeElement: containerRef,
});

defineRender(() => {
  const { class: _c, style: attrStyle, ...restAttrs } = attrs as Record<string, any>;
  return wrapCSSVar(
    <div
      {...restAttrs}
      ref={containerRef}
      class={mergedCls.value}
      style={{
        ...(attrStyle as CSSProperties),
        ...(contextConfig.value as any).styles?.switch,
        ...props.styles?.root,
      }}
    >
      <Button
        disabled={props.disabled}
        loading={props.loading}
        class={classnames(`${switchCls}-content`, props.classNames?.content)}
        style={props.styles?.content}
        type={mergedChecked.value ? 'primary' : 'default'}
        ghost
        icon={props.icon as any}
        onClick={onToggle}
      >
        {mergedChecked.value ? props.checkedChildren : props.unCheckedChildren}
        {slots.default?.()}
      </Button>
    </div>,
  );
});
</script>
