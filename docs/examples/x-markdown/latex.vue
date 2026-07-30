<script setup lang="tsx">
import { XMarkdown, Latex } from 'ant-design-x-vue';

defineOptions({ name: 'AXXMarkdownLatex' });

const content = `# 数学公式

行内公式：$E = mc^2$，以及 $\\alpha + \\beta$。

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`;

defineRender(() => {
  return <XMarkdown content={content} config={{ extensions: Latex() }} />;
});
</script>
