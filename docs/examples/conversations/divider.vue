<script setup lang="tsx">
import { Conversations, type ConversationsItems } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXConversationsDivider' });

const items: ConversationsItems[] = [
  { key: '1', label: 'Design sync' },
  { key: '2', label: 'Sprint planning' },
  { type: 'divider' },
  { key: '3', label: 'Archived: Q1 review' },
  { key: '4', label: 'Archived: launch retro', disabled: true },
];

const activeKey = ref('1');

defineRender(() => (
  <Conversations
    style={{ width: 280 }}
    items={items}
    activeKey={activeKey.value}
    onActiveChange={(key) => {
      activeKey.value = key;
    }}
  />
));
</script>
