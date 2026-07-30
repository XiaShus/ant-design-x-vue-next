<script setup lang="ts">
import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Flex, message } from 'ant-design-vue';
import {
  Actions,
  Bubble,
  Sender,
  useXAgent,
  useXChat,
  type ActionsProps,
  type BubbleListProps,
} from 'ant-design-x-vue';
import { computed, h, ref } from 'vue';

defineOptions({ name: 'AXUseXChatReloadSetup' });

const sleep = () => new Promise((resolve) => setTimeout(resolve, 600));

let replyCount = 0;

const content = ref('');
const senderLoading = ref(false);

const [agent] = useXAgent<string, { message: string }, string>({
  request: async ({ message }, { onSuccess }) => {
    senderLoading.value = true;
    await sleep();
    replyCount += 1;
    senderLoading.value = false;
    onSuccess([`Reply #${replyCount}: ${message}`]);
  },
});

const { onRequest, onReload, messages, isRequesting } = useXChat({
  agent: agent.value,
  requestPlaceholder: 'Regenerating...',
});

const requesting = computed(() => isRequesting.value || senderLoading.value);

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: UserOutlined, style: { background: '#fde3cf' } },
    style: { maxWidth: '600px' },
  },
  local: {
    placement: 'end',
    avatar: { icon: UserOutlined, style: { background: '#87d068' } },
  },
};

const bubbleItems = computed(() =>
  messages.value.map(({ id, message: msg, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: msg,
    footer:
      status === 'local' || status === 'loading'
        ? undefined
        : () => {
            const items: ActionsProps['items'] = [
              {
                key: 'retry',
                icon: h(RedoOutlined),
                label: 'Retry',
              },
              {
                key: 'copy',
                icon: h(CopyOutlined),
                label: 'Copy',
              },
            ];
            return h(Actions, {
              items,
              onClick: ({ key }: { key?: string | number }) => {
                if (key === 'retry') {
                  if (requesting.value) return;
                  onReload(id);
                  return;
                }
                if (key === 'copy') {
                  void navigator.clipboard?.writeText(String(msg)).then(
                    () => message.success('Copied'),
                    () => message.info(String(msg)),
                  );
                }
              },
            });
          },
  })),
);
</script>

<template>
  <Flex vertical gap="middle">
    <Bubble.List :roles="roles" :style="{ maxHeight: '300px' }" :items="bubbleItems" />
    <Sender
      :loading="requesting"
      :value="content"
      @change="(v) => (content = v)"
      @submit="
        (nextContent) => {
          onRequest(nextContent);
          content = '';
        }
      "
    />
  </Flex>
</template>
