<script setup lang="tsx">
import { Button, Space } from 'ant-design-vue';
import { ref } from 'vue';
import { XMarkdown } from 'ant-design-x-vue';

defineOptions({ name: 'AXXMarkdownStreaming' });

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

defineRender(() => {
  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={start}>
          开始流式
        </Button>
      </Space>
      <XMarkdown
        content={content.value}
        streaming={{ hasNextChunk: hasNextChunk.value, tail: true }}
      />
    </div>
  );
});
</script>
