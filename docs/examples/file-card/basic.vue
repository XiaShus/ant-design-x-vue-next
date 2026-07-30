<script setup lang="tsx">
import { Flex } from 'ant-design-vue';
import { FileCard } from 'ant-design-x-vue';

defineOptions({ name: 'AXFileCardBasic' });

defineRender(() => {
  return (
    <Flex gap="middle" wrap="wrap">
      <FileCard name="annual-report.pdf" byte={1204 * 1024} />
      <FileCard name="design.docx" byte={256 * 1024} size="small" />
      <FileCard name="notes.md" byte={12 * 1024} />
    </Flex>
  );
});
</script>
