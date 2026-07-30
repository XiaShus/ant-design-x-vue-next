import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * Detect coarse pointer / touch-primary devices (aligned with @ant-design/x useMobile).
 */
export function useMobile(query = '(pointer: coarse)'): Ref<boolean> {
  const isMobile = ref(false);

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => {
      isMobile.value = mql.matches;
    };
    update();
    mql.addEventListener?.('change', update);
    onUnmounted(() => {
      mql.removeEventListener?.('change', update);
    });
  });

  return isMobile;
}

export default useMobile;
