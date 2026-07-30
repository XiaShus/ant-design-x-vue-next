<script setup lang="tsx">
import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { App, Flex, Typography } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXActionsVariant' });

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
  },
];

const Demo = () => {
  const { message } = App.useApp();

  const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
    message.success(`you clicked ${keyPath.join(',')}`);
  };

  return (
    <Flex vertical gap="middle">
      <div>
        <Typography.Text type="secondary">borderless</Typography.Text>
        <div>
          <Actions items={actionItems} onClick={onClick} variant="borderless" />
        </div>
      </div>
      <div>
        <Typography.Text type="secondary">outlined</Typography.Text>
        <div>
          <Actions items={actionItems} onClick={onClick} variant="outlined" />
        </div>
      </div>
      <div>
        <Typography.Text type="secondary">filled</Typography.Text>
        <div>
          <Actions items={actionItems} onClick={onClick} variant="filled" />
        </div>
      </div>
    </Flex>
  );
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  );
});
</script>
