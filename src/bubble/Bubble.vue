<script setup lang="tsx" generic="T extends BubbleContentType = string">
import { Avatar } from 'ant-design-vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import useTypedEffect from './hooks/useTypedEffect';
import useTypingConfig from './hooks/useTypingConfig';
import type { BubbleContentType, BubbleProps, EditableBubbleOption, InfoType } from './interface';
import EditableContent from './EditableContent.vue';
import Loading from './loading.vue';
import useStyle from './style';
import { useBubbleContextInject } from './context';
import { computed, isVNode, ref, toValue, unref, watch, watchEffect } from 'vue';
import type { VNode } from 'vue'

defineOptions({ name: "AXBubble" });

const props = defineProps<BubbleProps<T>>();
const {
  prefixCls: customizePrefixCls,
  rootClassName,
  // TODO: Vue's style is not necessarily an object, reconsider the design method in tsx.
  // style = {},
  classNames = {},
  styles = {},
  avatar,
  placement = 'start',
  loading = false,
  loadingRender,
  typing,
  content: contentProp = '',
  contentRender,
  messageRender,
  variant = 'filled',
  shape,
  onTypingComplete,
  header,
  footer,
  onEditConfirm,
  onEditCancel,
  editable: _editable,
  streaming: _streaming,
  footerPlacement: _footerPlacement,
  status: statusProp,
  extraInfo: extraInfoProp,
  _key,
  ...otherHtmlProps
} = props;

const slots = defineSlots<{
  avatar?(): VNode;
  header?(props: {
    content: T;
    info: InfoType;
  }): VNode | string;
  footer?(props: {
    content: T;
    info: InfoType;
  }): VNode | string;
  loading?(): VNode;
  content?(props: {
    content: T;
    info: InfoType;
  }): VNode | string;
  message?(props: {
    content: T;
    info?: InfoType;
  }): VNode | string;
}>();

const content = ref(contentProp);

watch(
  () => props.content,
  (v) => {
    content.value = (v ?? '') as any;
  },
);

const bubbleContextRef = useBubbleContextInject();

const renderInfo = computed<InfoType>(() => {
  const ctx = unref(bubbleContextRef) || {};
  return {
    key: _key ?? ctx.key,
    status: statusProp ?? ctx.status,
    extraInfo: extraInfoProp ?? ctx.extraInfo,
  };
});

// TODO: useTemplateRef will trigger warning when expose: [Vue warn] Set operation on key "value" failed: target is readonly.
// const divRef = useTemplateRef<HTMLDivElement>('div');
const divRef = ref<HTMLDivElement>(null);

// ============================ Prefix ============================
const { direction, getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('bubble', customizePrefixCls);

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('bubble');

// ============================ Typing ============================
const [typingEnabled, typingStep, typingInterval, typingSuffix, typingEffect, typingKeepPrefix] =
  useTypingConfig(() => props.typing);

const [typedContent, isTyping] = useTypedEffect(
  content,
  typingEnabled,
  typingStep,
  typingInterval,
  typingKeepPrefix,
);

const triggerTypingCompleteRef = ref(false);

watch(typedContent, (next) => {
  unref(bubbleContextRef)?.onUpdate?.();
  if (typeof next === 'string' && typeof content.value === 'string') {
    props.onTyping?.(next, content.value);
  }
});

watchEffect(() => {
  // streaming 进行中不触发 complete（对齐 React Bubble）
  if (!isTyping.value && !props.loading && !props.streaming) {
    if (!triggerTypingCompleteRef.value) {
      triggerTypingCompleteRef.value = true;
      props.onTypingComplete?.();
    }
  } else {
    triggerTypingCompleteRef.value = false;
  }
});

const mergedFooterPlacement = computed(() => {
  if (props.footerPlacement) return props.footerPlacement;
  return (props.placement || 'start') === 'start' ? 'outer-start' : 'outer-end';
});
const isFooterInner = computed(() => mergedFooterPlacement.value.includes('inner'));

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(() => prefixCls);

const mergedCls = computed(() => [
  prefixCls,
  rootClassName,
  contextConfig.value.className,
  hashId.value,
  cssVarCls,
  `${prefixCls}-${placement}`,
  {
    [`${prefixCls}-rtl`]: direction.value === 'rtl',
  },
  {
    [`${prefixCls}-typing`]:
      isTyping.value &&
      !loading &&
      !contentRender &&
      !messageRender &&
      !slots.content &&
      !slots.message &&
      !typingSuffix.value &&
      typingEffect.value === 'typing',
    [`${prefixCls}-fade-in`]: typingEnabled.value && typingEffect.value === 'fade-in',
  },
]);

const isVNodeArray = (val: any) => Array.isArray(val) && val.every(isVNode);

// ============================ Avatar ============================
const avatarNode = computed(() => {
  if (slots.avatar) {
    return slots.avatar();
  }
  return typeof avatar === 'function'
    ? avatar()
    : (isVNode(avatar) || isVNodeArray(avatar))
      ? avatar
      : <Avatar {...avatar} />;
});

const isEditing = computed(() => {
  const editable = props.editable ?? false;
  return typeof editable === 'boolean' ? editable : !!(editable as EditableBubbleOption)?.editing;
});

// =========================== Content ============================
const mergedContent = computed(() => {
  const info = renderInfo.value;
  const typed = typedContent.value as any;
  if (contentRender) {
    return contentRender(typed, info);
  }
  if (messageRender) {
    return messageRender(typed, info);
  }
  if (slots.content) {
    return slots.content({ content: typed, info });
  }
  if (slots.message) {
    return slots.message({ content: typed, info });
  }
  const rendered = typed;
  // fade-in：对当前可见字符串包一层动画节点
  if (
    typingEnabled.value &&
    typingEffect.value === 'fade-in' &&
    typeof rendered === 'string' &&
    isTyping.value
  ) {
    return <span class="fade-in">{rendered}</span>;
  }
  return rendered;
});

const renderFooterNode = () => {
  if (isEditing.value) return null;
  const info = renderInfo.value;
  const node = slots.footer
    ? slots.footer({ content: typedContent.value as T, info })
    : typeof footer === 'function'
      ? footer(typedContent.value as T, info)
      : footer;
  if (!node) return null;
  return (
    <div
      class={[
        `${prefixCls}-footer`,
        {
          [`${prefixCls}-footer-start`]: mergedFooterPlacement.value.includes('start'),
          [`${prefixCls}-footer-end`]: mergedFooterPlacement.value.includes('end'),
        },
        contextConfig.value.classNames.footer,
        classNames.footer,
      ]}
      style={{
        ...contextConfig.value.styles.footer,
        ...styles.footer,
      }}
    >
      {node}
    </div>
  );
};

// ============================ Render ============================
const contentNode = computed<VNode>(() => {
  if (loading) {
    if (slots.loading) {
      return slots.loading();
    }
    return loadingRender ? loadingRender() : <Loading prefixCls={prefixCls} />;
  }
  if (isEditing.value) {
    const editable = props.editable;
    const option = typeof editable === 'object' && editable ? editable : undefined;
    return (
      <EditableContent
        prefixCls={prefixCls}
        content={String(content.value)}
        okText={option?.okText}
        cancelText={option?.cancelText}
        onEditConfirm={(val: string) => onEditConfirm?.(val)}
        onEditCancel={() => onEditCancel?.()}
      />
    );
  }
  const body = (
    <>
      {mergedContent.value}
      {isTyping.value && toValue(typingSuffix)}
    </>
  );
  if (isFooterInner.value) {
    return (
      <div class={`${prefixCls}-content-with-footer`}>
        {body}
        {renderFooterNode()}
      </div>
    );
  }
  return body;
});

const fullContent = computed<VNode>(() => {
  const _content = (
    <div
      style={{
        ...contextConfig.value.styles.content,
        ...styles.content,
      }}
      class={[
        `${prefixCls}-content`,
        `${prefixCls}-content-${variant}`,
        { [`${prefixCls}-content-${shape}`]: shape },
        { [`${prefixCls}-content-editing`]: isEditing.value },
        contextConfig.value.classNames.content,
        classNames.content,
      ]}
    >
      {toValue(contentNode)}
    </div>
  );
  const info = renderInfo.value;
  const _header = slots.header
    ? slots.header({ content: typedContent.value as T, info })
    : typeof header === 'function'
      ? header(typedContent.value as T, info)
      : header;
  const _footerOuter = !isFooterInner.value ? renderFooterNode() : null;

  if (_header || _footerOuter) {
    return (
      <div class={`${prefixCls}-content-wrapper`}>
        {_header && (
          <div
            class={[
              `${prefixCls}-header`,
              contextConfig.value.classNames.header,
              classNames.header,
            ]}
            style={{
              ...contextConfig.value.styles.header,
              ...styles.header,
            }}
          >
            {_header}
          </div>
        )}
        {_content}
        {_footerOuter}
      </div>
    );
  }
  return _content;
});

defineRender(() => {
  return wrapCSSVar(
    <div
      style={{
        ...(contextConfig.value.style as object),
        // ...(style as object),
      }}
      class={toValue(mergedCls)}
      {...otherHtmlProps}
      ref={divRef}
    >
      {/* Avatar */}
      {(slots.avatar || avatar) && (
        <div
          style={{
            ...contextConfig.value.styles.avatar,
            ...styles.avatar,
          }}
          class={[
            `${prefixCls}-avatar`,
            contextConfig.value.classNames.avatar,
            classNames.avatar,
          ]}
        >
          {toValue(avatarNode)}
        </div>
      )}

      {/* Content */}
      {toValue(fullContent)}
    </div>,
  );
});

defineExpose({
  nativeElement: divRef,
});
</script>
