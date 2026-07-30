<script setup lang="ts">
import { CheckOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { App, Pagination, message } from 'ant-design-vue';
import { computed, h, ref } from 'vue';
import {
  Actions,
  type ActionsFeedbackProps,
  type ActionsItemProps,
  type ActionsProps,
} from 'ant-design-x-vue';

defineOptions({ name: 'AXActionsPresetSetup' });

const curPage = ref(1);
const feedbackStatus = ref<ActionsFeedbackProps['value']>('default');
const audioStatus = ref<ActionsItemProps['status']>('default');
const shareStatus = ref<ActionsItemProps['status']>('default');

const onStatefulClick = (type: 'share' | 'audio') => {
  const dispatchFN = type === 'share' ? shareStatus : audioStatus;
  const status = dispatchFN.value;
  if (status === 'default') {
    dispatchFN.value = 'loading';
    setTimeout(() => {
      dispatchFN.value = 'running';
    }, 1500);
  } else if (status === 'running') {
    dispatchFN.value = 'loading';
    setTimeout(() => {
      dispatchFN.value = 'default';
    }, 1500);
  }
};

const items = computed<ActionsProps['items']>(() => [
  {
    key: 'pagination',
    actionRender: () =>
      h(Pagination, {
        simple: true,
        current: curPage.value,
        total: 5,
        pageSize: 1,
        onChange: (page: number) => {
          curPage.value = page;
        },
      }),
  },
  {
    key: 'feedback',
    actionRender: () =>
      h(Actions.Feedback, {
        value: feedbackStatus.value,
        styles: { liked: { color: '#f759ab' } },
        onChange: (val: ActionsFeedbackProps['value']) => {
          feedbackStatus.value = val;
          message.success(`Change feedback value to: ${val}`);
        },
      }),
  },
  {
    key: 'copy',
    label: 'copy',
    actionRender: () => h(Actions.Copy, { text: 'copy value' }),
  },
  {
    key: 'audio',
    label: 'audio',
    actionRender: () =>
      h(Actions.Audio, {
        status: audioStatus.value,
        onClick: () => onStatefulClick('audio'),
      }),
  },
  {
    key: 'share',
    label: 'share',
    actionRender: () =>
      h(Actions.Item, {
        label: shareStatus.value,
        status: shareStatus.value,
        defaultIcon: h(ShareAltOutlined),
        runningIcon: h(CheckOutlined),
        onClick: () => onStatefulClick('share'),
      }),
  },
]);
</script>

<template>
  <App>
    <Actions :items="items" />
  </App>
</template>
