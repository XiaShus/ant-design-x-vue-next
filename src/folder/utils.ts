import type { FolderTreeData } from './interface';

export const isFolderNode = (node: FolderTreeData): boolean =>
  !!node.children && node.children.length > 0;

export function getNodeByPath(
  treeData: FolderTreeData[] | undefined,
  path: string[],
): FolderTreeData | undefined {
  if (!path || path.length === 0 || !treeData) return undefined;

  const findNode = (nodes: FolderTreeData[], index = 0): FolderTreeData | undefined => {
    if (index >= path.length) return undefined;
    const segment = path[index];
    for (const node of nodes) {
      if (node.path === segment) {
        return index === path.length - 1
          ? node
          : node.children
            ? findNode(node.children, index + 1)
            : undefined;
      }
    }
    return undefined;
  };

  return findNode(treeData);
}

export function walkTree(
  nodes: FolderTreeData[],
  path: string[],
  index: number,
  action: 'update' | 'delete' | 'add',
  data?: Partial<FolderTreeData> | FolderTreeData,
): FolderTreeData[] {
  const targetSegment = path[index];
  const isLast = index === path.length - 1;

  return nodes.map((node) => {
    if (node.path !== targetSegment) return node;

    if (isLast) {
      switch (action) {
        case 'update':
          return { ...node, ...data };
        case 'delete':
          return null as unknown as FolderTreeData;
        case 'add': {
          const newChild = data as FolderTreeData;
          const children = node.children ? [...node.children, newChild] : [newChild];
          return { ...node, children };
        }
        default:
          return node;
      }
    }

    if (node.children) {
      const newChildren = walkTree(node.children, path, index + 1, action, data);
      return { ...node, children: newChildren.filter(Boolean) as FolderTreeData[] };
    }
    return node;
  });
}

export function findNodeAndValidate(
  treeData: FolderTreeData[],
  path: string | string[],
  validateAsFile = false,
): { node: FolderTreeData | undefined; isValid: boolean } {
  if (!path) return { node: undefined, isValid: false };

  const segments = Array.isArray(path) ? path.filter(Boolean) : path.split('/').filter(Boolean);
  if (segments.length === 0) return { node: undefined, isValid: false };

  const node = getNodeByPath(treeData, segments);
  const isValid = validateAsFile
    ? !!node && (!node.children || node.children.length === 0)
    : !!node;
  return { node, isValid };
}
