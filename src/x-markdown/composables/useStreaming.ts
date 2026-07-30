import { computed, ref, toValue, watch, type ComputedRef, type MaybeRefOrGetter } from 'vue';
import type { StreamingOption, XMarkdownComponents } from '../interface';
import { getInitialCache, processStreamingText, type StreamCache } from '../streamCache';

export type UseStreamingConfig = {
  streaming?: StreamingOption;
  components?: XMarkdownComponents;
};

/**
 * Incremental markdown streaming cache (aligned with @ant-design/x-markdown useStreaming).
 * When `streaming.hasNextChunk` is true, incomplete tokens (links/images/emphasis/…)
 * are held until closed to avoid flicker. When false, full input is returned.
 */
export function useStreaming(
  input: MaybeRefOrGetter<string>,
  config?: MaybeRefOrGetter<UseStreamingConfig | undefined>,
): ComputedRef<string> {
  const streamingOutput = ref('');
  const cacheRef = ref<StreamCache>(getInitialCache());

  const enableCache = computed(() => Boolean(toValue(config)?.streaming?.hasNextChunk));

  watch(
    () => ({
      text: toValue(input),
      enable: enableCache.value,
      streaming: toValue(config)?.streaming,
      components: toValue(config)?.components,
    }),
    ({ text, enable, streaming, components }) => {
      if (typeof text !== 'string') {
        console.error(`X-Markdown: input must be string, not ${typeof text}.`);
        streamingOutput.value = '';
        cacheRef.value = getInitialCache();
        return;
      }

      if (!enable) {
        // Flush: non-streaming / stream finished → render full content
        cacheRef.value = getInitialCache();
        streamingOutput.value = text;
        return;
      }

      streamingOutput.value = processStreamingText(cacheRef.value, text, {
        incompleteMarkdownComponentMap: streaming?.incompleteMarkdownComponentMap,
        componentNames: Object.keys(components || {}),
      });
    },
    { immediate: true },
  );

  return computed(() => (enableCache.value ? streamingOutput.value : toValue(input) || ''));
}

export default useStreaming;
