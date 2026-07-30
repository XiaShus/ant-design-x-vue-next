<script setup lang="ts">
import { CloudOutlined } from '@ant-design/icons-vue';
import { Space, Spin, Typography, message as messageAnt } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watch, h } from 'vue';

defineOptions({ name: 'AXSenderSuffixSetup' });

const [message, contextHolder] = messageAnt.useMessage();

const value = ref('');
const loading = ref<boolean>(false);

watch(loading, () => {
  if (loading.value) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';
      message.success('Send message successfully!');
    }, 2000);

    onWatcherCleanup(() => {
      clearTimeout(timer);
    });
  }
});
</script>

<template>
  <context-holder />
  <Sender
    v-model:value="value"
    submit-type="shiftEnter"
    :loading="loading"
    @submit="() => { loading = true }"
    @cancel="() => { loading = false }"
  >
    <template #suffix="{ info: { components: { SendButton, LoadingButton, ClearButton, SpeechButton } } }">
      <Space size="small">
        <Typography.Text type="secondary">
          <small>`Shift + Enter` to submit</small>
        </Typography.Text>
        <component :is="ClearButton" />
        <component :is="SpeechButton" />
        <component
          :is="LoadingButton"
          v-if="loading"
          type="default"
          style="display: block;"
          :disabled="true"
        >
          <template #icon>
            <Spin size="small" />
          </template>
        </component>
        <component
          :is="SendButton"
          v-else
          type="primary"
          :disabled="false"
          :icon="h(CloudOutlined)"
        />
      </Space>
    </template>
  </Sender>
</template>
