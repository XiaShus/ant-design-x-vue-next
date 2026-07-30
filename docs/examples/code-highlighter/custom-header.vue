<script setup lang="tsx">
import { Button, Space } from 'ant-design-vue';
import { CodeHighlighter } from 'ant-design-x-vue';

defineOptions({ name: 'AXCodeHighlighterCustomHeader' });

const code = `import { ref } from 'vue';

function useCounter() {
  const count = ref(0);
  const increase = () => {
    count.value += 1;
  };
  return { count, increase };
}`;

defineRender(() => {
  const customHeader = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: '#f5f5f5',
      }}
    >
      <Space>
        <span style={{ fontWeight: 500 }}>Vue 计数器示例</span>
        <span
          style={{
            padding: '2px 8px',
            background: '#e6f7ff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#1890ff',
          }}
        >
          TypeScript
        </span>
      </Space>
      <Space>
        <Button size="small" type="text">
          运行
        </Button>
        <Button size="small" type="text">
          分享
        </Button>
      </Space>
    </div>
  );

  return (
    <CodeHighlighter lang="typescript" header={customHeader}>
      {code}
    </CodeHighlighter>
  );
});
</script>
