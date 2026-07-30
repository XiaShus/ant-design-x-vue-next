<script setup lang="tsx">
import { RightOutlined } from '@ant-design/icons-vue';
import classnames from 'classnames';
import { computed } from 'vue';
import { Typography } from 'ant-design-vue';
import { useGroupTitleContextInject } from './context';

defineOptions({ name: 'AXConversationsGroupTitle' });

const props = defineProps<{
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}>();

const slots = defineSlots<{
  default(props?: any): any;
}>();

const groupTitleContext = useGroupTitleContextInject();

const childNode = computed(() => slots.default?.());

const mergeCollapsible = computed(() => !!props.collapsible);

defineRender(() => {
  const prefixCls = groupTitleContext.value.prefixCls;
  return (
    <div
      class={classnames(`${prefixCls}-group-title`, {
        [`${prefixCls}-group-title-collapsible`]: mergeCollapsible.value,
      })}
      onClick={() => {
        if (mergeCollapsible.value) {
          props.onToggle?.();
        }
      }}
    >
      {childNode.value && (
        <div class={`${prefixCls}-group-label`}>
          <Typography.Text>{childNode.value}</Typography.Text>
        </div>
      )}
      {mergeCollapsible.value && (
        <div
          class={classnames(
            `${prefixCls}-group-collapse-trigger`,
            `${prefixCls}-group-collapse-trigger-${props.expanded ? 'open' : 'close'}`,
          )}
        >
          <RightOutlined />
        </div>
      )}
    </div>
  );
});
</script>
