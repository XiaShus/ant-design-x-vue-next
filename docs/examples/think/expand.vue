<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXThinkExpand' });

const value = ref(true);

const Demo = () => {
  return (
    <>
      <div>
        <Button onClick={() => (value.value = !value.value)}>Change expand</Button>
      </div>
      <br />
      <Think
        title="deep thinking"
        expanded={value.value}
        onExpand={(next) => {
          value.value = next;
        }}
      >
        This is deep thinking content.
      </Think>
    </>
  );
};

defineRender(() => {
  return <Demo />;
});
</script>
