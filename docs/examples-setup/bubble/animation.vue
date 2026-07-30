<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Button, Flex, Switch, Typography } from 'ant-design-vue';
import { Bubble } from 'ant-design-x-vue';
import { computed, h, ref } from 'vue';

defineOptions({ name: 'BubbleAnimationSetup' });

const keepPrefix = ref(true);
const content = ref('Ant Design X — streaming prefix kept by default.');

const typing = computed(() => ({
  step: 2,
  interval: 40,
  keepPrefix: keepPrefix.value,
}));

const replaceContent = () => {
  content.value = content.value.startsWith('Ant Design X')
    ? 'Completely different answer — retypes from start when keepPrefix is off.'
    : 'Ant Design X — streaming prefix kept by default.';
};

const appendStream = () => {
  if (!content.value.startsWith('Ant Design X')) {
    content.value = 'Ant Design X';
  }
  content.value += ' more tokens…';
};
</script>

<template>
  <Flex vertical gap="middle">
    <Flex gap="middle" align="center" wrap="wrap">
      <Typography.Text>keepPrefix:</Typography.Text>
      <Switch
        v-model:checked="keepPrefix"
        checked-children="true"
        un-checked-children="false"
      />
      <Button @click="appendStream">Append (stream)</Button>
      <Button @click="replaceContent">Replace content</Button>
    </Flex>
    <Bubble
      :content="content"
      :typing="typing"
      :avatar="{ icon: h(UserOutlined) }"
    />
  </Flex>
</template>
