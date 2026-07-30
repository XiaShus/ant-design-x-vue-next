<script setup lang="ts">
import { Button, Flex } from 'ant-design-vue';
import { notification, type XNotificationOpenArgs } from 'ant-design-x-vue';

defineOptions({ name: 'AXNotificationHooksSetup' });

const DescribeInfo: Record<NotificationPermission, string> = {
  denied: '通知权限已被拒绝，需要在网站设置中手动重置通知权限后才能再次触发授权弹窗。',
  granted: '通知权限已授予，可点击「打开通知」推送一条系统通知。',
  default: '请先请求权限，授权通过后即可推送通知。',
};

const openData: XNotificationOpenArgs = {
  title: 'Task completed',
  body: 'The task was completed at 13:12',
  icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  onClick: (_event, close) => {
    close?.();
  },
};

const [state, { open, requestPermission, close }] = notification.useNotification();
</script>

<template>
  <Flex vertical gap="middle">
    <div>{{ DescribeInfo[state.permission] }}</div>
    <Flex gap="middle" wrap="wrap">
      <Button
        :disabled="state.permission !== 'default'"
        type="primary"
        @click="requestPermission()"
      >
        {{ state.permission === 'default' ? '请请求权限' : `通知权限：${state.permission}` }}
      </Button>
      <Button :disabled="state.permission !== 'granted'" type="primary" @click="open(openData)">
        打开通知
      </Button>
      <Button danger :disabled="state.permission !== 'granted'" @click="close()">关闭全部</Button>
    </Flex>
  </Flex>
</template>
