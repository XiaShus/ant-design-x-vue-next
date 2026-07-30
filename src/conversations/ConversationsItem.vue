<script setup lang="tsx">
import { EllipsisOutlined } from '@ant-design/icons-vue';
import type { EventHandler, MouseEventHandler } from 'ant-design-vue/es/_util/EventInterface';
import { Dropdown, Menu, Tooltip, Typography } from 'ant-design-vue';
import classnames from 'classnames';
import { computed } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import useState from '../_util/hooks/use-state';
import { useMobile } from '../_util/hooks/use-mobile';
import type { Conversation, ConversationsItemProps } from './interface';

defineOptions({ name: 'AXConversationsItem' });

const props = defineProps<ConversationsItemProps>();
const isMobile = useMobile();

const domProps = computed(() =>
  pickAttrs(props as Record<string, unknown>, {
    aria: true,
    data: true,
    attr: true,
  }),
);

const stopPropagation: EventHandler = (e) => {
  e.stopPropagation();
};

const disabled = computed(() => props.info.disabled);
const [inEllipsis, onEllipsis] = useState(false);
const [opened, setOpened] = useState(false);

const mergedCls = computed(() =>
  classnames(props.class, `${props.prefixCls}-item`, {
    [`${props.prefixCls}-item-active`]: props.active && !disabled.value,
    [`${props.prefixCls}-item-disabled`]: disabled.value,
    [`${props.prefixCls}-item-menu-always`]: isMobile.value && !!props.menu,
  }),
);

const onInternalClick: MouseEventHandler = () => {
  if (!disabled.value && props.onClick) {
    props.onClick(props.info);
  }
};

const onOpenChange = (open: boolean) => {
  if (open) {
    setOpened(!open);
  }
};

const trigger = computed(() => props.menu?.trigger);
const dropdownMenu = computed(() => {
  const { trigger: _t, ...rest } = props.menu || {};
  return rest;
});

const getPopupContainer = computed(() => dropdownMenu.value?.getPopupContainer);

const renderMenuTrigger = (conversation: Conversation) => {
  const originTriggerNode = (
    <EllipsisOutlined onClick={stopPropagation} class={`${props.prefixCls}-menu-icon`} />
  );
  if (trigger.value) {
    return typeof trigger.value === 'function'
      ? trigger.value(conversation, { originNode: originTriggerNode })
      : trigger.value;
  }
  return originTriggerNode;
};

defineRender(() => {
  return (
    <Tooltip
      title={props.info.label}
      open={inEllipsis.value && opened.value}
      onOpenChange={setOpened}
      placement={props.direction === 'rtl' ? 'left' : 'right'}
    >
      <li {...domProps.value} class={mergedCls.value} onClick={onInternalClick}>
        {props.info.icon && <div class={`${props.prefixCls}-icon`}>{props.info.icon}</div>}
        <Typography.Text
          // @ts-expect-error
          class={`${props.prefixCls}-label`}
          ellipsis={{
            onEllipsis,
          }}
        >
          {props.info.label}
        </Typography.Text>
        {!disabled.value && props.menu && (
          <Dropdown
            placement={props.direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
            trigger={['click']}
            disabled={disabled.value}
            onOpenChange={onOpenChange}
            getPopupContainer={getPopupContainer.value}
          >
            {{
              default: () => renderMenuTrigger(props.info),
              overlay: () => <Menu {...dropdownMenu.value} />,
            }}
          </Dropdown>
        )}
      </li>
    </Tooltip>
  );
});
</script>
