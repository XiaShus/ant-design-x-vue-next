<script setup lang="tsx">
import {
  CloudUploadOutlined,
  FileImageOutlined,
  FileWordOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue';
import { App, Badge, Button, Dropdown, Flex, type UploadFile } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { computed, onUnmounted, ref, watch } from 'vue';

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

const Demo = () => {
  const senderHeader = computed(() => (
    <Sender.Header
      title="Attachments"
      styles={{ content: { padding: 0 } }}
      open={open.value}
      onOpenChange={(v) => (open.value = v)}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        beforeUpload={() => false}
        items={items.value}
        maxCount={MAX_COUNT}
        onChange={({ file, fileList }) => {
          const updated = fileList.map((item) => {
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
          items.value = updated as UploadFile[];
        }}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
        getDropContainer={() => senderRef.value?.nativeElement}
      />
    </Sender.Header>
  ));

  const menuItems = [
    {
      key: 'image',
      label: (
        <Flex align="center" gap="small">
          <FileImageOutlined />
          Image
        </Flex>
      ),
    },
    {
      key: 'docs',
      label: (
        <Flex align="center" gap="small">
          <FileWordOutlined />
          Docs
        </Flex>
      ),
    },
  ];

  return (
    <Flex style={{ minHeight: '250px' }} align="flex-end">
      <Sender
        ref={senderRef}
        header={senderHeader.value}
        prefix={
          <Dropdown
            menu={{ items: menuItems, onClick: selectFile }}
            disabled={items.value.length >= MAX_COUNT}
          >
            <Badge dot={items.value.length > 0 && !open.value}>
              <Button type="text" icon={<LinkOutlined />} disabled={items.value.length >= MAX_COUNT} />
            </Badge>
          </Dropdown>
        }
        value={text.value}
        onChange={(v) => (text.value = v)}
        onSubmit={() => {
          items.value = [];
          text.value = '';
        }}
      />
    </Flex>
  );
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  );
});
</script>
