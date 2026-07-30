<script setup lang="tsx">
import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons-vue';
import { theme } from 'ant-design-vue';
import { computed, ref } from 'vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXConversationsNewChat' });

const agentItems: ConversationsProps['items'] = [
  { key: 'write', label: 'Help Me Write', icon: <SignatureOutlined /> },
  { key: 'coding', label: 'AI Coding', icon: <CodeOutlined /> },
  { key: 'createImage', label: 'Create Image', icon: <FileImageOutlined /> },
  { key: 'deepSearch', label: 'Deep Search', icon: <FileSearchOutlined /> },
];

const historicalItems = ref<ConversationsProps['items']>([
  { key: 'item1', label: 'Conversation Item 1', group: 'Today' },
]);

const items = computed(() => [...(agentItems || []), ...(historicalItems.value || [])]);

const { token } = theme.useToken();
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const newChatClick = () => {
  const next = (historicalItems.value?.length || 0) + 1;
  historicalItems.value = [
    ...(historicalItems.value || []),
    {
      key: `item${next}`,
      label: `Conversation Item ${next}`,
      group: 'Today',
    },
  ];
};

defineRender(() => {
  return (
    <Conversations
      creation={{ onClick: newChatClick }}
      items={items.value}
      defaultActiveKey="write"
      style={style.value}
      groupable
    />
  );
});
</script>
