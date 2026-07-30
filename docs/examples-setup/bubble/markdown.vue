<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble, XMarkdown } from 'ant-design-x-vue';
import type { BubbleProps } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watchEffect, h } from 'vue';

defineOptions({ name: 'AXBubbleMarkdownSetup' });

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const renderMarkdown: BubbleProps['messageRender'] = (content) =>
  h(XMarkdown, { content, openLinksInNewTab: true });

const renderKey = ref(0);

watchEffect(() => {
  const id = setTimeout(() => {
    renderKey.value = renderKey.value + 1;
  }, text.length * 100 + 2000);
  onWatcherCleanup(() => {
    clearTimeout(id);
  });
});
</script>

<template>
  <div :style="{ height: 100 }" :key="renderKey">
    <Bubble
      :typing="true"
      :content="text"
      :messageRender="renderMarkdown"
      :avatar="{ icon: h(UserOutlined) }"
    />
  </div>
</template>
