<script setup lang="ts">
import { ref } from 'vue';
import {
  Box,
  Card,
  registerBasicCatalog,
  type A2UICommand_v0_9,
} from 'ant-design-x-vue';

defineOptions({ name: 'AXXCardBasicCatalogSetup' });

const { catalogId, components } = registerBasicCatalog();
const actionLog = ref('');

const commands = ref<A2UICommand_v0_9[]>([
  {
    version: 'v0.9',
    createSurface: { surfaceId: 'main', catalogId },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'main',
      path: '/form',
      value: { name: 'Ada' },
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'main',
      components: [
        {
          id: 'root',
          component: 'Card',
          children: ['col'],
        },
        {
          id: 'col',
          component: 'Column',
          children: ['title', 'field', 'row'],
        },
        { id: 'title', component: 'Text', text: '内置 Basic Catalog' },
        {
          id: 'field',
          component: 'TextField',
          label: '姓名',
          value: { path: '/form/name' },
          placeholder: '请输入',
        },
        {
          id: 'row',
          component: 'Row',
          children: ['submit'],
        },
        {
          id: 'submit',
          component: 'Button',
          text: '提交',
          action: {
            event: {
              name: 'submit',
              context: { name: { path: '/form/name' } },
            },
          },
        },
      ],
    },
  },
]);

const onAction = (payload: { name: string; surfaceId: string; context: Record<string, any> }) => {
  actionLog.value = JSON.stringify(payload);
};
</script>

<template>
  <div>
    <Box
      :commands="commands"
      :components="components"
      :allowed-catalog-ids="[catalogId]"
      :on-action="onAction"
    >
      <Card id="main" />
    </Box>
    <pre
      v-if="actionLog"
      :style="{ marginTop: '12px', fontSize: '12px' }"
    >{{ actionLog }}</pre>
  </div>
</template>
