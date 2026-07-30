<script setup lang="tsx">
import { Sources } from 'ant-design-x-vue';

defineOptions({ name: 'AXSourcesBasic' });

const items = [
  { key: '1', title: 'Ant Design', url: 'https://ant.design' },
  { key: '2', title: 'Ant Design X', url: 'https://x.ant.design' },
  { key: '3', title: 'Vue', url: 'https://vuejs.org' },
];

defineRender(() => {
  return <Sources title="已参考 3 篇资料" items={items} />;
});
</script>
