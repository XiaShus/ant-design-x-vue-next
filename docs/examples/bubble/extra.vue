<script setup lang="tsx">
import { Flex, Typography } from 'ant-design-vue';
import { Bubble } from 'ant-design-x-vue';

defineOptions({ name: 'AXBubbleExtra' });

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Bubble
        content="Hello, this bubble has a side extra."
        extra={(_, { key }) => (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {key ?? 'now'}
          </Typography.Text>
        )}
        _key="09:41"
      />
      <Bubble
        placement="end"
        content="User message with timestamp on the side."
        extra={<Typography.Text type="secondary" style={{ fontSize: 12 }}>09:42</Typography.Text>}
      />
    </Flex>
  );
});
</script>
