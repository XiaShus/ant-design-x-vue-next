<script setup lang="tsx">
import { Typography } from 'ant-design-vue';
import classnames from 'classnames';
import type { CSSProperties } from 'vue';
import { computed, useAttrs } from 'vue';
import { useXProviderContext } from '../x-provider';
import type { ActionsCopyProps } from './preset-types';
import useStyle from './style';

defineOptions({ name: 'AXActionsCopy', inheritAttrs: false });

const props = withDefaults(defineProps<ActionsCopyProps>(), {
  text: '',
  icon: undefined,
  prefixCls: undefined,
  rootClassName: '',
  classNames: () => ({}),
  styles: () => ({}),
});

const attrs = useAttrs();
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const copyCls = `${prefixCls}-copy`;

const mergedCls = computed(() =>
  classnames(
    prefixCls,
    `${prefixCls}-item`,
    hashId.value,
    cssVarCls,
    props.rootClassName,
    attrs.class as string,
    props.classNames?.root,
    {
      [`${copyCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

defineRender(() => {
  const { class: _c, style: attrStyle, ...restAttrs } = attrs as Record<string, any>;
  const copyable = props.icon
    ? ({ text: props.text, icon: props.icon } as any)
    : { text: props.text };
  return wrapCSSVar(
    <div class={mergedCls.value} style={{ ...(attrStyle as CSSProperties), ...props.styles?.root }}>
      <Typography.Text
        {...restAttrs}
        prefixCls={copyCls}
        copyable={copyable}
      />
    </div>,
  );
});
</script>
