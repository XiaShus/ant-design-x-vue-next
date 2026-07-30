<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import { Sources } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSourcesExpand' });

const expanded = ref(true);
const items = [
  { key: '1', title: 'Ant Design', url: 'https://ant.design' },
  { key: '2', title: 'Vue', url: 'https://vuejs.org' },
];

defineRender(() => {
  return (
    <>
      <Button onClick={() => (expanded.value = !expanded.value)} style={{ marginBottom: '12px' }}>
        Toggle
      </Button>
      <Sources
        title="已参考 2 篇资料"
        items={items}
        expanded={expanded.value}
        onExpand={(next) => {
          expanded.value = next;
        }}
      />
    </>
  );
});
</script>
