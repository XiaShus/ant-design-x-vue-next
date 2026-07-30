<script setup lang="tsx">
import { UserOutlined } from '@ant-design/icons-vue';
import { Avatar, Button, Divider, Flex, Switch, Typography } from 'ant-design-vue';
import { computed, onUnmounted, ref, watch } from 'vue';
import { Bubble, type BubbleProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXBubbleStreamDemo' });

const text = 'Ant Design X Vue Next - Better UI toolkit for your AI Chat WebApp. '.repeat(3);

function useStreamContent(
  content: () => string,
  config: () => { step: number; interval: number },
) {
  const streamContent = ref('');
  const done = ref(true);
  let timer = -1 as any;

  const clear = () => {
    if (timer !== -1) clearInterval(timer);
    timer = -1;
  };

  const startStream = (full: string) => {
    clear();
    done.value = false;
    streamContent.value = '';
    const { step, interval } = config();
    timer = setInterval(() => {
      const len = streamContent.value.length + step;
      if (len < full.length) {
        streamContent.value = full.slice(0, len);
      } else {
        streamContent.value = full;
        done.value = true;
        clear();
      }
    }, interval);
  };

  watch(
    content,
    (c) => {
      if (!c) {
        streamContent.value = '';
        done.value = true;
        clear();
        return;
      }
      startStream(c);
    },
  );

  onUnmounted(clear);
  return { streamContent, done };
}

const loading = ref(true);
const data = ref('');
const streamConfig = ref({ step: 2, interval: 50 });
const typing = ref(false);
const disableStreaming = ref(false);
const count = ref(0);

const { streamContent, done } = useStreamContent(
  () => data.value,
  () => streamConfig.value,
);

const typingConfig: BubbleProps['typing'] = {
  effect: 'typing',
  step: 5,
  interval: 50,
};

const loadStream = (step: number, interval: number) => {
  loading.value = false;
  count.value = 0;
  data.value = `${(Math.random() * 10).toFixed(0)} - ${text}`;
  streamConfig.value = { step, interval };
};

const streaming = computed(() => (disableStreaming.value ? false : !done.value));

defineRender(() => {
  return (
    <Flex vertical gap="small">
      <Flex gap="small" align="center">
        <span>流式数据:</span>
        <Button type="primary" onClick={() => loadStream(2, 100)}>
          load slowly
        </Button>
        <Button onClick={() => loadStream(10, 50)}>load quickly</Button>
        <Button
          type="link"
          onClick={() => {
            data.value = '';
          }}
        >
          clear
        </Button>
      </Flex>
      <Flex gap="small" align="center">
        <span>强制关闭 streaming:</span>
        <Switch
          checked={disableStreaming.value}
          onChange={(v: any) => {
            disableStreaming.value = !!v;
          }}
        />
      </Flex>
      <Flex gap="small" align="center">
        <span>启用 typing 动画:</span>
        <Switch
          checked={typing.value}
          onChange={(v: any) => {
            typing.value = !!v;
          }}
        />
      </Flex>
      <Flex gap="small" align="center">
        <span>
          onTypingComplete 次数:{' '}
          <Typography.Text type="danger">{count.value}</Typography.Text>
        </span>
      </Flex>
      <Divider />
      <Bubble
        loading={loading.value}
        content={streamContent.value}
        streaming={streaming.value}
        typing={typing.value ? typingConfig : false}
        header={<h5>ADX</h5>}
        avatar={<Avatar icon={<UserOutlined />} />}
        onTypingComplete={() => {
          count.value += 1;
        }}
      />
    </Flex>
  );
});
</script>
