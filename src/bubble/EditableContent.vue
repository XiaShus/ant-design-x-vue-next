<script setup lang="tsx">
import { Button, Flex } from 'ant-design-vue';
import type { VNodeChild } from 'vue';
import { onMounted, ref } from 'vue';

function isBlock(el: HTMLElement): boolean {
  const d = getComputedStyle(el).display;
  return d === 'block' || d === 'flex' || d === 'list-item' || d === 'table';
}

function getPlainTextWithFormat(dom: HTMLElement) {
  const lines: string[] = [''];
  const walker = document.createTreeWalker(dom, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;

    if (node.nodeType === Node.TEXT_NODE) {
      lines[lines.length - 1] += node.textContent;
      continue;
    }

    if (node.tagName === 'BR' && node.parentNode?.childElementCount === 1) {
      continue;
    }

    if (node.tagName === 'BR' || isBlock(node)) {
      lines.push('');
    }
  }

  return lines.join('\n');
}

defineOptions({ name: 'AXBubbleEditableContent' });

const props = defineProps<{
  content: string;
  prefixCls?: string;
  okText?: VNodeChild;
  cancelText?: VNodeChild;
}>();

const emit = defineEmits<{
  editConfirm: [content: string];
  editCancel: [];
}>();

const mockInputRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const el = mockInputRef.value;
  if (!el) return;
  el.textContent = props.content;
  el.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
});

const onConfirm = () => {
  if (!mockInputRef.value) return;
  emit('editConfirm', getPlainTextWithFormat(mockInputRef.value));
};

const onCancel = () => emit('editCancel');

defineRender(() => {
  if (typeof props.content !== 'string') {
    throw new Error('Content of editable Bubble should be string');
  }
  return (
    <>
      <div
        ref={(el: any) => {
          mockInputRef.value = el;
        }}
        contenteditable="true"
      />
      <Flex class={`${props.prefixCls}-editing-opts`} gap={8}>
        <Button type="primary" shape="round" size="small" onClick={onConfirm}>
          {props.okText || '确定'}
        </Button>
        <Button type="text" shape="round" size="small" onClick={onCancel}>
          {props.cancelText || '取消'}
        </Button>
      </Flex>
    </>
  );
});
</script>
