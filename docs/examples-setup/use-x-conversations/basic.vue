<script setup lang="ts">
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
import { computed, h, ref } from 'vue';

defineOptions({ name: 'AXUseXConversationsBasicSetup' });

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
      icon: h(DeleteOutlined),
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

const bubbleItems = computed(() =>
  messages.value.map(({ id, message, status }) => ({
    key: id,
    role: status === 'local' ? 'local' : 'ai',
    content: String(message),
    loading: status === 'loading',
  })),
);

const onAdd = () => {
  const key = `c${seed++}`;
  addConversation({ key, label: `会话 ${key}` }, 'prepend');
  setActiveConversationKey(key);
};

const onSubmit = (next: string) => {
  onRequest(next);
  content.value = '';
};
</script>

<template>
  <Flex
    gap="middle"
    :style="{ height: '320px' }"
  >
    <Flex
      vertical
      gap="small"
      :style="{ width: '200px' }"
    >
      <Button
        type="dashed"
        block
        @click="onAdd"
      >
        新建会话
      </Button>
      <Conversations
        :items="items"
        :active-key="activeConversationKey"
        :menu="menuConfig"
        :style="{ flex: 1, overflow: 'auto' }"
        @active-change="(k) => setActiveConversationKey(String(k))"
      />
    </Flex>
    <Flex
      vertical
      gap="small"
      :style="{ flex: 1, minWidth: 0 }"
    >
      <Bubble.List
        :style="{ flex: 1, overflow: 'auto' }"
        :items="bubbleItems"
      />
      <Sender
        :value="content"
        :on-change="(v) => (content = v)"
        :on-submit="onSubmit"
      />
    </Flex>
  </Flex>
</template>
