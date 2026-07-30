<script setup lang="ts">
import { Typography } from 'ant-design-vue';
import { useMobile } from 'ant-design-x-vue';

defineOptions({ name: 'UseMobileBasicSetup' });

const isMobile = useMobile();
</script>

<template>
  <Typography.Paragraph>
    useMobile():
    <Typography.Text code>{{ String(isMobile) }}</Typography.Text>
    （默认查询
    <Typography.Text code>(pointer: coarse)</Typography.Text>
    ）
  </Typography.Paragraph>
</template>
