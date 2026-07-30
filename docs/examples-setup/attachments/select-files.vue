<script setup lang="ts">
import {
  CloudUploadOutlined,
  FileImageOutlined,
  FileWordOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue';
import { Badge, Button, Dropdown, Flex, type UploadFile } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { h, onUnmounted, ref, watch } from 'vue';

defineOptions({ name: 'AXAttachmentSelectFiles' });

const MAX_COUNT = 5;

const open = ref(false);
const items = ref<UploadFile[]>([]);
const text = ref('');
const senderRef = ref<InstanceType<typeof Sender> | null>(null);
const attachmentsRef = ref<InstanceType<typeof Attachments> | null>(null);

onUnmounted(() => {
  items.value.forEach((item) => {
    if (item.url?.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }
  });
});

watch(
  () => items.value.length,
  (len) => {
    open.value = len > 0;
  },
);

const selectFile = ({ key }: { key: string }) => {
  attachmentsRef.value?.select({
    accept: key === 'image' ? '.png,.jpg,.jpeg' : '.doc,.docx',
    multiple: true,
  });
};

const menuItems = [
  {
    key: 'image',
    label: () =>
      h(Flex, { align: 'center', gap: 'small' }, () => [h(FileImageOutlined), ' Image']),
  },
  {
    key: 'docs',
    label: () =>
      h(Flex, { align: 'center', gap: 'small' }, () => [h(FileWordOutlined), ' Docs']),
  },
];
</script>

<template>
  <Flex
    style="min-height: 250px"
    align="flex-end"
  >
    <Sender
      ref="senderRef"
      :value="text"
      @change="(v) => (text = v)"
      @submit="
        () => {
          items = [];
          text = '';
        }
      "
    >
      <template #header>
        <Sender.Header
          title="Attachments"
          :styles="{ content: { padding: 0 } }"
          :open="open"
          force-render
          @open-change="(v) => (open = v)"
        >
          <Attachments
            ref="attachmentsRef"
            :before-upload="() => false"
            :items="items"
            :max-count="MAX_COUNT"
            :get-drop-container="() => senderRef?.nativeElement"
            :placeholder="
              (type) =>
                type === 'drop'
                  ? { title: 'Drop file here' }
                  : {
                      icon: h(CloudUploadOutlined),
                      title: 'Upload files',
                      description: 'Click or drag files to this area to upload',
                    }
            "
            @change="
              ({ file, fileList }) => {
                items = fileList.map((item) => {
                  if (item.uid === file.uid && file.status !== 'removed' && item.originFileObj) {
                    if (item.url?.startsWith('blob:')) {
                      URL.revokeObjectURL(item.url);
                    }
                    return {
                      ...item,
                      url: URL.createObjectURL(item.originFileObj),
                    };
                  }
                  return item;
                });
              }
            "
          />
        </Sender.Header>
      </template>
      <template #prefix>
        <Dropdown
          :menu="{ items: menuItems, onClick: selectFile }"
          :disabled="items.length >= MAX_COUNT"
        >
          <Badge :dot="items.length > 0 && !open">
            <Button
              type="text"
              :icon="h(LinkOutlined)"
              :disabled="items.length >= MAX_COUNT"
            />
          </Badge>
        </Dropdown>
      </template>
    </Sender>
  </Flex>
</template>
