<script setup lang="ts">
import { Flex, Typography } from 'ant-design-vue';
import { Bubble } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXBubbleExtraSetup' });
</script>

<template>
  <Flex vertical gap="middle">
    <Bubble
      content="Hello, this bubble has a side extra."
      :_key="'09:41'"
      :extra="(_, { key }) => h(Typography.Text, { type: 'secondary', style: { fontSize: '12px' } }, () => key ?? 'now')"
    />
    <Bubble placement="end" content="User message with timestamp on the side.">
      <template #extra>
        <Typography.Text type="secondary" style="font-size: 12px">09:42</Typography.Text>
      </template>
    </Bubble>
  </Flex>
</template>
