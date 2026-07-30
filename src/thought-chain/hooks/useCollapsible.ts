import useState from '../../_util/hooks/use-state';
import { computed, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';

export type CollapsibleOptions = {
  /**
   * @desc 初始化展开的节点
   * @descEN default expanded keys
   */
  defaultExpandedKeys?: string[];

  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: string[];

  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: (expandedKeys: string[]) => void;
};

export type Collapsible = boolean | CollapsibleOptions;

export type UseCollapsibleConfig = {
  /**
   * @desc 兼容旧版链级折叠配置
   * @descEN Legacy chain-level collapsible config
   */
  collapsible?: Collapsible;
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  onExpand?: (expandedKeys: string[]) => void;
};

type UseCollapsible = (
  config?: MaybeRefOrGetter<UseCollapsibleConfig>,
  prefixCls?: string,
  rootPrefixCls?: string,
) => [
  /** Chain-level force: all items collapsible (Vue compat `collapsible`) */
  Ref<boolean>,
  Ref<string[]>,
  (curKey: string) => void,
];

const useCollapsible: UseCollapsible = (config) => {
  // ============================ Collapsible ============================
  const collapsibleState = computed(() => {
    const cfg = toValue(config) || {};
    const collapsibleOpt = cfg.collapsible;
    const fromObject: CollapsibleOptions =
      typeof collapsibleOpt === 'object' && collapsibleOpt ? collapsibleOpt : {};

    const forceCollapse =
      collapsibleOpt === true || typeof collapsibleOpt === 'object';

    const mergedDefaultExpandedKeys =
      cfg.defaultExpandedKeys ?? fromObject.defaultExpandedKeys ?? [];

    const controlledExpandedKeys =
      cfg.expandedKeys !== undefined
        ? cfg.expandedKeys
        : fromObject.expandedKeys !== undefined
          ? fromObject.expandedKeys
          : undefined;

    const customizeOnExpand =
      cfg.onExpand ?? fromObject.onExpand ?? (() => {});

    return {
      forceCollapse,
      isControlled: controlledExpandedKeys !== undefined,
      controlledExpandedKeys,
      defaultExpandedKeys: mergedDefaultExpandedKeys,
      customizeOnExpand,
    };
  });

  // ============================ ExpandedKeys ============================
  const [innerExpandedKeys, setInnerExpandedKeys] = useState<string[]>(
    () =>
      collapsibleState.value.controlledExpandedKeys ??
      collapsibleState.value.defaultExpandedKeys,
  );

  const mergedExpandedKeys = computed(() =>
    collapsibleState.value.isControlled
      ? (collapsibleState.value.controlledExpandedKeys as string[])
      : innerExpandedKeys.value,
  );

  // Sync controlled / default sources
  watch(
    () => ({
      isControlled: collapsibleState.value.isControlled,
      controlled: collapsibleState.value.controlledExpandedKeys,
      defaults: collapsibleState.value.defaultExpandedKeys,
    }),
    (next) => {
      if (next.isControlled) {
        setInnerExpandedKeys(next.controlled ?? []);
      }
    },
    { deep: 1 },
  );

  // ============================ Event ============================
  const onItemExpand = (curKey: string) => {
    const keys = mergedExpandedKeys.value.includes(curKey)
      ? mergedExpandedKeys.value.filter((key) => key !== curKey)
      : [...mergedExpandedKeys.value, curKey];

    collapsibleState.value.customizeOnExpand?.(keys);

    if (!collapsibleState.value.isControlled) {
      setInnerExpandedKeys(keys);
    }
  };

  // ============================ Return ============================
  return [
    computed(() => collapsibleState.value.forceCollapse),
    mergedExpandedKeys,
    onItemExpand,
  ];
};

export default useCollapsible;
