<script setup lang="tsx">
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons-vue';
import classnames from 'classnames';
import type { CSSProperties, VNodeChild } from 'vue';
import type { ThoughtChainItemStatus } from './item-types';

defineOptions({ name: 'AXThoughtChainStatus' });

const props = defineProps<{
  prefixCls?: string;
  icon?: VNodeChild;
  status?: ThoughtChainItemStatus;
  className?: string;
  class?: string;
  style?: CSSProperties;
}>();

const StatusIcon: Record<ThoughtChainItemStatus, VNodeChild> = {
  loading: <LoadingOutlined />,
  error: <CloseCircleOutlined />,
  success: <CheckCircleOutlined />,
  abort: <MinusCircleOutlined />,
};

defineRender(() => {
  const statusCls = `${props.prefixCls}-status`;
  const iconNode = props.status ? StatusIcon[props.status] : props.icon;

  return (
    <div
      class={classnames(statusCls, props.className, props.class, {
        [`${statusCls}-${props.status}`]: props.status,
      })}
      style={props.style}
    >
      {iconNode}
    </div>
  );
});
</script>
