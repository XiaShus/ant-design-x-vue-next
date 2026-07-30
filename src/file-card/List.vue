<script setup lang="tsx">
import classnames from 'classnames';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import { useXProviderContext } from '../x-provider';
import FileCard from './FileCard.vue';
import useStyle from './style';
import type { FileCardListProps, FileCardProps } from './interface';

defineOptions({ name: 'AXFileCardList' });

const props = withDefaults(defineProps<FileCardListProps>(), {
  styles: () => ({}),
  classNames: () => ({}),
});

const emit = defineEmits<{
  remove: [item: FileCardProps];
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const list = ref<(FileCardProps & { key: string | number })[]>([]);

watch(
  () => props.items,
  (items) => {
    list.value = items.map((item, index) => ({
      ...item,
      key: `${item.name}-${index}`,
    }));
  },
  { immediate: true, deep: true },
);

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('file-card', props.prefixCls));
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const compCls = computed(() => `${prefixCls.value}-list`);

const pingStart = ref(false);
const pingEnd = ref(false);

const checkPing = () => {
  const el = containerRef.value;
  if (!el) return;
  if (props.overflow === 'scrollX') {
    pingStart.value = Math.abs(el.scrollLeft) >= 1;
    pingEnd.value = el.scrollWidth - el.clientWidth - Math.abs(el.scrollLeft) >= 1;
  } else if (props.overflow === 'scrollY') {
    pingStart.value = el.scrollTop !== 0;
    pingEnd.value = el.scrollHeight - el.clientHeight !== el.scrollTop;
  }
};

onMounted(() => {
  nextTick(checkPing);
});

watch(
  () => [list.value, props.overflow],
  () => nextTick(checkPing),
);

const onScrollOffset = (offset: -1 | 1) => {
  const el = containerRef.value;
  if (!el) return;
  el.scrollTo({
    left: el.scrollLeft + offset * el.clientWidth,
    behavior: 'smooth',
  });
};

const handleRemove = (item: FileCardProps & { key: string | number }) => {
  list.value = list.value.filter((i) => i.key !== item.key);
  props.onRemove?.(item);
  emit('remove', item);
};

const mergedCls = computed(() =>
  classnames(
    compCls.value,
    props.rootClassName,
    props.className,
    props.class,
    props.classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
  ),
);

defineRender(() => {
  const { root: _root, card: classNameCard, ...classNameOther } = props.classNames || {};
  const { root: styleRoot, card: styleCard, ...styleOther } = props.styles || {};

  return wrapCSSVar(
    <div class={mergedCls.value}>
      <div
        ref={containerRef}
        class={classnames(`${compCls.value}-content`, {
          [`${compCls.value}-overflow-${props.overflow}`]: props.overflow,
          [`${compCls.value}-overflow-ping-start`]: pingStart.value,
          [`${compCls.value}-overflow-ping-end`]: pingEnd.value,
          [`${compCls.value}-small`]: props.size === 'small',
        })}
        dir={direction.value}
        style={{ ...props.style, ...styleRoot }}
        onScroll={checkPing}
      >
        {list.value.map((item) => {
          const { key, ...cardProps } = item;
          return (
          <div class={`${compCls.value}-item`} key={key}>
            <FileCard
              {...cardProps}
              size={props.size}
              className={classnames(item.className, classNameCard)}
              classNames={{ ...classNameOther, ...item.classNames }}
              style={{ ...item.style, ...styleCard }}
              styles={styleOther as any}
            />

            {(typeof props.removable === 'function'
              ? props.removable(item)
              : props.removable) && (
              <div class={`${compCls.value}-remove`} onClick={() => handleRemove(item)}>
                <CloseCircleFilled />
              </div>
            )}
          </div>
          );
        })}

        {props.overflow === 'scrollX' && (
          <>
            <Button
              size="small"
              shape="circle"
              class={`${compCls.value}-prev-btn`}
              icon={<LeftOutlined />}
              onClick={() => onScrollOffset(-1)}
            />
            <Button
              size="small"
              shape="circle"
              class={`${compCls.value}-next-btn`}
              icon={<RightOutlined />}
              onClick={() => onScrollOffset(1)}
            />
          </>
        )}
        {props.extension}
      </div>
    </div>,
  );
});
</script>
