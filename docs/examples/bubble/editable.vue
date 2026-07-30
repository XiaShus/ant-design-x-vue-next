<script setup lang="tsx">
import { EditOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Avatar, Flex } from 'ant-design-vue';
import { ref } from 'vue';
import { Actions, Bubble } from 'ant-design-x-vue';

defineOptions({ name: 'AXBubbleEditableDemo' });

const editable = ref<[boolean, boolean | { editing: boolean; okText?: string }]>([
  false,
  { editing: false, okText: 'ok' },
]);
const content = ref(['editable bubble 1', 'editable bubble 2']);

defineRender(() => {
  return (
    <Flex vertical gap="small" style={{ minHeight: 200 }}>
      <Flex>
        <Bubble
          editable={editable.value[0]}
          content={content.value[0]}
          avatar={<Avatar icon={<UserOutlined />} />}
          footer={
            <Actions
              items={[
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'edit',
                },
              ]}
              onClick={() => {
                editable.value = [true, editable.value[1]];
              }}
            />
          }
          onEditCancel={() => {
            editable.value = [false, editable.value[1]];
          }}
          onEditConfirm={(val) => {
            content.value = [val, content.value[1]];
            editable.value = [false, editable.value[1]];
          }}
        />
      </Flex>
      <Flex>
        <Bubble
          style={{ width: '100%' }}
          placement="end"
          editable={editable.value[1]}
          content={content.value[1]}
          avatar={<Avatar icon={<UserOutlined />} />}
          footer={
            <Actions
              items={[
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'edit',
                },
              ]}
              onClick={() => {
                editable.value = [
                  editable.value[0],
                  { ...(editable.value[1] as object), editing: true },
                ];
              }}
            />
          }
          onEditCancel={() => {
            editable.value = [editable.value[0], false];
          }}
          onEditConfirm={(val) => {
            content.value = [content.value[0], val];
            editable.value = [editable.value[0], { editing: false, okText: 'ok' }];
          }}
        />
      </Flex>
    </Flex>
  );
});
</script>
