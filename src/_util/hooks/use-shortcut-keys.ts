import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import {
  flattenShortcutKeys,
  getShortcutAction,
  type ShortcutKeyActionType,
  type ShortcutKeyInfoType,
  type ShortcutKeys,
} from '../shortcut-keys';
import useXComponentConfig from './use-x-component-config';

type Observer = (action: ShortcutKeyActionType) => void;

/**
 * Document-level shortcut listener aligned with `@ant-design/x` useShortcutKeys.
 */
function useShortcutKeys(
  component: 'conversations',
  shortcutKeys: Ref<Record<string, ShortcutKeys | ShortcutKeys[]> | undefined>,
): {
  shortcutKeysInfo: Ref<Record<string, ShortcutKeyInfoType>>;
  subscribe: (fn: Observer) => void;
} {
  const contextConfig = useXComponentConfig(component as any);
  const shortcutKeysInfo = ref<Record<string, ShortcutKeyInfoType>>({});
  const flattenRef = ref<
    ReturnType<typeof flattenShortcutKeys>['flatten']
  >([]);
  const observerRef = ref<Observer | null>(null);
  const keyLockRef = ref(false);

  const rebuild = () => {
    const contextKeys = (contextConfig.value as any)?.shortcutKeys as
      | Record<string, ShortcutKeys | ShortcutKeys[]>
      | undefined;
    const { flatten, info } = flattenShortcutKeys(shortcutKeys.value, contextKeys);
    flattenRef.value = flatten;
    shortcutKeysInfo.value = info;
  };

  watch([shortcutKeys, contextConfig], rebuild, { immediate: true, deep: true });

  const onKeydown = (event: KeyboardEvent) => {
    for (const entry of flattenRef.value) {
      const active = getShortcutAction(entry.shortcutKey, event);
      if (!active) continue;
      if (keyLockRef.value) return;
      keyLockRef.value = true;
      const info: ShortcutKeyActionType = {
        ...active,
        name: entry.name,
        index: entry.index,
      };
      observerRef.value?.(info);
      break;
    }
  };

  const onKeyup = () => {
    keyLockRef.value = false;
  };

  onMounted(() => {
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('keyup', onKeyup);
  });

  const subscribe = (fn: Observer) => {
    observerRef.value = fn;
  };

  return { shortcutKeysInfo, subscribe };
}

export default useShortcutKeys;
