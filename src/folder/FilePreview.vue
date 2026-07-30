<script setup lang="tsx">
import { Empty, Spin, Typography } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, type VNode } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useLocale from '../locale/useLocale';
import { useXProviderContext } from '../x-provider';
import type { FolderProps, FolderSlots, FolderTreeData } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXFolderFilePreview' });

const props = withDefaults(
  defineProps<{
    prefixCls?: string;
    style?: FolderProps['style'];
    classNames?: FolderProps['classNames'];
    styles?: FolderProps['styles'];
    selectedFile?: string[] | null;
    previewRender?: FolderProps['previewRender'];
    fileContent?: string;
    loading?: boolean;
    previewTitle?: FolderProps['previewTitle'];
    getFileNode?: (
      path: string[],
    ) => { title: FolderTreeData['title']; path: string; content?: string } | undefined;
    emptyRender?: FolderProps['emptyRender'];
  }>(),
  {
    fileContent: '',
    loading: false,
    selectedFile: () => [],
  },
);

const slots = defineSlots<FolderSlots>();

const [locale] = useLocale('Folder');

const { getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('folder', props.prefixCls));
const contextConfig = useXComponentConfig('folder');
const [, hashId, cssVarCls] = useStyle(prefixCls);
const previewCls = computed(() => `${prefixCls.value}-preview`);

const getFileExtension = (path = '') => {
  const parts = path.split('.');
  return parts[parts.length - 1] || '';
};

const getLanguageFromExtension = (ext: string) => ext.toLowerCase() || 'txt';

const originContentNode = (content: string, language: string) => (
  <pre data-language={language}>
    <code>{content.replace(/\n$/, '')}</code>
  </pre>
);

defineRender(() => {
  const renderContent = () => {
    if (props.loading) {
      return (
        <div
          class={classnames(
            `${previewCls.value}-loading-container`,
            props.classNames?.previewRender,
          )}
        >
          <Spin />
        </div>
      );
    }

    if (!props.selectedFile || props.selectedFile.length === 0) {
      if (props.emptyRender === false || props.emptyRender === null) {
        return slots.empty ? (
          <div
            class={classnames(
              `${previewCls.value}-empty-container`,
              props.classNames?.previewRender,
            )}
          >
            {slots.empty()}
          </div>
        ) : null;
      }

      const emptyNode = slots.empty
        ? slots.empty()
        : typeof props.emptyRender === 'function'
          ? props.emptyRender()
          : props.emptyRender || (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={locale.value.selectFile} />
            );

      return (
        <div
          class={classnames(
            `${previewCls.value}-empty-container`,
            props.classNames?.previewRender,
          )}
        >
          {emptyNode}
        </div>
      );
    }

    const fileNode = props.getFileNode?.(props.selectedFile);
    const title = fileNode?.title || props.selectedFile[props.selectedFile.length - 1];
    const path = props.selectedFile;
    const fileName = props.selectedFile[props.selectedFile.length - 1];
    const language = getLanguageFromExtension(getFileExtension(fileName));
    const content = props.fileContent || '';

    let headerNode: any;
    if (props.previewTitle === false || props.previewTitle === null) {
      headerNode = null;
    } else if (slots.previewTitle) {
      headerNode = slots.previewTitle({ title, path, content });
    } else if (props.previewTitle) {
      headerNode =
        typeof props.previewTitle === 'function'
          ? props.previewTitle({ title, path, content })
          : props.previewTitle;
    } else {
      headerNode = (
        <div class={`${previewCls.value}-title`}>
          <span class={`${previewCls.value}-filename`}>{title}</span>
          <span class={`${previewCls.value}-copy`}>
            <Typography.Text copyable={{ text: content }} />
          </span>
        </div>
      );
    }

    const originNode = originContentNode(content, language) as VNode;
    let contentNode: any;
    if (slots.preview) {
      contentNode = slots.preview({
        content,
        path,
        title: fileNode?.title,
        language,
        originNode,
      });
    } else if (props.previewRender) {
      if (typeof props.previewRender === 'function') {
        contentNode = props.previewRender(
          {
            content,
            path,
            title: fileNode?.title,
            language,
          },
          { originNode },
        );
      } else {
        contentNode = props.previewRender;
      }
    } else {
      contentNode = originNode;
    }

    return (
      <>
        {headerNode ? (
          <div
            class={classnames(
              `${previewCls.value}-title-wrapper`,
              props.classNames?.previewTitle,
            )}
          >
            {headerNode}
          </div>
        ) : null}
        <div
          class={classnames(`${previewCls.value}-content`, props.classNames?.previewRender)}
        >
          {contentNode}
        </div>
      </>
    );
  };

  return (
    <div
      class={classnames(
        `${prefixCls.value}-preview`,
        props.classNames?.filePreview,
        hashId.value,
        cssVarCls,
      )}
      style={{
        ...contextConfig.value.styles?.filePreview,
        ...props.styles?.filePreview,
        ...props.style,
      }}
    >
      {renderContent()}
    </div>
  );
});
</script>
