<script setup lang="tsx">
import { Button, Flex } from 'ant-design-vue';
import { notification } from 'ant-design-x-vue';

defineOptions({ name: 'AXNotificationCloseTag' });

const describeInfo: Record<NotificationPermission, string> = {
  denied: '通知权限已被拒绝，请在网站设置中重置权限。',
  granted: '通知权限已授予，可通过 tag 关闭指定通知。',
  default: '请先请求权限。',
};

const [state, { open, close, requestPermission }] = notification.useNotification();

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
              tag: 'tag_task_completed',
              icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
            })
          }
        >
          打开通知
        </Button>
        <Button
          danger
          disabled={state.permission !== 'granted'}
          onClick={() => close(['tag_task_completed'])}
        >
          关闭指定 tag
        </Button>
      </Flex>
    </Flex>
  );
});
</script>
