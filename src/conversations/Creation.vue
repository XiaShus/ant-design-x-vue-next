<script setup lang="tsx">
import { PlusOutlined } from '@ant-design/icons-vue';
import classnames from 'classnames';
import { computed, useAttrs } from 'vue';
import useLocale from '../locale/useLocale';
import type { CreationProps } from './creation-types';
import useStyle from './style';

defineOptions({ name: 'AXConversationsCreation', inheritAttrs: false });

const props = withDefaults(defineProps<CreationProps>(), {
  align: 'center',
  disabled: false,
  label: undefined,
  icon: undefined,
  prefixCls: 'ant-conversations-creation',
  className: '',
  style: () => ({}),
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const attrs = useAttrs();
const [locale] = useLocale('Conversations');
const creationPrefix = computed(() => props.prefixCls || 'ant-conversations-creation');
const stylePrefix = computed(() => creationPrefix.value.replace(/-creation$/, '') || 'ant-conversations');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(stylePrefix);

const iconNode = computed(() => {
  if (props.icon) {
    return typeof props.icon === 'function' ? props.icon() : props.icon;
  }
  return <PlusOutlined class={`${creationPrefix.value}-icon`} />;
});

const labelNode = computed(() => {
  if (props.label !== undefined && props.label !== null) {
    return typeof props.label === 'function' ? props.label() : props.label;
  }
  return (
    <div class={`${creationPrefix.value}-label`}>
      <span>{locale.value.create}</span>
    </div>
  );
});

const mergedCls = computed(() =>
  classnames(
    creationPrefix.value,
    props.className,
    attrs.class as string,
    `${creationPrefix.value}-${props.align || 'center'}`,
    hashId.value,
    cssVarCls,
    {
      [`${creationPrefix.value}-disabled`]: props.disabled,
    },
  ),
);

const onClick = (e: MouseEvent) => {
  if (props.disabled) return;
  props.onClick?.(e);
  emit('click', e);
};

defineRender(() => {
  const { class: _c, style: attrStyle, onClick: _oc, ...rest } = attrs as Record<string, any>;
  return wrapCSSVar(
    <button
      type="button"
      {...rest}
      disabled={props.disabled}
      onClick={onClick}
      style={{ ...props.style, ...(attrStyle as object) }}
      class={mergedCls.value}
    >
      {iconNode.value}
      {labelNode.value}
    </button>,
  );
});
</script>
