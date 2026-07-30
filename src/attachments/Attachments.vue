<script setup lang="tsx">
import classnames from 'classnames';
import { computed, useTemplateRef, type VNode, watch } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import type {
  Attachment,
  AttachmentsProps,
  AttachmentsRef,
  AttachmentsSelectOptions,
  PlaceholderProps,
} from './interface';
import PlaceholderUploader from './PlaceholderUploader.vue';
import type { UploadProps } from 'ant-design-vue';
import DropArea from './DropArea.vue';
import SilentUploader from './SilentUploader.vue';
import { FileList } from './FileList';
import useStyle from './style';
import useState from '../_util/hooks/use-state';
import AttachmentContextProvider from './context';

defineOptions({ name: 'AXAttachments' });

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  rootStyle,
  className,
  style,
  items = [],
  children,
  getDropContainer,
  placeholder,
  onChange,
  onRemove,
  overflow,
  imageProps,
  disabled,
  classNames = {},
  styles = {},
  accept,
  maxCount,
  ...uploadProps
} = defineProps<AttachmentsProps>();

const slots = defineSlots<{
  default?(): VNode | VNode[] | string;
  placeholder?(props?: { type: 'inline' | 'drop' }): VNode | string;
  /** Custom FileList upload trigger (plus button area). */
  upload?(): VNode | VNode[] | string;
}>();

// ============================ PrefixCls ============================
const { getPrefixCls, direction } = useXProviderContext();

const prefixCls = getPrefixCls('attachment', customizePrefixCls);

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('attachments');

const contextClassNames = computed(() => contextConfig.value.classNames);
const contextStyles = computed(() => contextConfig.value.styles);

// ============================= Ref =============================
const containerRef = useTemplateRef<HTMLDivElement>('attachments-container');
const placeholderUploaderRef = useTemplateRef<InstanceType<typeof PlaceholderUploader>>(
  'placeholder-uploader',
);
const silentUploaderRef = useTemplateRef<InstanceType<typeof SilentUploader>>('attachments-upload');

const unwrapNative = (value: unknown): HTMLElement | null => {
  if (!value) return null;
  // Child components may expose a computed ref for nativeElement.
  if (typeof value === 'object' && value !== null && 'value' in (value as object)) {
    return ((value as { value: HTMLElement | null }).value ?? null) as HTMLElement | null;
  }
  return value as HTMLElement;
};

const getUploadRoot = (): HTMLElement | null =>
  unwrapNative(silentUploaderRef.value?.nativeElement) ??
  unwrapNative(placeholderUploaderRef.value?.nativeElement);

const getFileInput = (): HTMLInputElement | null =>
  (getUploadRoot()?.querySelector?.('input[type="file"]') as HTMLInputElement | null) ?? null;

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const cssinjsCls = computed(() => classnames(hashId.value, cssVarCls));

// ============================ Upload ============================
const [fileList, setFileList] = useState(items);
watch(() => items, () => {
  setFileList(items);
});

const triggerChange: AttachmentsProps['onChange'] = (info) => {
  setFileList(info.fileList);
  onChange?.(info);
};

const mergedUploadProps = computed<UploadProps>(() => ({
  ...uploadProps,
  accept,
  maxCount,
  fileList: fileList.value,
  onChange: triggerChange,
}));

const onItemRemove = (item: Attachment) =>
  Promise.resolve(typeof onRemove === 'function' ? onRemove(item) : onRemove).then((ret) => {
    // Prevent removing file
    if (ret === false) {
      return;
    }

    const newFileList = fileList.value.filter((fileItem) => fileItem.uid !== item.uid);
    triggerChange({
      file: { ...item, status: 'removed' },
      fileList: newFileList,
    });
  });

const getPlaceholderNode = (
  type: 'inline' | 'drop',
  props?: Pick<PlaceholderProps, 'style'>,
) => {
  const placeholderContent = slots.placeholder
    ? slots.placeholder({ type })
    : typeof placeholder === 'function'
      ? placeholder(type)
      : placeholder;

  return (
    <PlaceholderUploader
      placeholder={placeholderContent}
      upload={mergedUploadProps.value}
      prefixCls={prefixCls}
      className={classnames(contextClassNames.value.placeholder, classNames.placeholder)}
      style={{
        ...contextStyles.value.placeholder,
        ...styles.placeholder,
        ...props?.style,
      }}
      ref={type === 'inline' ? 'placeholder-uploader' : undefined}
    />
  );
};

const hasFileList = computed(() => fileList.value.length > 0);

const resolveChildren = (): VNode | null => {
  if (children) return children;
  const nodes = slots.default?.();
  if (!nodes) return null;
  const list = Array.isArray(nodes) ? nodes : [nodes];
  if (!list.length) return null;
  if (list.length === 1) return list[0] as VNode;
  return (<>{list}</>) as unknown as VNode;
};

const resolveUploadNode = (): VNode | undefined => {
  const nodes = slots.upload?.();
  if (!nodes) return undefined;
  const list = Array.isArray(nodes) ? nodes : [nodes];
  if (!list.length) return undefined;
  if (list.length === 1) return list[0] as VNode;
  return (<>{list}</>) as unknown as VNode;
};

defineExpose<AttachmentsRef>({
  get nativeElement() {
    return containerRef.value ?? null;
  },
  get fileNativeElement() {
    return getFileInput();
  },
  upload: (file) => {
    const fileInput = getFileInput();
    if (!fileInput) return;

    const dataTransfer = new DataTransfer();
    try {
      // If length exists, it's a File array or FileList — handle together.
      if ('length' in file && file.length >= 1) {
        for (let i = 0; i < file.length; i++) {
          dataTransfer.items.add(file[i]);
        }
      } else {
        // Single File
        dataTransfer.items.add(file as File);
      }
      fileInput.files = dataTransfer.files;
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {
      console.error('upload failed', err);
    }
  },
  select: (options?: AttachmentsSelectOptions) => {
    const fileInput = getFileInput();
    if (!fileInput) return;
    fileInput.multiple = options?.multiple ?? false;
    const acceptValue = options?.accept ?? accept;
    fileInput.accept = typeof acceptValue === 'string' ? acceptValue : '';
    fileInput.click();
  },
});

defineRender(() => {
  const childrenNode = resolveChildren();
  const uploadNode = resolveUploadNode();

  return wrapCSSVar(
    <AttachmentContextProvider
      value={{
        disabled,
      }}
    >
      {childrenNode ? (
        <>
          <SilentUploader
            upload={mergedUploadProps.value}
            rootClassName={rootClassName}
            ref="attachments-upload"
            children={childrenNode}
          />
          <DropArea
            getDropContainer={getDropContainer}
            prefixCls={prefixCls}
            className={classnames(cssinjsCls.value, rootClassName)}
            children={getPlaceholderNode('drop')}
          />
        </>
      ) : (
        <div
          class={classnames(
            prefixCls,
            cssinjsCls.value,
            {
              [`${prefixCls}-rtl`]: direction.value === 'rtl',
            },
            className,
            rootClassName,
          )}
          style={{
            ...rootStyle,
            ...style,
          }}
          dir={direction.value || 'ltr'}
          ref="attachments-container"
        >
          <FileList
            prefixCls={prefixCls}
            items={fileList.value}
            onRemove={onItemRemove}
            overflow={overflow}
            upload={mergedUploadProps.value}
            uploadNode={uploadNode}
            listClassName={classnames(contextClassNames.value.list, classNames.list)}
            listStyle={{
              ...contextStyles.value.list,
              ...styles.list,
              ...(!hasFileList.value && { display: 'none' }),
            }}
            uploadClassName={classnames(contextClassNames.value.upload, classNames.upload)}
            uploadStyle={{ ...contextStyles.value.upload, ...styles.upload }}
            itemClassName={classnames(contextClassNames.value.item, classNames.item)}
            itemStyle={{
              ...contextStyles.value.item,
              ...styles.item,
            }}
            imageProps={imageProps}
          />
          {getPlaceholderNode('inline', hasFileList.value ? { style: { display: 'none' } } : {})}
          <DropArea
            getDropContainer={getDropContainer || (() => containerRef.value)}
            prefixCls={prefixCls}
            className={cssinjsCls.value}
            children={getPlaceholderNode('drop')}
          />
        </div>
      )}
    </AttachmentContextProvider>,
  );
});
</script>
