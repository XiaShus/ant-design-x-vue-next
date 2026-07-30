<script setup lang="tsx">
import { DeleteOutlined } from '@ant-design/icons-vue';
import { Button, Flex } from 'ant-design-vue';
import {
  Bubble,
  Conversations,
  Sender,
  useXAgent,
  useXChat,
  useXConversations,
  DefaultChatProvider,
  type ConversationsProps,
} from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXUseXConversationsBasic' });

const {
  conversations,
  activeConversationKey,
  setActiveConversationKey,
  addConversation,
  removeConversation,
} = useXConversations({
  defaultConversations: [{ key: 'c1', label: '默认会话' }],
  defaultActiveConversationKey: 'c1',
});

const provider = new DefaultChatProvider();
const [agent] = useXAgent<string, { message: string }, string>({
  request: async ({ message }, { onSuccess }) => {
    await new Promise((r) => setTimeout(r, 400));
    onSuccess([`Echo: ${message}`]);
  },
});

const { onRequest, messages } = useXChat({
  agent: agent.value,
  conversationKey: activeConversationKey,
  provider,
});

const content = ref('');
let seed = 2;

const items = computed<ConversationsProps['items']>(() =>
  conversations.value.map((c) => ({
    key: c.key,
    label: (c as { label?: string }).label || c.key,
  })),
);

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  items: [
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ],
  onClick: (menuInfo) => {
    menuInfo.domEvent.stopPropagation();
    if (menuInfo.key !== 'delete') return;
    if (conversations.value.length <= 1) return;
    removeConversation(String(conversation.key));
    if (activeConversationKey.value === conversation.key) {
      setActiveConversationKey(String(conversations.value[0]?.key || ''));
    }
  },
});

const onAdd = () => {
  const key = `c${seed++}`;
  addConversation({ key, label: `会话 ${key}` }, 'prepend');
  setActiveConversationKey(key);
};

defineRender(() => {
  return (
    <Flex gap="middle" style={{ height: 320 }}>
      <Flex vertical gap="small" style={{ width: 200 }}>
        <Button type="dashed" block onClick={onAdd}>
          新建会话
        </Button>
        <Conversations
          items={items.value}
          activeKey={activeConversationKey.value}
          onActiveChange={(k) => setActiveConversationKey(String(k))}
          menu={menuConfig}
          style={{ flex: 1, overflow: 'auto' }}
        />
      </Flex>
      <Flex vertical style={{ flex: 1, minWidth: 0 }} gap="small">
        <Bubble.List
          style={{ flex: 1, overflow: 'auto' }}
          items={messages.value.map(({ id, message, status }) => ({
            key: id,
            role: status === 'local' ? 'local' : 'ai',
            content: String(message),
            loading: status === 'loading',
          }))}
        />
        <Sender
          value={content.value}
          onChange={(v) => {
            content.value = v;
          }}
          onSubmit={(next) => {
            onRequest(next);
            content.value = '';
          }}
        />
      </Flex>
    </Flex>
  );
});
</script>
