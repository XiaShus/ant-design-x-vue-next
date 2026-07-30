<script setup lang="tsx">
import { XMarkdown } from 'ant-design-x-vue';

defineOptions({ name: 'AXXMarkdownBasic' });

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

defineRender(() => {
  return <XMarkdown content={content} openLinksInNewTab />;
});
</script>
