import { computed, MaybeRefOrGetter, toValue } from 'vue';
import type { Conversation, Groupable, ConversationsProps, GroupCollapsible } from '../interface';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped';

type GroupListItem = {
  data: Conversation[];
  name?: string;
  title?: Groupable['title'];
  label?: Groupable['label'];
  collapsible?: boolean;
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
  items: MaybeRefOrGetter<Conversation[]> = [],
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
    if (!state.value.enableGroup) {
      const groupList: GroupListItem[] = [
        {
          name: __UNGROUPED,
          data: toValue(items),
          title: undefined,
          label: undefined,
          collapsible: false,
        },
      ];

      return {
        groupList,
        enableGroup: false,
        collapsibleOptions: state.value.collapsibleOptions,
        hasCollapsible: false,
      };
    }

    const groupMap = toValue(items).reduce<GroupMap>((acc, item) => {
      const group = item.group || __UNGROUPED;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
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
