import { computed, MaybeRefOrGetter, toValue } from 'vue';
import type {
  Conversation,
  Groupable,
  ConversationsProps,
  GroupCollapsible,
  ItemType,
} from '../interface';
import { isDividerItem } from '../interface';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped';

export type GroupListItem = {
  data: ItemType[];
  name?: string;
  title?: Groupable['title'];
  label?: Groupable['label'];
  collapsible?: boolean;
  /** When false, render items flat without GroupTitle (dividers / ungrouped). */
  enableGroup?: boolean;
};

type GroupMap = Record<string, Conversation[]>;

const resolveCollapsible = (
  handle: GroupCollapsible | undefined,
  groupName: string | undefined,
): boolean => {
  if (!handle || !groupName) return false;
  return typeof handle === 'function' ? !!handle(groupName) : !!handle;
};

const useGroupable = (
  groupable?: MaybeRefOrGetter<ConversationsProps['groupable']>,
  items: MaybeRefOrGetter<ItemType[]> = [],
) => {
  const state = computed(() => {
    if (!toValue(groupable)) {
      return {
        enableGroup: false,
        sort: undefined as Groupable['sort'],
        title: undefined as Groupable['title'],
        label: undefined as Groupable['label'],
        collapsibleHandle: undefined as GroupCollapsible | undefined,
        collapsibleOptions: {
          defaultExpandedKeys: undefined as string[] | undefined,
          expandedKeys: undefined as string[] | undefined,
          onExpand: undefined as Groupable['onExpand'],
        },
      };
    }
    let baseConfig: Groupable = {};

    if (typeof toValue(groupable) === 'object') {
      baseConfig = { ...toValue(groupable as object) };
    }
    const {
      collapsible,
      defaultExpandedKeys,
      expandedKeys,
      onExpand,
      ...other
    } = baseConfig;

    return {
      enableGroup: true,
      sort: other.sort,
      title: other.title,
      label: other.label,
      collapsibleHandle: collapsible,
      collapsibleOptions: {
        defaultExpandedKeys,
        expandedKeys,
        onExpand,
      },
    };
  });

  return computed(() => {
    const rawItems = toValue(items) || [];

    if (!state.value.enableGroup) {
      const groupList: GroupListItem[] = [
        {
          name: __UNGROUPED,
          data: rawItems,
          title: undefined,
          label: undefined,
          collapsible: false,
          enableGroup: false,
        },
      ];

      return {
        groupList,
        enableGroup: false,
        collapsibleOptions: state.value.collapsibleOptions,
        hasCollapsible: false,
      };
    }

    const hasDivider = rawItems.some((item) => isDividerItem(item));

    // With dividers: preserve encounter order (React-aligned reduce).
    if (hasDivider) {
      const groupList = rawItems.reduce<GroupListItem[]>((currentGroupList, item) => {
        if (isDividerItem(item) || !(item as Conversation).group) {
          currentGroupList.push({
            data: [item],
            name: undefined,
            title: undefined,
            label: undefined,
            enableGroup: false,
            collapsible: false,
          });
          return currentGroupList;
        }

        const baseItem = item as Conversation;
        const existed = currentGroupList.find((group) => group.name === baseItem.group);
        if (existed) {
          existed.data.push(baseItem);
          return currentGroupList;
        }

        currentGroupList.push({
          data: [baseItem],
          name: baseItem.group,
          title: state.value.title,
          label: state.value.label,
          enableGroup: true,
          collapsible: resolveCollapsible(state.value.collapsibleHandle, baseItem.group),
        });
        return currentGroupList;
      }, []);

      return {
        groupList,
        enableGroup: true,
        collapsibleOptions: state.value.collapsibleOptions,
        hasCollapsible: !!state.value.collapsibleHandle,
      };
    }

    // Legacy path (no dividers): bucket by group + optional sort.
    const groupMap = rawItems.reduce<GroupMap>((acc, item) => {
      const conv = item as Conversation;
      const group = conv.group || __UNGROUPED;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(conv);
      return acc;
    }, {});

    const groupKeys = state.value.sort
      ? Object.keys(groupMap).sort(state.value.sort)
      : Object.keys(groupMap);

    const groupList: GroupListItem[] = groupKeys.map((group) => {
      const name = group === __UNGROUPED ? undefined : group;
      return {
        name,
        title: state.value.title,
        label: state.value.label,
        data: groupMap[group],
        enableGroup: true,
        collapsible: resolveCollapsible(state.value.collapsibleHandle, name),
      };
    });

    return {
      groupList,
      enableGroup: true,
      collapsibleOptions: state.value.collapsibleOptions,
      hasCollapsible: !!state.value.collapsibleHandle,
    };
  });
};

export default useGroupable;
