<script setup lang="ts">
import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { Button, Flex, Switch, message as messageAnt } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';
import { h, ref } from 'vue';

defineOptions({ name: 'AXActionsFadeInSetup' });

const [message, contextHolder] = messageAnt.useMessage();
const key = ref(0);
const fadeInLeft = ref(true);

const actionItems: ActionsProps['items'] = [
  { key: 'retry', icon: h(RedoOutlined), label: 'Retry' },
  { key: 'copy', icon: h(CopyOutlined), label: 'Copy' },
];
</script>

<template>
  <context-holder />
  <Flex gap="middle" vertical>
    <Flex gap="middle" align="center">
      <Switch
        checked-children="fadeInLeft"
        un-checked-children="fadeIn"
        v-model:checked="fadeInLeft"
      />
      <Button @click="key += 1">Re-Render</Button>
    </Flex>
    <Actions
      :key="key"
      :fade-in="!fadeInLeft"
      :fade-in-left="fadeInLeft"
      :items="actionItems"
      @click="({ keyPath }) => message.success(`you clicked ${keyPath?.join(',')}`)"
    />
  </Flex>
</template>
