<script setup lang="tsx">
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { Dropdown, type DropdownProps, type MenuProps } from 'ant-design-vue';
import classnames from 'classnames';
import { computed } from 'vue';
import { useXProviderContext } from '../x-provider';
import { useActionsContextInject } from './context';
import { getItemChildren } from './getItemChildren';
import type { ActionItem, ItemType } from './interface';

defineOptions({ name: 'AXActionMenu' });

const props = defineProps<{
  item: ItemType;
  prefixCls?: string;
  dropdownProps?: DropdownProps;
}>();

const emit = defineEmits<{
  click: [menuInfo: {
    item: ActionItem;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }];
}>();

const findItem = (keyPath: string[], items: ActionItem[]): ActionItem | null => {
  const keyToFind = keyPath[0];

  for (const item of items) {
    if (item.key === keyToFind) {
      if (keyPath.length === 1) return item;

      const nested = getItemChildren(item);
      if (nested?.length) {
        return findItem(keyPath.slice(1), nested);
      }
    }
  }

  return null;
};

const { getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const actionsContext = useActionsContextInject();

const icon = computed(() => props.item?.icon ?? <EllipsisOutlined />);
const children = computed(() => getItemChildren(props.item) || []);
const triggerSubMenuAction = computed(() => props.item.triggerSubMenuAction || 'hover');
const dropdownProps = computed(() => props.dropdownProps || {});

const menuProps = computed<MenuProps>(() => ({
  items: children.value as MenuProps['items'],
  onClick: ({ key, keyPath, domEvent }) => {
    const foundItem = findItem(keyPath as string[], children.value);
    if (foundItem?.onItemClick) {
      foundItem.onItemClick(foundItem);
      return;
    }
    emit('click', {
      key: key as string,
      keyPath: [...(keyPath as string[]), props.item.key],
      domEvent: domEvent as MouseEvent | KeyboardEvent,
      item: foundItem!,
    });
  },
}));

defineRender(() => {
  const {
    overlayClassName,
    overlayStyle,
    arrow,
    trigger,
    ...restDropdownProps
  } = dropdownProps.value;

  const itemClassName = actionsContext.value.classNames?.item;
  const itemStyle = actionsContext.value.styles?.item;
  const itemDropdownClassName = actionsContext.value.classNames?.itemDropdown;
  const itemDropdownStyle = actionsContext.value.styles?.itemDropdown;

  return (
    <Dropdown
      {...restDropdownProps}
      menu={menuProps.value}
      overlayClassName={classnames(
        `${prefixCls}-sub-item`,
        `${prefixCls}-dropdown`,
        itemDropdownClassName,
        overlayClassName,
      )}
      overlayStyle={{
        ...itemDropdownStyle,
        ...(overlayStyle as object),
      }}
      arrow={arrow ?? true}
      trigger={trigger ?? [triggerSubMenuAction.value]}
    >
      <div
        class={classnames(`${prefixCls}-list-item`, itemClassName)}
        style={itemStyle}
      >
        <div class={`${prefixCls}-list-item-icon`}>{icon.value}</div>
      </div>
    </Dropdown>
  );
});
</script>
