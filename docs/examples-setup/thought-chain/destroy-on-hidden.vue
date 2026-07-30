<script setup lang="ts">
import { Button, Card, Space, Switch } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXThoughtChainDestroyOnHiddenSetup' });

const expandedKeys = ref<string[]>(['task1']);
const destroyOnHidden = ref(true);

const items = computed<ThoughtChainProps['items']>(() => [
  {
    key: 'task1',
    title: 'Collapsible Task',
    description: 'Content will be removed from DOM when collapsed',
    collapsible: true,
    destroyOnHidden: destroyOnHidden.value,
    content: 'Task detail content.',
  },
  {
    key: 'task2',
    title: 'Normal Task',
    content: 'Task2 content.',
  },
]);

const toggle = () => {
  expandedKeys.value = expandedKeys.value.includes('task1') ? [] : ['task1'];
};

const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
};
</script>

<template>
  <Card style="width: 500px">
    <Space style="margin-bottom: 16px">
      <Button @click="toggle">
        {{ expandedKeys.includes('task1') ? 'Collapse' : 'Expand' }}
      </Button>
      <Switch
        v-model:checked="destroyOnHidden"
        checked-children="destroyOnHidden"
        un-checked-children="keep"
      />
    </Space>
    <ThoughtChain
      :items="items"
      :expanded-keys="expandedKeys"
      :on-expand="onExpand"
    />
  </Card>
</template>
