<script setup lang="ts">
import { EditOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { Checkbox, Space, message } from 'ant-design-vue';
import { computed, h, ref } from 'vue';
import { Mermaid } from 'ant-design-x-vue';

defineOptions({ name: 'AXMermaidHeaderActionsSetup' });

const enableZoom = ref(true);
const enableDownload = ref(true);
const enableCopy = ref(true);
const showCustom = ref(false);

const chart = `flowchart TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Process Data]
    B -->|No| D[Skip Processing]
    C --> E[Generate Report]
    D --> E
    E --> F[End]`;

const customActions = [
  {
    key: 'edit',
    icon: h(EditOutlined),
    label: 'Edit',
    onItemClick: () => {
      message.info('Edit button clicked');
    },
  },
  {
    key: 'share',
    icon: h(ShareAltOutlined),
    label: 'Share',
    onItemClick: () => {
      message.success('Chart link copied to clipboard');
    },
  },
];

const actions = computed(() => ({
  enableZoom: enableZoom.value,
  enableDownload: enableDownload.value,
  enableCopy: enableCopy.value,
  ...(showCustom.value ? { customActions } : {}),
}));
</script>

<template>
  <div style="max-width: 800px; margin: 0 auto">
    <div style="margin-bottom: 24px">
      <h2 style="margin-bottom: 16px; color: #1a1a1a">Header Actions Configuration</h2>
      <Space size="large" wrap>
        <Checkbox v-model:checked="enableZoom">Enable Zoom</Checkbox>
        <Checkbox v-model:checked="enableDownload">Enable Download</Checkbox>
        <Checkbox v-model:checked="enableCopy">Enable Copy</Checkbox>
        <Checkbox v-model:checked="showCustom">Show Custom Actions</Checkbox>
      </Space>
    </div>

    <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden">
      <Mermaid :actions="actions">{{ chart }}</Mermaid>
    </div>
  </div>
</template>
