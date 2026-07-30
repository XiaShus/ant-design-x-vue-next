<script setup lang="tsx">
import { Button, Flex } from 'ant-design-vue';
import { notification } from 'ant-design-x-vue';
import { onMounted, ref } from 'vue';

defineOptions({ name: 'AXNotificationStaticMethod' });

const describeInfo: Record<NotificationPermission, string> = {
  denied: '通知权限已被拒绝，请在网站设置中重置权限。',
  granted: '通知权限已授予，可使用静态方法推送通知。',
  default: '请先请求权限。',
};

const permission = ref<NotificationPermission>();

onMounted(() => {
  permission.value = notification.permission;
});

const request = async () => {
  permission.value = await notification.requestPermission();
};

const open = () => {
  notification.open({
    title: 'Task completed',
    body: 'The task was completed at 13:12',
    icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  });
};

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      {permission.value ? <div>{describeInfo[permission.value]}</div> : null}
      <Flex gap="middle" wrap="wrap">
        <Button
          disabled={permission.value !== 'default'}
          type="primary"
          onClick={request}
        >
          {permission.value === 'default'
            ? '请请求权限'
            : `通知权限：${permission.value}`}
        </Button>
        <Button
          disabled={permission.value !== 'granted'}
          type="primary"
          onClick={open}
        >
          打开通知
        </Button>
        <Button
          danger
          disabled={permission.value !== 'granted'}
          onClick={() => notification.close()}
        >
          关闭全部
        </Button>
      </Flex>
    </Flex>
  );
});
</script>
