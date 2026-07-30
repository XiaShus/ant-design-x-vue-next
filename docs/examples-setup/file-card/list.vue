<script setup lang="ts">
import { FileCard } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXFileCardListSetup' });

const items = ref([
  { name: 'product.pdf', byte: 1024 * 800 },
  { name: 'spec.docx', byte: 1024 * 320 },
  { name: 'demo.zip', byte: 1024 * 2048 },
]);

const onRemove = (item: { name: string }) => {
  items.value = items.value.filter((i) => i.name !== item.name);
};
</script>

<template>
  <FileCard.List
    :items="items"
    removable
    :on-remove="onRemove"
  />
</template>
