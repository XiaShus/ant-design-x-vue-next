<script setup lang="tsx" generic="T extends BubbleContentType = string">
import { Divider } from 'ant-design-vue';
import classnames from 'classnames';
import type { CSSProperties } from 'vue';
import { computed, ref, useAttrs } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import type { BubbleContentType, BubbleRef, DividerBubbleProps } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXBubbleDivider', inheritAttrs: false });

const props = withDefaults(defineProps<DividerBubbleProps<T>>(), {
  content: '' as any,
  rootClassName: '',
  styles: () => ({}),
  classNames: () => ({}),
  dividerProps: () => ({}),
});

const attrs = useAttrs();
const bubbleRef = ref<BubbleRef>();
const contextConfig = useXComponentConfig('bubble');
const { getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('bubble', props.prefixCls);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(() => prefixCls);

defineExpose({
  get nativeElement() {
    return bubbleRef.value?.nativeElement;
  },
});

const rootMergedCls = computed(() =>
  classnames(
    hashId.value,
    cssVarCls,
    prefixCls,
    `${prefixCls}-divider`,
    contextConfig.value.className,
    (contextConfig.value.classNames as any)?.root,
    attrs.class as string,
    (props.classNames as any)?.root,
    props.rootClassName,
  ),
);

const messageRender = (content: T) => (
  <Divider {...(props.dividerProps as any)}>{content as any}</Divider>
);

defineRender(() => {
  const { class: _c, style: attrStyle, ...restAttrs } = attrs as Record<string, any>;
  return wrapCSSVar(
    <Bubble
      {...restAttrs}
      ref={bubbleRef}
      class={rootMergedCls.value}
      style={attrStyle as CSSProperties}
      styles={props.styles}
      classNames={props.classNames}
      prefixCls={prefixCls}
      variant="borderless"
      content={props.content}
      messageRender={messageRender as any}
    />,
  );
});
</script>
