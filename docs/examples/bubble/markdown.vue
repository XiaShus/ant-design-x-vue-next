<script setup lang="tsx">
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble, XMarkdown } from 'ant-design-x-vue';
import type { BubbleProps } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watchEffect } from 'vue';

defineOptions({ name: 'BubbleMarkdown' });

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <XMarkdown content={content} openLinksInNewTab />
);

const renderKey = ref(0);

watchEffect(() => {
  const id = setTimeout(
    () => {
      renderKey.value = renderKey.value + 1;
    },
    text.length * 100 + 2000,
  );
  onWatcherCleanup(() => {
    clearTimeout(id);
  });
});

defineRender(() => {
  return (
    <div style={{ height: 100 }} key={renderKey.value}>
      <Bubble
        typing
        content={text}
        messageRender={renderMarkdown}
        avatar={{ icon: <UserOutlined /> }}
      />
    </div>
  );
});
</script>
