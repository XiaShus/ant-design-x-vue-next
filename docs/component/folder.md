# Folder 文件夹

用于展示目录树与文件预览，对齐 [`@ant-design/x` Folder](https://x.ant.design/components/folder-cn)。

## 何时使用

- 需要在对话或工作区中浏览目录结构并预览文件内容时。

## 代码演示

### 基本

:::demo 基础目录树与文件预览。

folder/basic

:::

## API

### FolderProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeData | 目录数据 | `FolderTreeData[]` | - |
| selectable | 是否可选中文件 | boolean | `true` |
| selectedFile | 受控选中路径（路径片段数组） | `string[]` | - |
| defaultSelectedFile | 默认选中路径 | `string[]` | - |
| expandedPaths | 受控展开路径（完整 path key） | `string[]` | - |
| defaultExpandedPaths | 默认展开路径 | `string[]` | - |
| defaultExpandAll | 是否默认展开全部 | boolean | `true` |
| directoryTreeWith | 左侧目录宽度（保留 React 拼写） | `number \| string` | `278` |
| directoryIcons | 自定义图标，`false` 关闭图标 | `false \| Record<string, VNode>` | - |
| directoryTitle | 目录区标题，`false` 隐藏 | `false \| VNode \| string \| () => VNode` | - |
| previewTitle | 预览区标题，`false` 隐藏 | `false \| VNode \| function` | - |
| previewRender | 自定义预览内容 | `VNode \| function` | - |
| emptyRender | 空状态，`false` 隐藏 | `false \| VNode \| () => VNode` | - |
| fileContentService | 异步加载文件内容 | `{ loadFileContent(path): Promise<string> }` | - |
| contextMenu | 右键菜单 | `ItemType[] \| function` | - |
| onSelectedFileChange | 选中文件变化 | `(file) => void` | - |
| onExpandedPathsChange | 展开路径变化 | `(paths) => void` | - |
| onFileClick | 点击文件 | `(path, content?) => void` | - |
| onFolderClick | 点击文件夹 | `(path) => void` | - |
| onRightClick | 右键点击节点回调 | `(info: \{ event: MouseEvent; node: any \}) => void` | - |
| classNames | 语义化 className | Record<FolderSemanticType, string> | - | 1.86.0（文档/单测）；1.116.0（类型导出文档） |
| styles | 语义化 style | Record<FolderSemanticType, CSSProperties> | - | 1.86.0（文档/单测）；1.116.0（类型导出文档） |

自 `1.116.0` 起可从包入口 `import type { FolderSemanticType }`（对齐 React Folder `SemanticType` 键集）。

```typescript | pure
type FolderSemanticType =
  | 'root'
  | 'directoryTree'
  | 'directoryTitle'
  | 'filePreview'
  | 'previewTitle'
  | 'previewRender';
```

### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根容器 |
| directoryTree | 左侧目录树区域 |
| directoryTitle | 目录区标题 |
| filePreview | 右侧预览区域 |
| previewTitle | 预览区标题 |
| previewRender | 预览内容区 |

### FolderTreeData

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| title | 展示标题 | `VNode \| string` |
| path | 路径片段（非完整路径） | string |
| content | 文件内容 | string |
| children | 子节点；存在且长度 > 0 视为文件夹，空数组视为文件 | `FolderTreeData[]` |
| contextMenu | 节点级右键菜单，`false` 禁用 | `ItemType[] \| false \| function` |

### FolderRef

| 方法 | 说明 |
| --- | --- |
| nativeElement | 根 DOM |
| getNode(path) | 按路径获取节点 |
| updateNode(path, data) | 不可变更新，返回新 treeData |
| deleteNode(path) | 不可变删除 |
| addNode(parentPath, node) | 不可变新增子节点 |

## 贡献者

<doc-contributors component-name="folder" :max-count="50" :show-view-all="true" />
