<script setup lang="tsx">
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXAttachmentUploadSlot' });

const items = ref<AttachmentsProps['items']>([
  {
    uid: '1',
    name: 'demo.png',
    status: 'done',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
]);

defineRender(() => (
  <Flex vertical gap="middle">
    <Attachments
      items={items.value}
      maxCount={3}
      beforeUpload={() => false}
      onChange={({ fileList }) => {
        items.value = fileList;
      }}
      v-slots={{
        upload: () => (
          <Button type="dashed" icon={<PlusCircleOutlined />}>
            Add
          </Button>
        ),
      }}
    />
    <div style={{ color: 'rgba(0,0,0,0.45)' }}>
      Custom `#upload` slot + `maxCount={3}` (upload hides when full).
    </div>
  </Flex>
));
</script>
