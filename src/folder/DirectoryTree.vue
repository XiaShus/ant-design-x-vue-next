<script setup lang="tsx">
import { FileOutlined, FolderOutlined } from '@ant-design/icons-vue';
import { Dropdown, Tree } from 'ant-design-vue';
import type { ItemType } from 'ant-design-vue/es/menu';
import classnames from 'classnames';
import { computed, ref, type VNode } from 'vue';
import { useXProviderContext } from '../x-provider';
import type { FolderProps, FolderTreeData } from './interface';
import { isFolderNode } from './utils';

defineOptions({ name: 'AXFolderDirectoryTree' });

const props = withDefaults(
  defineProps<{
    treeData: FolderTreeData[];
    directoryIcons?: FolderProps['directoryIcons'];
    selectedKeys?: string[];
    expandedKeys?: string[];
    onSelect?: (keys: string[], info: any) => void;
    onExpand?: (keys: string[]) => void;
    showLine?: boolean;
    defaultExpandAll?: boolean;
    className?: string;
    classNames?: FolderProps['classNames'];
    styles?: FolderProps['styles'];
    style?: FolderProps['style'];
    directoryTitle?: FolderProps['directoryTitle'];
    prefixCls?: string;
    contextMenu?: FolderProps['contextMenu'];
    onRightClick?: FolderProps['onRightClick'];
  }>(),
  {
    showLine: false,
    defaultExpandAll: true,
    selectedKeys: () => [],
  },
);

const emit = defineEmits<{
  select: [keys: string[], info: any];
  expand: [keys: string[]];
  rightClick: [info: { event: MouseEvent; node: any }];
}>();

const { getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('folder', props.prefixCls));

const contextMenuOpen = ref(false);
const contextMenuItems = ref<ItemType[] | undefined>(undefined);
const nodeDataMap = ref(new Map<string, FolderTreeData>());
const isRightClick = ref(false);

const resolveIcon = (value: unknown): VNode | null => {
  if (typeof value === 'function') return (value as () => VNode)();
  return (value as VNode) || null;
};

const getIcon = (node: FolderTreeData) => {
  if (props.directoryIcons === false || props.directoryIcons == null) {
    return null;
  }
  if (isFolderNode(node)) {
    const icon = props.directoryIcons?.directory;
    return resolveIcon(icon) || <FolderOutlined />;
  }
  const filePath = node.path.toLowerCase();
  const extension = filePath.split('.').pop();
  if (extension) {
    const icon = props.directoryIcons?.[extension];
    if (icon) return resolveIcon(icon);
  }
  return <FileOutlined />;
};

const buildPathSegments = (node: FolderTreeData, parentSegments: string[] = []): string[] => {
  if (node.path === '/' && parentSegments.length === 0) {
    return ['/'];
  }
  return [...parentSegments, node.path].filter((segment) => segment !== '');
};

const convertToTreeData = (nodes: FolderTreeData[], parentSegments: string[] = []): any[] => {
  return nodes.map((node) => {
    const pathSegments = buildPathSegments(node, parentSegments);
    const fullPath = pathSegments.join('/').replace(/^\/+/, '');
    nodeDataMap.value.set(fullPath, node);
    return {
      ...node,
      key: fullPath,
      path: fullPath,
      pathSegments,
      title: node.title,
      icon: getIcon(node),
      isLeaf: !isFolderNode(node),
      children: node.children ? convertToTreeData(node.children, pathSegments) : undefined,
    };
  });
};

const treeDataConverted = computed(() => {
  nodeDataMap.value = new Map();
  return convertToTreeData(props.treeData || []);
});

const titleNode = computed(() => {
  if (props.directoryTitle === false || props.directoryTitle == null) return null;
  if (typeof props.directoryTitle === 'function') return props.directoryTitle();
  return props.directoryTitle;
});

const handleRightClick = (info: { event: MouseEvent; node: any }) => {
  const nodeKey = String(info.node.key);
  const originalNode = nodeDataMap.value.get(nodeKey);
  isRightClick.value = true;

  let items: ItemType[] | undefined;
  if (originalNode?.contextMenu === false) {
    items = undefined;
  } else if (originalNode?.contextMenu) {
    items =
      typeof originalNode.contextMenu === 'function'
        ? originalNode.contextMenu(nodeKey)
        : originalNode.contextMenu;
  } else if (props.contextMenu) {
    items =
      typeof props.contextMenu === 'function'
        ? props.contextMenu(originalNode || ({} as FolderTreeData), nodeKey)
        : props.contextMenu;
  }

  if (items && items.length > 0) {
    contextMenuItems.value = items;
    contextMenuOpen.value = true;
  } else {
    isRightClick.value = false;
  }

  props.onRightClick?.(info);
  emit('rightClick', info);
};

const handleSelect = (keys: (string | number)[], info: any) => {
  if (isRightClick.value) {
    isRightClick.value = false;
    return;
  }
  const stringKeys = keys.map(String);
  props.onSelect?.(stringKeys, info);
  emit('select', stringKeys, info);
};

const handleExpand = (keys: (string | number)[]) => {
  const stringKeys = keys.map(String);
  props.onExpand?.(stringKeys);
  emit('expand', stringKeys);
};

const handleContextMenuOpenChange = (open: boolean) => {
  if (open && !isRightClick.value) return;
  contextMenuOpen.value = open;
  if (!open) isRightClick.value = false;
};

defineRender(() => {
  return (
    <>
      {titleNode.value ? (
        <div
          style={{ ...props.styles?.directoryTitle, ...props.style }}
          class={classnames(
            `${prefixCls.value}-directory-tree-title`,
            props.className,
            props.classNames?.directoryTitle,
          )}
        >
          {titleNode.value}
        </div>
      ) : null}
      <Dropdown
        menu={{ items: contextMenuItems.value || [] }}
        open={contextMenuOpen.value}
        onOpenChange={handleContextMenuOpenChange}
        trigger={['contextMenu']}
      >
        <div style={{ height: '100%' }}>
          <Tree.DirectoryTree
            treeData={treeDataConverted.value}
            selectedKeys={props.selectedKeys}
            expandedKeys={props.expandedKeys}
            onSelect={handleSelect}
            onExpand={handleExpand}
            onRightClick={handleRightClick}
            multiple={false}
            blockNode
            showIcon={props.directoryIcons !== false}
            showLine={props.showLine}
            defaultExpandAll={props.defaultExpandAll}
            class={classnames(`${prefixCls.value}-directory-tree-content`)}
          />
        </div>
      </Dropdown>
    </>
  );
});
</script>
