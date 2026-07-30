<script setup lang="ts">
import { computed, provide } from 'vue';
import { LocaleContextKey } from './context';
import type { Locale } from './types';

defineOptions({ name: 'AXLocaleProvider' });

const props = defineProps<{
  locale: Locale;
}>();

provide(
  LocaleContextKey,
  computed(() => ({
    ...props.locale,
    exist: true,
  })),
);
</script>

<template>
  <slot />
</template>
