<script setup lang="ts">
import { XMarkdown } from 'ant-design-x-vue';

defineOptions({ name: 'AXXMarkdownDebugSetup' });

const content = `# Debug Panel

开启 \`debug\` 后，右上角会显示 FPS / Memory 浮层，可录制性能曲线。

流式渲染大段内容时，用它观察卡顿与内存变化。
`;
</script>

<template>
  <XMarkdown :content="content" debug />
</template>
