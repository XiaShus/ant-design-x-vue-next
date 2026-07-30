<script setup lang="tsx">
import { Flex, Radio, Typography } from 'ant-design-vue';
import antdEnUS from 'ant-design-vue/es/locale/en_US';
import antdZhCN from 'ant-design-vue/es/locale/zh_CN';
import { Conversations, XProvider } from 'ant-design-x-vue';
import enUS from 'ant-design-x-vue/locale/en_US';
import zhCN from 'ant-design-x-vue/locale/zh_CN';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXProviderLocale' });

const lang = ref<'zh' | 'en'>('zh');

const locale = computed(() =>
  lang.value === 'zh' ? { ...antdZhCN, ...zhCN } : { ...antdEnUS, ...enUS },
);

defineRender(() => {
  return (
    <Flex vertical gap={16}>
      <Flex gap={12} align="center">
        <Typography.Text>Locale:</Typography.Text>
        <Radio.Group
          value={lang.value}
          onChange={(e) => {
            lang.value = e.target.value;
          }}
        >
          <Radio.Button value="zh">中文</Radio.Button>
          <Radio.Button value="en">English</Radio.Button>
        </Radio.Group>
      </Flex>
      <XProvider locale={locale.value as any}>
        <Conversations
          style={{ width: 280 }}
          items={[{ key: '1', label: 'Conversation - 1' }]}
          creation={{}}
        />
      </XProvider>
    </Flex>
  );
});
</script>
