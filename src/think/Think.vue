<script setup lang="tsx">
import classnames from 'classnames';
import { computed, ref, watch, type VNode } from 'vue';
import { LoadingOutlined, RightOutlined } from '@ant-design/icons-vue';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import TransitionCollapse from '../transition-collapse';
import ThinkIcon from './ThinkIcon.vue';
import useStyle from './style';
import type { ThinkProps, ThinkSlots } from './interface';

defineOptions({ name: 'AXThink' });

const props = withDefaults(defineProps<ThinkProps>(), {
  defaultExpanded: true,
  destroyOnHidden: true,
  // Keep undefined so uncontrolled mode is distinguishable from expanded=false
  expanded: undefined,
  styles: () => ({}),
  classNames: () => ({}),
});

const slots = defineSlots<ThinkSlots>();

const emit = defineEmits<{
  expand: [expand: boolean];
}>();

const domProps = computed(() => {
  const attrs = pickAttrs(props, {
    attr: true,
    aria: true,
    data: true,
  });
  // Avoid leaking component props like `title` onto the root DOM node
  const { title: _title, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

// ============================ Prefix ============================
const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('think', props.prefixCls));

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('think');

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================ Expand ============================
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

const handleExpand = (nextExpand: boolean) => {
  if (props.expanded === undefined) {
    innerExpanded.value = nextExpand;
  }
  props.onExpand?.(nextExpand);
  emit('expand', nextExpand);
};

// ============================ Nodes ============================
const resolveNode = (value: unknown, slotFn?: () => any) => {
  if (slotFn) return slotFn();
  if (typeof value === 'function') return (value as () => VNode | string)();
  return value as any;
};

const statusIconNode = computed(() => {
  const loadingNode = resolveNode(props.loading, slots.loading);
  if (loadingNode) {
    return loadingNode === true ? <LoadingOutlined /> : loadingNode;
  }
  const iconNode = resolveNode(props.icon, slots.icon);
  return iconNode || <ThinkIcon />;
});

const titleNode = computed(() => resolveNode(props.title, slots.title));

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
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const contentVisible = computed(() => !props.destroyOnHidden || isExpand.value);

defineRender(() => {
  return wrapCSSVar(
    <div
      {...domProps.value}
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
      <div
        class={classnames(`${prefixCls.value}-status-wrapper`, props.classNames.status)}
        style={props.styles.status}
        onClick={() => handleExpand(!isExpand.value)}
      >
        <div class={`${prefixCls.value}-status-icon`}>{statusIconNode.value}</div>
        <div
          class={classnames(`${prefixCls.value}-status-text`, {
            [`${prefixCls.value}-motion-blink`]: props.blink,
          })}
        >
          {titleNode.value}
        </div>
        <RightOutlined
          class={`${prefixCls.value}-status-down-icon`}
          rotate={isExpand.value ? 90 : 0}
        />
      </div>
      <TransitionCollapse prefixCls={prefixCls.value}>
        {contentVisible.value ? (
          <div v-show={isExpand.value} key="think-content">
            <div
              class={classnames(`${prefixCls.value}-content`, props.classNames.content)}
              style={props.styles.content}
            >
              {slots.default?.()}
            </div>
          </div>
        ) : null}
      </TransitionCollapse>
    </div>,
  );
});
</script>
