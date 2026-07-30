<script setup lang="tsx">
import { Flex, Space, Typography } from 'ant-design-vue';
import { Bubble } from 'ant-design-x-vue';

defineOptions({ name: 'AXBubbleSystemDemo' });

const text = 'Hello, this is a system message';

defineRender(() => {
  return (
    <Flex gap={16} vertical>
      <Bubble.System content={text} />
      <Bubble.System
        variant="outlined"
        shape="round"
        content={
          <Space>
            {text}
            <Typography.Link>ok</Typography.Link>
          </Space>
        }
      />
      <Bubble.System
        variant="borderless"
        content={
          <Space>
            {text}
            <Typography.Link>cancel</Typography.Link>
          </Space>
        }
      />
    </Flex>
  );
});
</script>
