<script setup lang="tsx">
import { Button, Flex } from 'ant-design-vue';
import { notification } from 'ant-design-x-vue';

defineOptions({ name: 'AXNotificationDuration' });

const describeInfo: Record<NotificationPermission, string> = {
  denied: '通知权限已被拒绝，请在网站设置中重置权限。',
  granted: '通知权限已授予，打开后将在 4.5 秒后自动关闭。',
  default: '请先请求权限。',
};

const [state, { open, requestPermission }] = notification.useNotification();

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <div>{describeInfo[state.permission]}</div>
      <Flex gap="middle" wrap="wrap">
        <Button
          disabled={state.permission !== 'default'}
          type="primary"
          onClick={() => requestPermission()}
        >
          {state.permission === 'default'
            ? '请请求权限'
            : `通知权限：${state.permission}`}
        </Button>
        <Button
          disabled={state.permission !== 'granted'}
          type="primary"
          onClick={() =>
            open({
              title: 'Task completed',
              body: 'The task was completed at 13:12',
              duration: 4.5,
              icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
            })
          }
        >
          打开通知
        </Button>
      </Flex>
    </Flex>
  );
});
</script>
