<script setup lang="tsx">
import { Think } from 'ant-design-x-vue';

defineOptions({ name: 'AXThinkBasic' });

const Demo = () => {
  return <Think title="deep thinking">This is deep thinking content.</Think>;
};

defineRender(() => {
  return <Demo />;
});
</script>
