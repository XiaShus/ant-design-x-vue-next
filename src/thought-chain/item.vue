<script setup lang="tsx">
import classnames from 'classnames';
import { computed, useId } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import type { ThoughtChainNodeProps } from './interface';
import { useThoughtChainNodeContextInject } from './context';
import { Avatar, Typography, Tooltip, type TooltipProps } from 'ant-design-vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { TransitionCollapse } from '../transition-collapse';

defineOptions({ name: 'AXThoughtChainNode' });

const props = withDefaults(defineProps<ThoughtChainNodeProps>(), {
  info: () => ({}),
});

const domProps = computed(() => {
  const attrs = pickAttrs(props as Record<string, unknown>, {
    attr: true,
    aria: true,
    data: true,
  }) as Record<string, unknown>;
  const { class: _class, style: _style, onClick: _onClick, ...rest } = attrs;
  return rest;
});

// ================= ThoughtChainNodeContext ====================
const thoughtChainNodeContext = useThoughtChainNodeContextInject();
const prefixCls = computed(() => thoughtChainNodeContext.value.prefixCls);
const enableCollapse = computed(() => thoughtChainNodeContext.value.enableCollapse);
const expandedKeys = computed(() => thoughtChainNodeContext.value.expandedKeys);
const direction = computed(() => thoughtChainNodeContext.value.direction);
const classNames = computed(() => thoughtChainNodeContext.value.classNames);
const styles = computed(() => thoughtChainNodeContext.value.styles);

// ============================ Info ============================
const id = useId();
const info = computed(() => props.info || {});

const key = computed(() => info.value.key ?? id);
const icon = computed(() => info.value.icon);
const title = computed(() => info.value.title);
const extra = computed(() => info.value.extra);
const content = computed(() => info.value.content);
const footer = computed(() => info.value.footer);
const normalizeStatus = (raw?: string) => (raw === 'pending' ? 'loading' : raw);

/** Normalize deprecated `pending` → `loading` for class / line colors */
const status = computed(() => normalizeStatus(info.value.status));
const nextStatus = computed(() => normalizeStatus(props.nextStatus));
const description = computed(() => info.value.description);
const blink = computed(() => !!info.value.blink);
const destroyOnHidden = computed(() => info.value.destroyOnHidden !== false);

/** Per-item collapsible, falling back to chain-level `collapsible` compat */
const itemCollapsible = computed(() => {
  if (info.value.collapsible !== undefined) {
    return !!info.value.collapsible;
  }
  return !!enableCollapse.value;
});

const tooltip = computed(() => {
  const tooltipConfig = info.value.tooltip ?? true;
  const placement = direction.value === 'rtl' ? 'topRight' : 'topLeft';
  const titleConfig: TooltipProps = {
    title: title.value,
    placement,
  };
  const descriptionConfig: TooltipProps = {
    title: description.value,
    placement,
  };

  if (typeof tooltipConfig === 'boolean') {
    return { titleConfig, descriptionConfig };
  }

  return {
    titleConfig: {
      ...titleConfig,
      ...(tooltipConfig.titleConfig ? tooltipConfig.titleConfig : {}),
    },
    descriptionConfig: {
      ...descriptionConfig,
      ...(tooltipConfig.descriptionConfig ? tooltipConfig.descriptionConfig : {}),
    },
  };
});
const hideTooltip = computed(() => !info.value.tooltip);

// ============================ Style ============================
const itemCls = computed(() => `${prefixCls.value}-item`);

// ============================ Event ============================
const onThoughtChainNodeClick = () => {
  if (!itemCollapsible.value || !content.value) return;
  props.onClick?.(key.value);
};

// ============================ Content Open ============================
const contentOpen = computed(() => expandedKeys.value?.includes(key.value) ?? false);
const contentShown = computed(() => (itemCollapsible.value ? contentOpen.value : true));
/** Mount content: destroy when collapsed if destroyOnHidden (default true) */
const contentMounted = computed(() => {
  if (!content.value) return false;
  if (!itemCollapsible.value) return true;
  if (contentShown.value) return true;
  return !destroyOnHidden.value;
});

defineRender(() => {
  return (
    <div
      {...domProps.value}
      class={classnames(
        itemCls.value,
        {
          [`${itemCls.value}-${status.value}${nextStatus.value ? `-${nextStatus.value}` : ''}`]:
            status.value,
        },
        props.class,
      )}
      style={props.style}
    >
      {/* Header */}
      <div
        class={classnames(`${itemCls.value}-header`, classNames.value?.itemHeader)}
        style={styles.value?.itemHeader}
        onClick={onThoughtChainNodeClick}
      >
        {/* Avatar */}
        <Avatar icon={icon.value} class={`${itemCls.value}-icon`} />
        {/* Header */}
        <div
          class={classnames(`${itemCls.value}-header-box`, {
            [`${itemCls.value}-collapsible`]: itemCollapsible.value && content.value,
          })}
        >
          {/* Title */}
          <Typography.Text
            strong
            // @ts-expect-error
            class={classnames(`${itemCls.value}-title`, {
              [`${prefixCls.value}-motion-blink`]: blink.value,
            })}
          >
            {itemCollapsible.value &&
              content.value &&
              (direction.value === 'rtl' ? (
                <LeftOutlined
                  class={`${itemCls.value}-collapse-icon`}
                  rotate={contentOpen.value ? -90 : 0}
                />
              ) : (
                <RightOutlined
                  class={`${itemCls.value}-collapse-icon`}
                  rotate={contentOpen.value ? 90 : 0}
                />
              ))}
            {hideTooltip.value ? (
              title.value
            ) : (
              <Tooltip {...tooltip.value.titleConfig}>{title.value}</Tooltip>
            )}
          </Typography.Text>
          {/* Description */}
          {description.value && (
            <Typography.Text
              // @ts-expect-error
              class={`${itemCls.value}-desc`}
              type="secondary"
            >
              {hideTooltip.value ? (
                description.value
              ) : (
                <Tooltip {...tooltip.value.descriptionConfig}>{description.value}</Tooltip>
              )}
            </Typography.Text>
          )}
        </div>
        {/* Extra */}
        {extra.value && <div class={`${itemCls.value}-extra`}>{extra.value}</div>}
      </div>
      {/* Content */}

      <TransitionCollapse prefixCls={prefixCls.value}>
        {contentMounted.value ? (
          <div
            v-show={contentShown.value}
            key={`content-${key.value}`}
            class={classnames(`${itemCls.value}-content`)}
          >
            <div
              class={classnames(`${itemCls.value}-content-box`, classNames.value?.itemContent)}
              style={styles.value?.itemContent}
            >
              {content.value}
            </div>
          </div>
        ) : null}
      </TransitionCollapse>

      {/* Footer */}
      {footer.value && (
        <div
          class={classnames(`${itemCls.value}-footer`, classNames.value?.itemFooter)}
          style={styles.value?.itemFooter}
        >
          {footer.value}
        </div>
      )}
    </div>
  );
});
</script>
