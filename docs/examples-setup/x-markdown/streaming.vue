<script setup lang="ts">
import { Button, Space } from 'ant-design-vue';
import { computed, ref } from 'vue';
import { XMarkdown } from 'ant-design-x-vue';

defineOptions({ name: 'AXXMarkdownStreamingSetup' });

const full = `## 流式输出演示

正在生成回复：

1. 解析需求
2. 组织答案
3. 输出 Markdown

> 尾部光标会在 \`hasNextChunk\` 为 true 时显示。
`;

const content = ref('');
const hasNextChunk = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const streaming = computed(() => ({
  hasNextChunk: hasNextChunk.value,
  tail: true as const,
}));

const start = () => {
  content.value = '';
  hasNextChunk.value = true;
  let i = 0;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    i += 3;
    content.value = full.slice(0, i);
    if (i >= full.length) {
      hasNextChunk.value = false;
      if (timer) clearInterval(timer);
      timer = null;
    }
  }, 40);
};
</script>

<template>
  <div>
    <Space style="margin-bottom: 16px">
      <Button type="primary" @click="start">开始流式</Button>
    </Space>
    <XMarkdown :content="content" :streaming="streaming" />
  </div>
</template>
