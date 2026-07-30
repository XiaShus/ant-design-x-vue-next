import useState from '../../_util/hooks/use-state';
import { computed, onWatcherCleanup, unref, watch, type Ref } from 'vue';
import type { BubbleContentType } from '../interface';

function isString(str: any): str is string {
  return typeof str === 'string';
}

/**
 * Find the longest common prefix between two strings
 */
function findCommonPrefix(str1: string, str2: string): number {
  let i = 0;
  const minLength = Math.min(str1.length, str2.length);

  while (i < minLength && str1[i] === str2[i]) {
    i++;
  }

  return i;
}

/**
 * Return typed content and typing status when typing is enabled.
 * Or return content directly.
 */
function resolveTypingStep(step: number | [number, number]): number {
  if (Array.isArray(step)) {
    const lo = Math.min(step[0], step[1]);
    const hi = Math.max(step[0], step[1]);
    return lo + Math.floor(Math.random() * (hi - lo + 1));
  }
  return step;
}

const useTypedEffect = (
  content: Ref<BubbleContentType>,
  typingEnabled: Ref<boolean>,
  typingStep: Ref<number | [number, number]>,
  typingInterval: Ref<number>,
  keepPrefix: Ref<boolean> = computed(() => true),
): [typedContent: Ref<BubbleContentType>, isTyping: Ref<boolean>] => {
  const [prevContent, setPrevContent] = useState<BubbleContentType>('');
  const [typingIndex, setTypingIndex] = useState<number>(1);

  const mergedTypingEnabled = computed(() => typingEnabled.value && isString(content.value));

  // Reset typing index when content changed
  watch(
    content,
    () => {
      const prevContentValue = unref(prevContent);
      setPrevContent(content.value);
      if (!mergedTypingEnabled.value && isString(content.value)) {
        setTypingIndex(content.value.length);
        return;
      }

      if (!isString(content.value) || !isString(prevContentValue)) {
        return;
      }

      // keepPrefix=false: always restart from the beginning on content change
      if (!keepPrefix.value) {
        if (content.value !== prevContentValue) {
          setTypingIndex(1);
        }
        return;
      }

      if (content.value.indexOf(prevContentValue) !== 0) {
        // Handle empty strings
        if (!content.value || !prevContentValue) {
          setTypingIndex(1);
          return;
        }

        // Find the longest common prefix between new and old content
        const commonPrefixLength = findCommonPrefix(content.value, prevContentValue);

        if (commonPrefixLength === 0) {
          // Scenario 1: No common prefix, start from the beginning
          setTypingIndex(1);
        } else {
          // Scenario 2: Common prefix — resume from the diverge point (streaming)
          setTypingIndex(commonPrefixLength + 1);
        }
      }
    },
    { immediate: true },
  );

  // Start typing
  watch(
    [typingIndex, typingEnabled, content],
    () => {
      if (
        mergedTypingEnabled.value &&
        isString(content.value) &&
        unref(typingIndex) < content.value.length
      ) {
        const id = setTimeout(() => {
          setTypingIndex(unref(typingIndex) + resolveTypingStep(typingStep.value));
        }, typingInterval.value);

        onWatcherCleanup(() => {
          clearTimeout(id);
        });
      }
    },
    { immediate: true },
  );

  const mergedTypingContent = computed(() =>
    mergedTypingEnabled.value && isString(content.value)
      ? content.value.slice(0, unref(typingIndex))
      : content.value,
  );

  return [
    mergedTypingContent,
    computed(
      () =>
        mergedTypingEnabled.value &&
        isString(content.value) &&
        unref(typingIndex) < content.value.length,
    ),
  ];
};

export default useTypedEffect;
