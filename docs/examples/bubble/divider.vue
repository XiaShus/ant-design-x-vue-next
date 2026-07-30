<script setup lang="tsx">
import { Flex } from 'ant-design-vue';
import { Bubble } from 'ant-design-x-vue';

defineOptions({ name: 'AXBubbleDividerDemo' });

defineRender(() => {
  return (
    <Flex gap={16} vertical>
      <Bubble content="message 1" />
      <Bubble.Divider content="Solid" />
      <Bubble content="message 2" placement="end" />
      <Bubble.Divider content="Dashed" dividerProps={{ dashed: true }} />
      <Bubble content="message 3" />
      <Bubble.Divider content="Plain Text" dividerProps={{ plain: true }} />
      <Bubble content="message 4" placement="end" />
    </Flex>
  );
});
</script>
