import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { ItemType } from 'ant-design-vue/es/menu';
import type { AvoidValidation } from '../type-utility';

export type FolderSemanticType =
  | 'root'
  | 'directoryTree'
  | 'directoryTitle'
  | 'filePreview'
  | 'previewTitle'
  | 'previewRender';

export interface FolderTreeData {
  title: AvoidValidation<VNode | string>;
  path: string;
  content?: string;
  children?: FolderTreeData[];
  /** Right-click menu; `false` disables for this node */
  contextMenu?: ItemType[] | false | ((key: string) => ItemType[] | undefined);
}

export interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}

export interface FolderProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'title' | 'onClick'> {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<FolderSemanticType, string>>;
  styles?: Partial<Record<FolderSemanticType, CSSProperties>>;
  directoryIcons?: false | Record<'directory' | string, AvoidValidation<VNode | (() => VNode)>>;
  treeData: FolderTreeData[];
  selectable?: boolean;
  selectedFile?: string[];
  defaultSelectedFile?: string[];
  onSelectedFileChange?: (file: {
    path: string[];
    title?: FolderTreeData['title'];
    content?: string;
  }) => void;
  /** Typo kept for API parity with @ant-design/x */
  directoryTreeWith?: number | string;
  emptyRender?: false | AvoidValidation<VNode | (() => VNode)>;
  previewRender?:
    | AvoidValidation<VNode>
    | ((
        file: {
          content?: string;
          path: string[];
          title?: FolderTreeData['title'];
          language: string;
        },
        info: { originNode: VNode },
      ) => VNode);
  defaultExpandedPaths?: string[];
  expandedPaths?: string[];
  defaultExpandAll?: boolean;
  onExpandedPathsChange?: (paths: string[]) => void;
  fileContentService?: FileContentService;
  onFileClick?: (filePath: string, content?: string) => void;
  onFolderClick?: (folderPath: string) => void;
  directoryTitle?: false | AvoidValidation<VNode | string | (() => VNode | string)>;
  previewTitle?:
    | false
    | AvoidValidation<VNode | string>
    | ((args: {
        title: FolderTreeData['title'];
        path: string[];
        content: string;
      }) => VNode | string);
  contextMenu?: ItemType[] | ((node: FolderTreeData, key: string) => ItemType[] | undefined);
  onRightClick?: (info: { event: MouseEvent; node: any }) => void;
}

export type FolderRef = {
  nativeElement: HTMLDivElement | null;
  getNode: (path: string[]) => FolderTreeData | undefined;
  updateNode: (path: string[], data: Partial<FolderTreeData>) => FolderTreeData[];
  deleteNode: (path: string[]) => FolderTreeData[];
  addNode: (parentPath: string[], node: FolderTreeData) => FolderTreeData[];
};

export type FolderSlots = {
  directoryTitle?(): any;
  previewTitle?(props: {
    title: FolderTreeData['title'];
    path: string[];
    content: string;
  }): any;
  empty?(): any;
  preview?(props: {
    content?: string;
    path: string[];
    title?: FolderTreeData['title'];
    language: string;
    originNode: any;
  }): any;
};
