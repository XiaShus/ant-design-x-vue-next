<script setup lang="ts">
import { Latex, XMarkdown } from 'ant-design-x-vue';

defineOptions({ name: 'AXXMarkdownLatexSetup' });

const content = `# 数学公式

行内公式：$E = mc^2$，以及 $\\alpha + \\beta$。

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`;

const config = { extensions: Latex() };
</script>

<template>
  <XMarkdown :content="content" :config="config" />
</template>
