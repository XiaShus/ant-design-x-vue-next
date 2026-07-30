<script setup lang="ts">
import { XMarkdown } from 'ant-design-x-vue';

defineOptions({ name: 'AXXMarkdownBasicSetup' });

const content = `# Ant Design X Markdown

流式友好的 Markdown 渲染（Vue Next）。

- 支持 **GFM** 风格列表
- 支持 [链接](https://x.ant.design)
- 支持行内 \`code\`

\`\`\`ts
import { XMarkdown } from 'ant-design-x-vue-next';

export default () => <XMarkdown content="# Hello" />;
\`\`\`
`;
</script>

<template>
  <XMarkdown :content="content" open-links-in-new-tab />
</template>
