import { computed, type MaybeRefOrGetter, toValue, type Ref } from 'vue';
import useMergedState from '../../_util/hooks/useMergedState';

export type CollapsibleOptions = {
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  onExpand?: (expandedKeys: string[]) => void;
};

/**
 * Controlled / uncontrolled expanded group keys for Conversations.groupable.
 */
function useCollapsible(
  enableCollapse: MaybeRefOrGetter<boolean>,
  options: MaybeRefOrGetter<CollapsibleOptions>,
): {
  enableCollapse: Ref<boolean>;
  expandedKeys: Ref<string[]>;
  onItemExpand: (groupKey: string) => void;
} {
  const enabled = computed(() => Boolean(toValue(enableCollapse)));
  const opts = computed(() => toValue(options) || {});

  const isUncontrolled = computed(
    () => !enabled.value || opts.value.expandedKeys === undefined,
  );

  const controlledRef = computed(() =>
    isUncontrolled.value ? undefined : opts.value.expandedKeys,
  );

  const [mergedExpandedKeys, setMergedExpandedKeys] = useMergedState<string[]>(
    () => opts.value.defaultExpandedKeys || [],
    { value: controlledRef },
  );

  const onItemExpand = (curKey: string) => {
    if (!enabled.value) return;
    const prev = isUncontrolled.value
      ? mergedExpandedKeys.value
      : opts.value.expandedKeys || [];
    const keys = prev.includes(curKey)
      ? prev.filter((k) => k !== curKey)
      : [...prev, curKey];
    opts.value.onExpand?.(keys);
    if (isUncontrolled.value) {
      setMergedExpandedKeys(keys);
    }
  };

  return {
    enableCollapse: enabled,
    expandedKeys: mergedExpandedKeys,
    onItemExpand,
  };
}

export default useCollapsible;
