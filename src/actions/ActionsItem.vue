<script setup lang="tsx">
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import classnames from 'classnames';
import type { CSSProperties, VNodeChild } from 'vue';
import { computed, useAttrs } from 'vue';
import { useMobile } from '../_util/hooks/use-mobile';
import { useXProviderContext } from '../x-provider';
import {
  ACTIONS_ITEM_STATUS,
  type ActionsItemSemanticType,
} from './constants';
import type { ActionsItemProps } from './preset-types';
import useStyle from './style';

defineOptions({ name: 'AXActionsItem', inheritAttrs: false });

const props = withDefaults(defineProps<ActionsItemProps>(), {
  status: 'default',
  defaultIcon: undefined,
  label: undefined,
  runningIcon: undefined,
  prefixCls: undefined,
  rootClassName: '',
  classNames: () => ({}),
  styles: () => ({}),
});

const attrs = useAttrs();
const isMobile = useMobile();
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const itemCls = `${prefixCls}-button-item`;

const mergedCls = computed(() =>
  classnames(
    itemCls,
    hashId.value,
    cssVarCls,
    props.rootClassName,
    attrs.class as string,
    props.classNames?.root,
    prefixCls,
    `${prefixCls}-item`,
    {
      [`${itemCls}-rtl`]: direction.value === 'rtl',
      [`${props.classNames?.[props.status as ActionsItemSemanticType]}`]:
        props.classNames?.[props.status as ActionsItemSemanticType],
    },
  ),
);

defineRender(() => {
  const status = props.status as ACTIONS_ITEM_STATUS;
  const StatusIcon: Record<string, VNodeChild> = {
    [ACTIONS_ITEM_STATUS.LOADING]: <LoadingOutlined />,
    [ACTIONS_ITEM_STATUS.ERROR]: <CloseCircleOutlined />,
    [ACTIONS_ITEM_STATUS.RUNNING]: props.runningIcon,
    [ACTIONS_ITEM_STATUS.DEFAULT]: props.defaultIcon,
  };
  const iconNode = status && StatusIcon[status] ? StatusIcon[status] : props.defaultIcon;
  const { class: _c, style: attrStyle, ...restAttrs } = attrs as Record<string, any>;

  const innerNode = (
    <div
      {...restAttrs}
      class={mergedCls.value}
      style={{
        ...(attrStyle as CSSProperties),
        ...props.styles?.root,
        ...props.styles?.[status as ActionsItemSemanticType],
      }}
    >
      {iconNode}
    </div>
  );

  return wrapCSSVar(
    isMobile.value ? innerNode : <Tooltip title={props.label}>{innerNode}</Tooltip>,
  );
});
</script>
