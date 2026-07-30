<script setup lang="tsx">
import { CodeHighlighter } from 'ant-design-x-vue';

defineOptions({ name: 'AXCodeHighlighterBasic' });

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

defineRender(() => {
  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>JavaScript Code</h3>
      <CodeHighlighter lang="javascript">{code}</CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>CSS Code</h3>
      <CodeHighlighter lang="css">
        {`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>HTML Code</h3>
      <CodeHighlighter lang="html">
        {`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`}
      </CodeHighlighter>

      <h3 style={{ margin: '8px 0' }}>Prism Light Mode</h3>
      <p style={{ marginBottom: 8, color: '#666' }}>
        使用 <code>prismLightMode</code> 属性启用轻量模式，按需加载语言支持，可显著减少打包体积。
      </p>
      <CodeHighlighter lang="javascript" prismLightMode>
        {code}
      </CodeHighlighter>
    </div>
  );
});
</script>
