<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { AnimationConfig } from './interface';

defineOptions({ name: 'AXXMarkdownAnimationText' });

const props = defineProps<{
  text: string;
  animationConfig?: AnimationConfig;
}>();

const chunks = ref<string[]>([]);
const prevText = ref('');

watch(
  () => props.text,
  (text) => {
    if (text === prevText.value) return;

    if (!(prevText.value && text.indexOf(prevText.value) === 0)) {
      chunks.value = [text];
      prevText.value = text;
      return;
    }

    const newText = text.slice(prevText.value.length);
    if (!newText) return;

    chunks.value = [...chunks.value, newText];
    prevText.value = text;
  },
  { immediate: true },
);

const animationStyle = computed(() => {
  const { fadeDuration = 200, easing = 'ease-in-out' } = props.animationConfig || {};
  return {
    animation: `x-markdown-fade-in ${fadeDuration}ms ${easing} forwards`,
    color: 'inherit',
  };
});
</script>

<template>
  <span
    v-for="(chunk, index) in chunks"
    :key="`${index}-${chunk.slice(0, 8)}`"
    class="x-markdown-animation-text"
    :style="animationStyle"
  >{{ chunk }}</span>
</template>
