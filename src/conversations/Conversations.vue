<script setup lang="tsx">
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import type { Conversation, ConversationsItemProps, ConversationsProps } from './interface';
import ConversationsItem from './ConversationsItem.vue';
import Creation from './Creation.vue';
import GroupTitle from './GroupTitle.vue';
import { computed, ref, toRef, watch } from 'vue';
import useMergedState from '../_util/hooks/useMergedState';
import { useXProviderContext } from '../x-provider';
import useGroupable from './hooks/useGroupable';
import useCollapsible from './hooks/useCollapsible';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useShortcutKeys from '../_util/hooks/use-shortcut-keys';
import useStyle from './style';
import GroupTitleContextProvider from './context';
import type { GroupLabel } from './interface';
import { TransitionCollapse } from '../transition-collapse';

defineOptions({ name: 'AXConversations' });

const props = defineProps<ConversationsProps>();
const {
  prefixCls: customizePrefixCls,
  rootClassName,
  items,
  activeKey: activeKeyProp,
  defaultActiveKey,
  onActiveChange,
  menu,
  styles = {},
  classNames = {},
  groupable,
  class: className,
  style,
  creation: _creation,
  shortcutKeys: _shortcutKeys,
  ...restProps
} = props;

const activeKey = ref(activeKeyProp);

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

// ============================ ActiveKey ============================
const [mergedActiveKey, setMergedActiveKey] = useMergedState<ConversationsProps['activeKey']>(
  defaultActiveKey,
  {
    value: activeKey,
  },
);

// hack for useMergedState error
watch(() => activeKeyProp, () => {
  activeKey.value = activeKeyProp
});

// ============================ Groupable ============================
const groupSate = useGroupable(() => groupable, () => items);

const { enableCollapse, expandedKeys, onItemExpand } = useCollapsible(
  () => groupSate.value.hasCollapsible,
  () => groupSate.value.collapsibleOptions,
);

const renderGroupLabel = (groupInfo: (typeof groupSate.value.groupList)[number]) => {
  const name = groupInfo.name || '';
  if (groupInfo.title) {
    return groupInfo.title(name, { components: { GroupTitle } });
  }
  const label = groupInfo.label as GroupLabel;
  if (typeof label === 'function') {
    return label(name, { groupInfo: { name: groupInfo.name, data: groupInfo.data } });
  }
  if (label !== undefined && label !== null && label !== '') {
    return label;
  }
  return name;
};

// ============================ Prefix ============================
const { getPrefixCls, direction } = useXProviderContext();

const prefixCls = computed(() => getPrefixCls('conversations', customizePrefixCls));

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('conversations');

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() => classnames(
  prefixCls.value,
  contextConfig.value.className,
  className,
  rootClassName,
  hashId.value,
  cssVarCls,
  {
    [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
  },
));

// ============================ Events ============================
const onConversationItemClick: ConversationsItemProps['onClick'] = (info) => {
  setMergedActiveKey(info.key);
  onActiveChange?.(
    info.key,
    (props.items || []).find((item) => item.key === info.key),
  );
};

// Flat item list for shortcut index (Ctrl+1…9 / arrow list)
const keyList = computed(() => (props.items || []).filter((item) => item && item.key));

// ============================ Shortcut Keys =====================
const { shortcutKeysInfo, subscribe } = useShortcutKeys(
  'conversations',
  toRef(props, 'shortcutKeys'),
);

subscribe((action) => {
  switch (action?.name) {
    case 'items': {
      const index = action.actionKeyCodeNumber !== false
        ? action.actionKeyCodeNumber
        : action.index;
      if (typeof index === 'number') {
        const target = keyList.value[index];
        if (target?.key && !target.disabled) {
          setMergedActiveKey(target.key);
          onActiveChange?.(target.key, target);
        }
      }
      break;
    }
    case 'creation': {
      const creation = props.creation;
      if (typeof creation?.onClick === 'function' && !creation?.disabled) {
        creation.onClick();
      }
      break;
    }
    default:
      break;
  }
});

defineRender(() => {
  const creation = props.creation;
  const creationShortcut = shortcutKeysInfo.value?.creation;
  return wrapCSSVar(
    <ul
      {...domProps.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...(typeof style === 'object' ? style : {}),
      }}
      class={mergedCls.value}
    >
      {!!creation && (
        <Creation
          className={classnames(
            (contextConfig.value.classNames as any)?.creation,
            classNames.creation,
          )}
          style={{
            ...(contextConfig.value.styles as any)?.creation,
            ...styles.creation,
          }}
          prefixCls={`${prefixCls.value}-creation`}
          {...creation}
          shortcutKeysIcon={
            Array.isArray(creationShortcut?.shortcutKeysIcon) &&
            !Array.isArray(creationShortcut.shortcutKeysIcon[0])
              ? (creationShortcut.shortcutKeysIcon as string[])
              : creation.shortcutKeysIcon
          }
        />
      )}
      {groupSate.value.groupList.map((groupInfo, groupIndex) => {
        const convItems = groupInfo.data.map((convInfo: Conversation, convIndex: number) => (
          <ConversationsItem
            key={convInfo.key || `key-${convIndex}`}
            info={convInfo}
            prefixCls={prefixCls.value}
            direction={direction.value}
            class={classnames(classNames.item, contextConfig.value.classNames.item)}
            style={{ ...contextConfig.value.styles.item, ...styles.item }}
            menu={typeof menu === 'function' ? menu(convInfo) : menu}
            active={mergedActiveKey.value === convInfo.key}
            onClick={onConversationItemClick}
          />
        ));

        // With group to show the title
        if (groupSate.value.enableGroup) {
          const groupKey = groupInfo.name || `key-${groupIndex}`;
          const groupCollapsible = !!(enableCollapse.value && groupInfo.collapsible && groupInfo.name);
          const groupOpen = !groupCollapsible || expandedKeys.value.includes(groupInfo.name!);
          const labelNode = renderGroupLabel(groupInfo);

          return (
            <li key={groupKey}>
              <GroupTitleContextProvider value={{ prefixCls: prefixCls.value }}>
                <GroupTitle
                  collapsible={groupCollapsible}
                  expanded={groupOpen}
                  onToggle={() => {
                    if (groupInfo.name) {
                      onItemExpand(groupInfo.name);
                    }
                  }}
                >
                  {labelNode}
                </GroupTitle>
              </GroupTitleContextProvider>
              {groupCollapsible ? (
                <TransitionCollapse prefixCls={prefixCls.value}>
                  <ul
                    v-show={groupOpen}
                    key={`list-${groupKey}`}
                    class={classnames(
                      `${prefixCls.value}-list`,
                      `${prefixCls.value}-group-collapsible-list`,
                    )}
                  >
                    {convItems}
                  </ul>
                </TransitionCollapse>
              ) : (
                <ul class={`${prefixCls.value}-list`}>{convItems}</ul>
              )}
            </li>
          );
        }

        return convItems;
      })}
    </ul>
  )
});
</script>
