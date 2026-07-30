<script setup lang="ts">
import { Conversations, type ConversationsItems } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXConversationsDividerSetup' });

const items: ConversationsItems[] = [
  { key: '1', label: 'Design sync' },
  { key: '2', label: 'Sprint planning' },
  { type: 'divider' },
  { key: '3', label: 'Archived: Q1 review' },
  { key: '4', label: 'Archived: launch retro', disabled: true },
];

const activeKey = ref('1');
</script>

<template>
  <Conversations
    style="width: 280px"
    :items="items"
    :active-key="activeKey"
    @active-change="(key) => (activeKey = key)"
  />
</template>
