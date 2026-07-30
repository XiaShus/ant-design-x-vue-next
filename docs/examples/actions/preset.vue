<script setup lang="tsx">
import { CheckOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { App, Pagination } from 'ant-design-vue';
import { ref } from 'vue';
import {
  Actions,
  type ActionsFeedbackProps,
  type ActionsItemProps,
  type ActionsProps,
} from 'ant-design-x-vue';

defineOptions({ name: 'AXActionsPreset' });

const Demo = () => {
  const { message } = App.useApp();
  const curPage = ref(1);
  const feedbackStatus = ref<ActionsFeedbackProps['value']>('default');
  const audioStatus = ref<ActionsItemProps['status']>('default');
  const shareStatus = ref<ActionsItemProps['status']>('default');

  const onClick = (type: 'share' | 'audio') => {
    const dispatchFN = type === 'share' ? shareStatus : audioStatus;
    const status = type === 'share' ? shareStatus.value : audioStatus.value;
    switch (status) {
      case 'default':
        dispatchFN.value = 'loading';
        setTimeout(() => {
          dispatchFN.value = 'running';
        }, 1500);
        break;
      case 'running':
        dispatchFN.value = 'loading';
        setTimeout(() => {
          dispatchFN.value = 'default';
        }, 1500);
        break;
      default:
        break;
    }
  };

  const items: ActionsProps['items'] = [
    {
      key: 'pagination',
      actionRender: () => (
        <Pagination
          simple
          current={curPage.value}
          onChange={(page: number) => {
            curPage.value = page;
          }}
          total={5}
          pageSize={1}
        />
      ),
    },
    {
      key: 'feedback',
      actionRender: () => (
        <Actions.Feedback
          value={feedbackStatus.value}
          styles={{
            liked: { color: '#f759ab' },
          }}
          onChange={(val) => {
            feedbackStatus.value = val;
            message.success(`Change feedback value to: ${val}`);
          }}
        />
      ),
    },
    {
      key: 'copy',
      label: 'copy',
      actionRender: () => <Actions.Copy text="copy value" />,
    },
    {
      key: 'audio',
      label: 'audio',
      actionRender: () => (
        <Actions.Audio
          onClick={() => onClick('audio')}
          status={audioStatus.value}
        />
      ),
    },
    {
      key: 'share',
      label: 'share',
      actionRender: () => (
        <Actions.Item
          onClick={() => onClick('share')}
          label={shareStatus.value}
          status={shareStatus.value}
          defaultIcon={<ShareAltOutlined />}
          runningIcon={<CheckOutlined />}
        />
      ),
    },
  ];

  return <Actions items={items} />;
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  );
});
</script>
