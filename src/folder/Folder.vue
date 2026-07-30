<script setup lang="tsx">
import classnames from 'classnames';
import { computed, ref, watch, type VNode } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import DirectoryTree from './DirectoryTree.vue';
import FilePreview from './FilePreview.vue';
import type { FolderProps, FolderRef, FolderSlots, FolderTreeData } from './interface';
import useStyle from './style';
import { findNodeAndValidate, getNodeByPath, walkTree } from './utils';

defineOptions({ name: 'AXFolder' });

const props = withDefaults(defineProps<FolderProps>(), {
  selectable: true,
  defaultExpandAll: true,
  directoryTreeWith: 278,
  // Keep undefined so controlled mode is distinguishable
  selectedFile: undefined,
  expandedPaths: undefined,
  styles: () => ({}),
  classNames: () => ({}),
});

const slots = defineSlots<FolderSlots>();

const emit = defineEmits<{
  selectedFileChange: [
    file: { path: string[]; title?: FolderTreeData['title']; content?: string },
  ];
  'update:selectedFile': [path: string[]];
  expandedPathsChange: [paths: string[]];
  'update:expandedPaths': [paths: string[]];
  fileClick: [filePath: string, content?: string];
  folderClick: [folderPath: string];
  rightClick: [info: { event: MouseEvent; node: any }];
}>();

const locale = {
  selectFile: '请选择一个文件',
  loadError: '文件加载失败',
  noService: '未配置文件内容服务',
};

const containerRef = ref<HTMLDivElement | null>(null);

const isValidSelectedFile = (filePath?: string[]): boolean =>
  !!(filePath && filePath.length > 0 && findNodeAndValidate(props.treeData || [], filePath, true).isValid);

const validSelectedFile = ref(isValidSelectedFile(props.selectedFile || props.defaultSelectedFile));

const selectedFileState = ref<string[]>(
  isValidSelectedFile(props.defaultSelectedFile) ? [...(props.defaultSelectedFile || [])] : [],
);

const expandedPathsState = ref<string[] | undefined>(
  props.expandedPaths !== undefined
    ? props.expandedPaths
    : props.defaultExpandedPaths
      ? [...props.defaultExpandedPaths]
      : undefined,
);

watch(
  () => props.selectedFile,
  (val) => {
    if (val !== undefined) {
      selectedFileState.value = [...val];
      validSelectedFile.value = isValidSelectedFile(val);
    }
  },
  { deep: true },
);

watch(
  () => [props.treeData, props.defaultSelectedFile] as const,
  () => {
    const candidate = props.selectedFile ?? props.defaultSelectedFile;
    validSelectedFile.value = isValidSelectedFile(candidate);
  },
  { deep: true },
);

watch(
  () => props.expandedPaths,
  (val) => {
    if (val !== undefined) {
      expandedPathsState.value = [...val];
    }
  },
  { deep: true },
);

const fileContent = ref('');
const loadingContent = ref(false);

const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('folder', props.prefixCls));
const contextConfig = useXComponentConfig('folder');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    props.className,
    props.class,
    props.rootClassName,
    props.classNames?.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction?.value === 'rtl',
      [`${prefixCls.value}-selectable`]: props.selectable,
    },
  ),
);

const mergedStyle = computed(() => ({
  ...contextConfig.value.style,
  ...props.styles?.root,
  ...props.style,
}));

const directoryWidth = computed(() => {
  const w = props.directoryTreeWith ?? 278;
  return typeof w === 'number' ? `${w}px` : w;
});

watch(
  () =>
    [
      validSelectedFile.value,
      selectedFileState.value,
      props.treeData,
      props.fileContentService,
    ] as const,
  async () => {
    if (!validSelectedFile.value || selectedFileState.value.length === 0) {
      fileContent.value = '';
      loadingContent.value = false;
      return;
    }

    const filePath = selectedFileState.value.join('/');
    const { node } = findNodeAndValidate(props.treeData || [], selectedFileState.value);

    if (props.fileContentService) {
      loadingContent.value = true;
      try {
        fileContent.value = await props.fileContentService.loadFileContent(filePath);
      } catch (error) {
        fileContent.value = `// ${locale.loadError}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
      } finally {
        loadingContent.value = false;
      }
    } else if (node?.content) {
      fileContent.value = node.content;
      loadingContent.value = false;
    } else {
      fileContent.value = `// ${locale.noService}`;
      loadingContent.value = false;
    }
  },
  { immediate: true, deep: true },
);

const handleSelect = (keys: string[], info: any) => {
  const nodes = Array.isArray(info.selectedNodes)
    ? info.selectedNodes
    : info.selectedNodes
      ? [info.selectedNodes]
      : info.node
        ? [info.node]
        : [];

  const isFolder = nodes.some((node: any) => !node.isLeaf);
  if (isFolder) {
    if (nodes.length === 1) {
      const node = nodes[0];
      props.onFolderClick?.(node.path);
      emit('folderClick', node.path);
    }
    return;
  }

  const pathArray = keys[0]?.split('/').filter(Boolean) || [];
  if (pathArray.length === 0) return;

  const selectedNode = nodes[0] as FolderTreeData | undefined;
  const payload = {
    path: pathArray,
    title: selectedNode?.title,
    content: selectedNode?.content,
  };

  props.onSelectedFileChange?.(payload);
  emit('selectedFileChange', payload);
  emit('update:selectedFile', pathArray);

  if (props.selectedFile === undefined) {
    validSelectedFile.value = true;
    selectedFileState.value = pathArray;
  }

  if (nodes.length === 1) {
    const node = nodes[0];
    props.onFileClick?.(node.path, node.content);
    emit('fileClick', node.path, node.content);
  }
};

const handleExpand = (keys: string[]) => {
  if (props.expandedPaths === undefined) {
    expandedPathsState.value = keys;
  }
  props.onExpandedPathsChange?.(keys);
  emit('expandedPathsChange', keys);
  emit('update:expandedPaths', keys);
};

const handleRightClick = (info: { event: MouseEvent; node: any }) => {
  props.onRightClick?.(info);
  emit('rightClick', info);
};

defineExpose<FolderRef>({
  get nativeElement() {
    return containerRef.value;
  },
  getNode: (path: string[]) => getNodeByPath(props.treeData, path),
  updateNode: (path: string[], data: Partial<FolderTreeData>) =>
    props.treeData ? walkTree(props.treeData, path, 0, 'update', data) : [],
  deleteNode: (path: string[]) =>
    props.treeData
      ? (walkTree(props.treeData, path, 0, 'delete').filter(Boolean) as FolderTreeData[])
      : [],
  addNode: (parentPath: string[], node: FolderTreeData) =>
    props.treeData ? walkTree(props.treeData, parentPath, 0, 'add', node) : [],
});

defineRender(() => {
  return wrapCSSVar(
    <div ref={containerRef} class={mergedCls.value} style={mergedStyle.value}>
      <div class={`${prefixCls.value}-container`}>
        <div
          class={classnames(
            `${prefixCls.value}-directory-tree`,
            props.classNames?.directoryTree,
          )}
          style={{
            width: directoryWidth.value,
            ...contextConfig.value.styles?.directoryTree,
            ...props.styles?.directoryTree,
          }}
        >
          <DirectoryTree
            directoryIcons={props.directoryIcons}
            prefixCls={props.prefixCls}
            treeData={props.treeData}
            selectedKeys={
              props.selectable && selectedFileState.value && validSelectedFile.value
                ? [selectedFileState.value.join('/')]
                : []
            }
            classNames={props.classNames}
            styles={props.styles}
            expandedKeys={expandedPathsState.value}
            onSelect={handleSelect}
            onExpand={handleExpand}
            defaultExpandAll={props.defaultExpandAll}
            directoryTitle={
              slots.directoryTitle
                ? () => slots.directoryTitle!() as VNode
                : props.directoryTitle
            }
            contextMenu={props.contextMenu}
            onRightClick={handleRightClick}
          />
        </div>
        <FilePreview
          emptyRender={props.emptyRender}
          prefixCls={props.prefixCls}
          classNames={props.classNames}
          styles={props.styles}
          selectedFile={validSelectedFile.value ? selectedFileState.value : []}
          fileContent={fileContent.value}
          loading={loadingContent.value}
          previewTitle={props.previewTitle}
          previewRender={props.previewRender}
          getFileNode={(path) => {
            if (!path || path.length === 0) return undefined;
            const { node } = findNodeAndValidate(props.treeData || [], path);
            return node
              ? { title: node.title, path: node.path, content: node.content }
              : undefined;
          }}
          v-slots={{
            empty: slots.empty,
            previewTitle: slots.previewTitle,
            preview: slots.preview,
          }}
        />
      </div>
    </div>,
  );
});
</script>
