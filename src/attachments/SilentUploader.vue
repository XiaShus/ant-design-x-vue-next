<script setup lang="tsx">
import { computed, useTemplateRef, type VNode } from 'vue';
import type { SilentUploaderProps } from './interface';
import { Upload } from 'ant-design-vue';

defineOptions({ name: 'AXAttachmentsSilentUploader' });

const {
  children,
  upload,
  visible = true,
  rootClassName,
  className,
  style,
} = defineProps<SilentUploaderProps>();

const slots = defineSlots<{
  default?(): VNode | VNode[] | string;
}>();

const uploadRef = useTemplateRef<InstanceType<typeof Upload>>('upload');

const nativeElement = computed<HTMLElement>(() => uploadRef.value?.$el);

const resolveChildren = () => {
  if (children) return children;
  const nodes = slots.default?.();
  if (!nodes) return null;
  const list = Array.isArray(nodes) ? nodes : [nodes];
  if (!list.length) return null;
  if (list.length === 1) return list[0];
  return <>{list}</>;
};

defineExpose({
  nativeElement,
});

/**
 * SilentUploader wraps children with ant-design-vue Upload (no file list UI).
 * Supports both `children` prop and default slot.
 */
defineRender(() => {
  const childNode = resolveChildren();
  return (
    <div
      class={className ?? rootClassName}
      style={{
        ...style,
        ...(visible === false ? { display: 'none' } : null),
      }}
    >
      <Upload {...upload} showUploadList={false} ref="upload">
        {childNode}
      </Upload>
    </div>
  );
});
</script>
