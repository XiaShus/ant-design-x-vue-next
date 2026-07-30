<script setup lang="ts">
import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { Flex, Typography, message as messageAnt } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXActionsVariantSetup' });

const [message, contextHolder] = messageAnt.useMessage();

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    icon: h(RedoOutlined),
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: h(CopyOutlined),
    label: 'Copy',
  },
];

const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
  message.success(`you clicked ${keyPath.join(',')}`);
};
</script>

<template>
  <context-holder />
  <Flex
    vertical
    gap="middle"
  >
    <div>
      <Typography.Text type="secondary">borderless</Typography.Text>
      <div>
        <Actions
          :items="actionItems"
          :on-click="onClick"
          variant="borderless"
        />
      </div>
    </div>
    <div>
      <Typography.Text type="secondary">outlined</Typography.Text>
      <div>
        <Actions
          :items="actionItems"
          :on-click="onClick"
          variant="outlined"
        />
      </div>
    </div>
    <div>
      <Typography.Text type="secondary">filled</Typography.Text>
      <div>
        <Actions
          :items="actionItems"
          :on-click="onClick"
          variant="filled"
        />
      </div>
    </div>
  </Flex>
</template>
