import { ref } from 'vue';

/**
 * Stable callback that always invokes the latest handler (avoids stale closures).
 * Supports multi-argument handlers (e.g. onRequest(params, opts)).
 */
export function useEventCallback<Args extends any[], R = void>(
  handler: (...args: Args) => R,
): (...args: Args) => R {
  const callbackRef = ref(handler);
  callbackRef.value = handler;
  return ((...args: Args) => callbackRef.value(...args)) as (...args: Args) => R;
}
