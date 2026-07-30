<script setup lang="tsx">
import classnames from 'classnames';
import { useEventCallback } from '../_util/hooks/use-event-callback';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import BubbleSystem from './BubbleSystem.vue';
import BubbleDivider from './BubbleDivider.vue';
import type { BubbleRef, RolesType } from './interface';
import useDisplayData from './hooks/useDisplayData';
import useListData from './hooks/useListData';
import type { BubbleListProps } from './interface';
import useStyle from './style';
import {
  computed,
  type HTMLAttributes,
  mergeProps,
  onWatcherCleanup,
  ref,
  unref,
  useAttrs,
  watch,
  watchPostEffect,
  nextTick,
  type VNode,
} from 'vue';
import useState from '../_util/hooks/use-state';
import type { AvoidValidation } from '../type-utility';
import BubbleContextProvider from './context';

defineOptions({ name: 'AXBubbleList', inheritAttrs: false });

const attrs = useAttrs();

const TOLERANCE = 1;

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  items: itemsProp,
  autoScroll = true,
  roles: rolesProp,
  onScroll,
  classNames = {},
  styles = {},
  class: className,
  style,
  ...restProps
} = defineProps<BubbleListProps>();

const slots = defineSlots<{
  avatar?(props: { item: BubbleListProps['items'][number] }): VNode;
  header?(props: { item: BubbleListProps['items'][number] }): VNode | string;
  footer?(props: { item: BubbleListProps['items'][number] }): VNode | string;
  extra?(props: { item: BubbleListProps['items'][number] }): VNode | string;
  loading?(props: { item: BubbleListProps['items'][number] }): VNode;
  message?(props: { item: BubbleListProps['items'][number] }): VNode | string;
}>();

const domProps = computed(
  () =>
    pickAttrs(mergeProps(restProps, attrs), {
      attr: true,
      aria: true,
    }) as HTMLAttributes,
);

const items = ref<BubbleListProps['items']>(itemsProp);
const roles = ref<AvoidValidation<RolesType>>(rolesProp);

watch(
  () => itemsProp,
  () => {
    items.value = itemsProp;
  },
);

watch(
  () => rolesProp,
  () => {
    roles.value = rolesProp;
  },
);

const listRef = ref<HTMLDivElement>(null);
const bubbleRefs = ref<Record<string, BubbleRef>>({});

const { getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('bubble', customizePrefixCls);
const listPrefixCls = `${prefixCls}-list`;

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const [initialized, setInitialized] = useState(false);

watchPostEffect(() => {
  setInitialized(true);
  onWatcherCleanup(() => {
    setInitialized(false);
  });
});

// @ts-expect-error
const mergedData = useListData(items, roles);

const [displayData, onTypingComplete] = useDisplayData(mergedData);

const [scrollReachEnd, setScrollReachEnd] = useState(true);
const [updateCount, setUpdateCount] = useState(0);

const onInternalScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  setScrollReachEnd(
    target.scrollHeight - Math.abs(target.scrollTop) - target.clientHeight <= TOLERANCE,
  );
  onScroll?.(e);
};

watch([updateCount, listRef, scrollReachEnd], () => {
  if (autoScroll && unref(listRef) && unref(scrollReachEnd)) {
    nextTick(() => {
      unref(listRef)?.scrollTo({
        top: unref(listRef)!.scrollHeight,
      });
    });
  }
});

watch(
  () => unref(displayData).length,
  () => {
    if (autoScroll) {
      const lastItemKey = unref(displayData)[unref(displayData).length - 2]?.key;
      const bubbleInst = unref(bubbleRefs)[lastItemKey!];
      if (bubbleInst && unref(listRef)) {
        const { nativeElement } = bubbleInst;
        const { top = 0, bottom = 0 } = nativeElement?.getBoundingClientRect() ?? {};
        const { top: listTop, bottom: listBottom } = unref(listRef)!.getBoundingClientRect();
        const isVisible = top < listBottom && bottom > listTop;
        if (isVisible) {
          setUpdateCount(unref(updateCount) + 1);
          setScrollReachEnd(true);
        }
      }
    }
  },
);

const onBubbleUpdate = useEventCallback(() => {
  if (autoScroll) {
    setUpdateCount(unref(updateCount) + 1);
  }
});

const context = computed(() => ({
  onUpdate: onBubbleUpdate,
}));

const mergedRootCls = computed(() =>
  classnames(
    listPrefixCls,
    rootClassName,
    className,
    classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${listPrefixCls}-reach-end`]: scrollReachEnd.value,
    },
  ),
);

const mergedRootStyle = computed(() => ({
  ...((typeof style === 'object' ? style : {}) as Record<string, any>),
  ...((styles.root || {}) as Record<string, any>),
}));

defineRender(() => {
  return wrapCSSVar(
    <BubbleContextProvider value={context.value}>
      <div
        {...domProps.value}
        class={mergedRootCls.value}
        style={mergedRootStyle.value as any}
      >
        <div
          class={classnames(`${listPrefixCls}-scroll-box`, classNames.scroll)}
          style={(styles.scroll || {}) as any}
          ref={listRef}
          onScroll={onInternalScroll}
        >
          <div class={`${listPrefixCls}-scroll-content`}>
            {unref(displayData).map(
              ({
                key,
                status,
                extraInfo,
                role,
                onTypingComplete: onTypingCompleteBubble,
                classNames: itemClassNames = {},
                styles: itemStyles = {},
                class: itemClass,
                className: itemClassName,
                style: itemStyle,
                ...bubble
              }) => {
                const itemSlot = { key, status, extraInfo, role, ...bubble };
                const {
                  root: itemRootClass,
                  bubble: _b,
                  system: _s,
                  divider: _d,
                  ...otherItemClassNames
                } = itemClassNames as any;
                const {
                  root: itemRootStyle,
                  bubble: _bs,
                  system: _ss,
                  divider: _ds,
                  ...otherItemStyles
                } = itemStyles as any;

                const sharedSlotProps = {
                  avatar: slots.avatar
                    ? () => slots.avatar?.({ item: itemSlot })
                    : bubble.avatar,
                  header: slots.header?.({ item: itemSlot }) ?? bubble.header,
                  footer: slots.footer?.({ item: itemSlot }) ?? bubble.footer,
                  extra: slots.extra?.({ item: itemSlot }) ?? bubble.extra,
                  loadingRender: slots.loading
                    ? () => slots.loading!({ item: itemSlot })
                    : bubble.loadingRender,
                  content: slots.message?.({ item: itemSlot }) ?? bubble.content,
                  typing: initialized.value ? bubble.typing : false,
                  onTypingComplete: () => {
                    onTypingCompleteBubble?.();
                    onTypingComplete(key);
                  },
                };

                const bindRef = (node: any) => {
                  if (node) {
                    bubbleRefs.value[key] = node;
                  } else {
                    delete bubbleRefs.value[key];
                  }
                };

                const rootCls = itemRootClass || itemClass || itemClassName;
                const rootSty = itemRootStyle || itemStyle;

                if (role === 'divider') {
                  return (
                    <BubbleDivider
                      key={key}
                      content={sharedSlotProps.content}
                      class={rootCls || classNames.divider}
                      style={(rootSty || styles.divider) as any}
                      classNames={otherItemClassNames}
                      styles={otherItemStyles}
                      ref={bindRef}
                    />
                  );
                }

                if (role === 'system') {
                  return (
                    <BubbleSystem
                      key={key}
                      content={sharedSlotProps.content}
                      variant={(bubble as any).variant}
                      shape={(bubble as any).shape}
                      class={rootCls || classNames.system}
                      style={(rootSty || styles.system) as any}
                      classNames={otherItemClassNames}
                      styles={otherItemStyles}
                      ref={bindRef}
                    />
                  );
                }

                return (
                  <Bubble
                    key={key}
                    {...(bubble as any)}
                    {...sharedSlotProps}
                    _key={key}
                    status={status}
                    extraInfo={extraInfo}
                    class={rootCls || classNames.bubble}
                    style={(rootSty || styles.bubble) as any}
                    classNames={otherItemClassNames}
                    styles={otherItemStyles}
                    ref={bindRef}
                  />
                );
              },
            )}
          </div>
        </div>
      </div>
    </BubbleContextProvider>,
  );
});

defineExpose({
  nativeElement: listRef,
  scrollTo: ({
    key,
    offset,
    behavior = 'smooth',
    block,
  }: {
    offset?: number;
    key?: string | number;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }) => {
    if (typeof offset === 'number') {
      unref(listRef)?.scrollTo({
        top: offset,
        behavior,
      });
    } else if (key !== undefined) {
      const bubbleInst = unref(bubbleRefs)[key];
      if (bubbleInst) {
        const index = unref(displayData).findIndex((dataItem) => dataItem.key === key);
        setScrollReachEnd(index === unref(displayData).length - 1);
        bubbleInst.nativeElement.scrollIntoView({
          behavior,
          block,
        });
      }
    }
  },
});
</script>
