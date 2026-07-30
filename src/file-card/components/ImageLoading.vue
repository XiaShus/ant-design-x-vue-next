<script setup lang="tsx">
import { Flex, Spin } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, type CSSProperties } from 'vue';
import ImageIcon from '../icons/ImageIcon.vue';
import type { FileCardSpinProps } from '../interface';
import usePercent from './usePercent';

defineOptions({ name: 'AXFileCardImageLoading' });

const props = defineProps<{
  prefixCls?: string;
  style?: CSSProperties;
  className?: string;
  spinProps?: FileCardSpinProps;
}>();

const size = computed(() => {
  const raw = (props.spinProps?.size ?? 'middle') as string;
  // ant-design-vue Spin uses default; React uses middle
  if (raw === 'middle' || raw === 'medium') return 'default';
  return raw as 'small' | 'default' | 'large';
});

const showText = computed(() => props.spinProps?.showText !== false);

const percentInput = computed(
  () =>
    (typeof props.spinProps?.percent === 'undefined' ? 'auto' : props.spinProps.percent) as
      | number
      | 'auto',
);

const [mergedPercent, percentText] = usePercent(true, percentInput);

const iconNode = computed(
  () =>
    props.spinProps?.icon ?? (
      <ImageIcon color="rgba(0,0,0,.45)" size={props.spinProps?.size || 'middle'} />
    ),
);

const spinPassthrough = computed(() => {
  const { showText: _st, icon: _icon, percent: _p, size: _size, ...rest } = props.spinProps || {};
  return rest;
});

defineRender(() => (
  <div
    class={classnames(`${props.prefixCls}-image-loading`, props.className)}
    style={props.style}
  >
    <div class={classnames(`${props.prefixCls}-image-skeleton`, 'ant-skeleton-node')}>
      <Flex
        class={classnames(`${props.prefixCls}-image-spin`, {
          [`${props.prefixCls}-image-spin-${size.value}`]: size.value,
        })}
        align="center"
        gap="small"
      >
        <Spin size={size.value as any} {...spinPassthrough.value} />
        {showText.value && (
          <div class={`${props.prefixCls}-image-spin-text`} data-percent={mergedPercent.value}>
            {percentText.value}
          </div>
        )}
      </Flex>
      {iconNode.value}
    </div>
  </div>
));
</script>
