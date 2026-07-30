import { computed } from 'vue';
import type { BubbleContentType, InfoType, TypingOption } from '../interface';

export type TypingProp<ContentType extends BubbleContentType = BubbleContentType> =
  | TypingOption
  | boolean
  | ((content: ContentType, info: InfoType) => TypingOption | boolean)
  | undefined
  | null;

export type ResolvedTyping = TypingOption | boolean | undefined | null;

function resolveTyping(
  typing: TypingProp,
  content: BubbleContentType,
  info: InfoType,
): ResolvedTyping {
  if (typeof typing === 'function') {
    return typing(content, info);
  }
  return typing;
}

/** Pass getters (not MaybeRefOrGetter) so TS won't confuse typing-fn with a ref getter. */
function useTypingConfig(
  getTyping: () => TypingProp,
  getContent: () => BubbleContentType,
  getInfo: () => InfoType,
) {
  const resolved = computed(() => resolveTyping(getTyping(), getContent(), getInfo()));

  const typingEnabled = computed(() => Boolean(resolved.value));

  const baseConfig: Required<TypingOption> = {
    step: 1,
    interval: 50,
    // set default suffix is empty
    suffix: null as any,
    effect: 'typing',
    keepPrefix: true,
  };

  const config = computed(() => {
    const typingRaw = resolved.value;
    return {
      ...baseConfig,
      ...(typeof typingRaw === 'object' && typingRaw ? typingRaw : {}),
    };
  });

  return [
    typingEnabled,
    computed(() => config.value.step),
    computed(() => config.value.interval),
    computed(() => config.value.suffix),
    computed(() => config.value.effect || 'typing'),
    computed(() => config.value.keepPrefix !== false),
  ] as const;
}

export default useTypingConfig;
