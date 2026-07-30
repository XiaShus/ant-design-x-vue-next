<script setup lang="tsx">
import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, Switch } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXActionsFadeIn' });

const actionItems: ActionsProps['items'] = [
  { key: 'retry', icon: <RedoOutlined />, label: 'Retry' },
  { key: 'copy', icon: <CopyOutlined />, label: 'Copy' },
];

const Demo = () => {
  const { message } = App.useApp();
  const key = ref(0);
  const fadeInLeft = ref(true);

  return (
    <Flex gap="middle" vertical>
      <Flex gap="middle" align="center">
        <Switch
          checkedChildren="fadeInLeft"
          unCheckedChildren="fadeIn"
          checked={fadeInLeft.value}
          onChange={(checked) => {
            fadeInLeft.value = !!checked;
          }}
        />
        <Button
          onClick={() => {
            key.value += 1;
          }}
        >
          Re-Render
        </Button>
      </Flex>
      <Actions
        key={key.value}
        fadeIn={!fadeInLeft.value}
        fadeInLeft={fadeInLeft.value}
        items={actionItems}
        onClick={({ keyPath }) => {
          message.success(`you clicked ${keyPath?.join(',')}`);
        }}
      />
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
