<script setup lang="tsx">
import { Conversations } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXConversationsCollapsible' });

const items = [
  { key: '1', label: 'What is Ant Design X?', group: 'Today' },
  { key: '2', label: 'How to use Conversations?', group: 'Today' },
  { key: '3', label: 'Previous chat about Bubble', group: 'Yesterday' },
  { key: '4', label: 'Shortcut keys demo', group: 'Yesterday' },
];

const activeKey = ref('1');
const expandedKeys = ref<string[]>(['Today']);

defineRender(() => (
  <Conversations
    style={{ width: 280 }}
    items={items}
    activeKey={activeKey.value}
    onActiveChange={(key) => (activeKey.value = key)}
    groupable={{
      collapsible: true,
      expandedKeys: expandedKeys.value,
      onExpand: (keys) => (expandedKeys.value = keys),
    }}
  />
));
</script>
