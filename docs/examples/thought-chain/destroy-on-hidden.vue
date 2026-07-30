<script setup lang="tsx">
import { Button, Card, Space, Switch } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXThoughtChainDestroyOnHidden' });

const expandedKeys = ref<string[]>(['task1']);
const destroyOnHidden = ref(true);

const items = computed<ThoughtChainProps['items']>(() => [
  {
    key: 'task1',
    title: 'Collapsible Task',
    description: 'Content will be removed from DOM when collapsed',
    collapsible: true,
    destroyOnHidden: destroyOnHidden.value,
    content: 'Task detail content.',
  },
  {
    key: 'task2',
    title: 'Normal Task',
    content: 'Task2 content.',
  },
]);

const toggle = () => {
  expandedKeys.value = expandedKeys.value.includes('task1') ? [] : ['task1'];
};

defineRender(() => {
  return (
    <Card style={{ width: '500px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={toggle}>
          {expandedKeys.value.includes('task1') ? 'Collapse' : 'Expand'}
        </Button>
        <Switch
          checked={destroyOnHidden.value}
          onChange={(checked) => {
            destroyOnHidden.value = !!checked;
          }}
          checkedChildren="destroyOnHidden"
          unCheckedChildren="keep"
        />
      </Space>
      <ThoughtChain
        items={items.value}
        expandedKeys={expandedKeys.value}
        onExpand={(keys) => {
          expandedKeys.value = keys;
        }}
      />
    </Card>
  );
});
</script>
