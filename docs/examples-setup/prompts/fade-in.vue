<script setup lang="ts">
import {
  BulbOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SmileOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import { Button, Flex, Switch, message as messageAnt } from 'ant-design-vue';
import { Prompts, type PromptsProps } from 'ant-design-x-vue';
import { h, ref } from 'vue';

defineOptions({ name: 'AXPromptsFadeInSetup' });

const [message, contextHolder] = messageAnt.useMessage();
const key = ref(0);
const fadeInLeft = ref(true);

const items: PromptsProps['items'] = [
  {
    key: '1',
    icon: h(BulbOutlined, { style: { color: '#FFD700' } }),
    label: 'Ignite Your Creativity',
    description: 'Got any sparks for a new project?',
  },
  {
    key: '2',
    icon: h(InfoCircleOutlined, { style: { color: '#1890FF' } }),
    label: 'Uncover Background Info',
    description: 'Help me understand the background of this topic.',
  },
  {
    key: '3',
    icon: h(RocketOutlined, { style: { color: '#722ED1' } }),
    label: 'Efficiency Boost Battle',
    description: 'How can I work faster and better?',
  },
  {
    key: '4',
    icon: h(SmileOutlined, { style: { color: '#52C41A' } }),
    label: 'Tell me a Joke',
    description: 'Why do not ants get sick? Because they have tiny ant-bodies!',
  },
  {
    key: '5',
    icon: h(WarningOutlined, { style: { color: '#FF4D4F' } }),
    label: 'Common Issue Solutions',
    description: 'How to solve common issues? Share some tips!',
  },
];
</script>

<template>
  <context-holder />
  <Flex gap="middle" vertical>
    <Flex gap="middle" align="center">
      <Switch
        style="align-self: flex-end"
        checked-children="fadeInLeft"
        un-checked-children="fadeIn"
        v-model:checked="fadeInLeft"
      />
      <Button style="align-self: flex-end" @click="key += 1">Re-Render</Button>
    </Flex>
    <Prompts
      :key="key"
      :fade-in="!fadeInLeft"
      :fade-in-left="fadeInLeft"
      title="✨ Inspirational Sparks and Marvelous Tips"
      :items="items"
      @item-click="(info) => message.success(`You clicked a prompt: ${info.data.label}`)"
    />
  </Flex>
</template>
