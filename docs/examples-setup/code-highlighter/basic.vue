<script setup lang="ts">
import { CodeHighlighter } from 'ant-design-x-vue';

defineOptions({ name: 'AXCodeHighlighterBasicSetup' });

const code = `import { ref } from 'vue';
import { Button } from 'ant-design-vue';

const App = () => {
  const count = ref(0);
  return (
    <div>
      <Button type="primary" onClick={() => count.value++}>
        Primary Button {count.value}
      </Button>
    </div>
  );
};

export default App;`;

const cssCode = `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`;

const htmlCode = `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;
</script>

<template>
  <div>
    <h3 style="margin-bottom: 8px">JavaScript Code</h3>
    <CodeHighlighter lang="javascript">{{ code }}</CodeHighlighter>

    <h3 style="margin: 8px 0">CSS Code</h3>
    <CodeHighlighter lang="css">{{ cssCode }}</CodeHighlighter>

    <h3 style="margin: 8px 0">HTML Code</h3>
    <CodeHighlighter lang="html">{{ htmlCode }}</CodeHighlighter>

    <h3 style="margin: 8px 0">Prism Light Mode</h3>
    <p style="margin-bottom: 8px; color: #666">
      使用 <code>prismLightMode</code> 属性启用轻量模式，按需加载语言支持，可显著减少打包体积。
    </p>
    <CodeHighlighter lang="javascript" prism-light-mode>{{ code }}</CodeHighlighter>
  </div>
</template>
