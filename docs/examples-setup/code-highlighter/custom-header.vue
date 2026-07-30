<script setup lang="ts">
import { CodeHighlighter } from 'ant-design-x-vue';

defineOptions({ name: 'AXCodeHighlighterCustomHeaderSetup' });

const code = `import { ref } from 'vue';

function useCounter() {
  const count = ref(0);
  const increase = () => {
    count.value += 1;
  };
  return { count, increase };
}`;
</script>

<template>
  <CodeHighlighter lang="typescript">
    <template #header>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: #f5f5f5;
        "
      >
        <span style="font-weight: 500">Vue 计数器示例</span>
        <span
          style="
            padding: 2px 8px;
            background: #e6f7ff;
            border-radius: 4px;
            font-size: 12px;
            color: #1890ff;
          "
        >
          TypeScript
        </span>
      </div>
    </template>
    {{ code }}
  </CodeHighlighter>
</template>
