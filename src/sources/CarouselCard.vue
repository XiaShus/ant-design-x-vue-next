<script setup lang="tsx">
import classnames from 'classnames';
import { computed, ref, watch } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Carousel } from 'ant-design-vue';
import type { SourcesItem } from './interface';

defineOptions({ name: 'AXSourcesCarouselCard' });

const props = defineProps<{
  prefixCls: string;
  items?: SourcesItem[];
  activeKey?: string | number;
  className?: string;
  style?: Record<string, any>;
  onClick?: (item: SourcesItem) => void;
}>();

const compCls = computed(() => `${props.prefixCls}-carousel`);

const activeSlideIndex = computed(() => {
  const idx = props.items?.findIndex(({ key }) => key === props.activeKey) ?? 0;
  return Math.max(0, idx);
});

const slide = ref(activeSlideIndex.value);
const carouselRef = ref<{ goTo?: (slide: number, dontAnimate?: boolean) => void } | null>(null);

watch(
  activeSlideIndex,
  (next) => {
    slide.value = next;
    carouselRef.value?.goTo?.(next, false);
  },
  { immediate: true },
);

const handleClick = (item: SourcesItem) => {
  if (item.url) {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  }
  props.onClick?.(item);
};

const goPrev = () => {
  if (slide.value > 0) {
    const next = slide.value - 1;
    slide.value = next;
    carouselRef.value?.goTo?.(next, false);
  }
};

const goNext = () => {
  const max = (props.items?.length || 1) - 1;
  if (slide.value < max) {
    const next = slide.value + 1;
    slide.value = next;
    carouselRef.value?.goTo?.(next, false);
  }
};

defineRender(() => {
  return (
    <div style={props.style} class={classnames(`${compCls.value}-wrapper`, props.className)}>
      <div class={`${compCls.value}-title`}>
        <div class={`${compCls.value}-btn-wrapper`}>
          <span
            class={classnames(`${compCls.value}-btn`, `${compCls.value}-left-btn`, {
              [`${compCls.value}-btn-disabled`]: slide.value === 0,
            })}
            onClick={goPrev}
          >
            <LeftOutlined />
          </span>
          <span
            class={classnames(`${compCls.value}-btn`, `${compCls.value}-right-btn`, {
              [`${compCls.value}-btn-disabled`]:
                slide.value === (props.items?.length || 1) - 1,
            })}
            onClick={goNext}
          >
            <RightOutlined />
          </span>
        </div>
        <div class={`${compCls.value}-page`}>{`${slide.value + 1}/${props.items?.length || 1}`}</div>
      </div>
      <Carousel
        class={compCls.value}
        ref={carouselRef as any}
        arrows={false}
        infinite={false}
        dots={false}
        afterChange={(current: number) => {
          slide.value = current;
        }}
      >
        {props.items?.map((item, index) => (
          <div
            key={item.key ?? index}
            class={`${compCls.value}-item`}
            onClick={() => handleClick(item)}
          >
            <div class={`${compCls.value}-item-title-wrapper`}>
              {item.icon && <span class={`${compCls.value}-item-icon`}>{item.icon}</span>}
              <span class={`${compCls.value}-item-title`}>{item.title}</span>
            </div>
            {item.description && (
              <div class={`${compCls.value}-item-description`}>{item.description}</div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
});
</script>
