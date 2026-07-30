<script setup lang="tsx" generic="T extends BubbleContentType = string">
import classnames from 'classnames';
import { computed, useAttrs } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import type { BubbleContentType, SystemBubbleProps } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXBubbleSystem', inheritAttrs: false });

const props = withDefaults(defineProps<SystemBubbleProps<T>>(), {
  variant: 'shadow',
  rootClassName: '',
  styles: () => ({}),
  classNames: () => ({}),
});

const attrs = useAttrs();
const contextConfig = useXComponentConfig('bubble');
const { getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('bubble', props.prefixCls);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(() => prefixCls);

const rootMergedCls = computed(() =>
  classnames(
    hashId.value,
    cssVarCls,
    `${prefixCls}-system`,
    prefixCls,
    contextConfig.value.className,
    (contextConfig.value.classNames as any)?.root,
    (props.classNames as any)?.root,
    attrs.class as string,
    props.rootClassName,
  ),
);

defineRender(() => {
  const { class: _c, style: attrStyle, ...restAttrs } = attrs as Record<string, any>;
  return wrapCSSVar(
    <Bubble
      {...restAttrs}
      {...(props as any)}
      class={rootMergedCls.value}
      style={attrStyle}
      variant={props.variant}
      shape={props.shape}
      content={props.content}
      styles={props.styles}
      classNames={props.classNames}
      rootClassName={props.rootClassName}
      prefixCls={props.prefixCls}
    />,
  );
});
</script>
