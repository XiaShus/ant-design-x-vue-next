<script setup lang="ts">
import { Button } from 'ant-design-vue';
import { Sources } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSourcesExpandSetup' });

const expanded = ref(true);
const items = [
  { key: '1', title: 'Ant Design', url: 'https://ant.design' },
  { key: '2', title: 'Vue', url: 'https://vuejs.org' },
];
</script>

<template>
  <Button
    style="margin-bottom: 12px"
    @click="expanded = !expanded"
  >
    Toggle
  </Button>
  <Sources
    title="已参考 2 篇资料"
    :items="items"
    :expanded="expanded"
    @expand="(next) => (expanded = next)"
  />
</template>
