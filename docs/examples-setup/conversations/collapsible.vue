<script setup lang="ts">
import { Conversations } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXConversationsCollapsibleSetup' });

const items = [
  { key: '1', label: 'What is Ant Design X?', group: 'Today' },
  { key: '2', label: 'How to use Conversations?', group: 'Today' },
  { key: '3', label: 'Previous chat about Bubble', group: 'Yesterday' },
  { key: '4', label: 'Shortcut keys demo', group: 'Yesterday' },
];

const activeKey = ref('1');
const expandedKeys = ref<string[]>(['Today']);

const groupable = computed(() => ({
  collapsible: true,
  expandedKeys: expandedKeys.value,
  onExpand: (keys: string[]) => {
    expandedKeys.value = keys;
  },
}));
</script>

<template>
  <Conversations
    style="width: 280px"
    :items="items"
    :active-key="activeKey"
    :groupable="groupable"
    @active-change="(key) => (activeKey = key)"
  />
</template>
