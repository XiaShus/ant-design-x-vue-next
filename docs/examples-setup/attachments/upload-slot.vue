<script setup lang="ts">
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXAttachmentUploadSlotSetup' });

const items = ref<AttachmentsProps['items']>([
  {
    uid: '1',
    name: 'demo.png',
    status: 'done',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
]);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <Attachments
      :items="items"
      :max-count="3"
      :before-upload="() => false"
      @change="({ fileList }) => (items = fileList)"
    >
      <template #upload>
        <Button type="dashed">
          <template #icon>
            <PlusCircleOutlined />
          </template>
          Add
        </Button>
      </template>
    </Attachments>
    <div style="color: rgba(0, 0, 0, 0.45)">
      Custom `#upload` slot + `maxCount={3}` (upload hides when full).
    </div>
  </div>
</template>
