<script setup lang="tsx">
import { FileCard } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXFileCardList' });

const items = ref([
  { name: 'product.pdf', byte: 1024 * 800 },
  { name: 'spec.docx', byte: 1024 * 320 },
  { name: 'demo.zip', byte: 1024 * 2048 },
]);

defineRender(() => {
  return (
    <FileCard.List
      items={items.value}
      removable
      onRemove={(item) => {
        items.value = items.value.filter((i) => i.name !== item.name);
      }}
    />
  );
});
</script>
