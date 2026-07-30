<script setup lang="tsx">
import classnames from 'classnames';
import { computed, ref, watch, type VNode } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { Popover } from 'ant-design-vue';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import TransitionCollapse from '../transition-collapse';
import CarouselCard from './CarouselCard.vue';
import useStyle from './style';
import type { SourcesItem, SourcesProps, SourcesSlots } from './interface';

defineOptions({ name: 'AXSources' });

const props = withDefaults(defineProps<SourcesProps>(), {
  defaultExpanded: true,
  expandIconPosition: 'start',
  inline: false,
  expanded: undefined,
  popoverOverlayWidth: 300,
  styles: () => ({}),
  classNames: () => ({}),
});

const slots = defineSlots<SourcesSlots>();

const emit = defineEmits<{
  expand: [expand: boolean];
  click: [item: SourcesItem];
}>();

const sourcesRef = ref<HTMLDivElement | null>(null);

const domProps = computed(() => {
  const attrs = pickAttrs(props, {
    attr: true,
    aria: true,
    data: true,
  });
  const { title: _title, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('sources', props.prefixCls));
const contextConfig = useXComponentConfig('sources');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const innerExpanded = ref(props.expanded ?? props.defaultExpanded ?? true);
watch(
  () => props.expanded,
  (val) => {
    if (val !== undefined) {
      innerExpanded.value = val;
    }
  },
);
const isExpand = computed(() =>
  props.expanded !== undefined ? Boolean(props.expanded) : Boolean(innerExpanded.value),
);

const handleExpand = (next: boolean) => {
  if (props.expanded === undefined) {
    innerExpanded.value = next;
  }
  props.onExpand?.(next);
  emit('expand', next);
};

const resolveNode = (value: unknown, slotFn?: () => any) => {
  if (slotFn) return slotFn();
  if (typeof value === 'function') return (value as () => VNode | string)();
  return value as any;
};

const titleNode = computed(() => resolveNode(props.title, slots.title));

const handleItemClick = (item: SourcesItem) => {
  props.onClick?.(item);
  emit('click', item);
};

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    props.className,
    props.class,
    props.rootClassName,
    props.classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-inline`]: props.inline,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const overlayWidth = computed(() =>
  typeof props.popoverOverlayWidth === 'number'
    ? `${props.popoverOverlayWidth}px`
    : props.popoverOverlayWidth,
);

defineRender(() => {
  const contentNode = props.items ? (
    <ul class={`${prefixCls.value}-list`}>
      {props.items.map((item, index) => (
        <li
          key={item.key ?? index}
          class={`${prefixCls.value}-list-item`}
          onClick={() => handleItemClick(item)}
        >
          <a
            class={`${prefixCls.value}-link`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.icon && <span class={`${prefixCls.value}-link-icon`}>{item.icon}</span>}
            <span class={`${prefixCls.value}-link-title`}>{item.title}</span>
          </a>
        </li>
      ))}
    </ul>
  ) : (
    slots.default?.()
  );

  return wrapCSSVar(
    <div
      {...domProps.value}
      ref={sourcesRef}
      class={mergedCls.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...(typeof contextConfig.value.styles?.root === 'object'
          ? contextConfig.value.styles.root
          : {}),
        ...(typeof props.style === 'object' ? props.style : {}),
        ...props.styles.root,
      }}
    >
      {props.inline ? (
        <Popover
          placement="top"
          overlayStyle={{ width: overlayWidth.value }}
          v-slots={{
            content: () => (
              <CarouselCard
                className={classnames(
                  prefixCls.value,
                  hashId.value,
                  cssVarCls,
                  props.classNames.content,
                )}
                style={props.styles.content}
                activeKey={props.activeKey as any}
                prefixCls={prefixCls.value}
                items={props.items}
                onClick={handleItemClick}
              />
            ),
          }}
        >
          <div
            class={classnames(
              prefixCls.value,
              `${prefixCls.value}-title-wrapper`,
              props.classNames.title,
            )}
            style={props.styles.title}
          >
            <span class={`${prefixCls.value}-title`}>{titleNode.value}</span>
          </div>
        </Popover>
      ) : (
        <>
          <div
            class={classnames(
              `${prefixCls.value}-title-wrapper`,
              `${prefixCls.value}-icon-position-${props.expandIconPosition}`,
              props.classNames.title,
            )}
            style={props.styles.title}
            onClick={() => handleExpand(!isExpand.value)}
          >
            <RightOutlined
              class={`${prefixCls.value}-title-down-icon`}
              rotate={isExpand.value ? 90 : 0}
            />
            <span class={`${prefixCls.value}-title`}>{titleNode.value}</span>
          </div>
          <TransitionCollapse prefixCls={prefixCls.value}>
            {isExpand.value ? (
              <div
                key="sources-content"
                class={classnames(`${prefixCls.value}-content`, props.classNames.content)}
                style={props.styles.content}
              >
                {contentNode}
              </div>
            ) : null}
          </TransitionCollapse>
        </>
      )}
    </div>,
  );
});

defineExpose({
  nativeElement: sourcesRef,
});
</script>
