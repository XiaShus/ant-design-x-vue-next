# FileCard 文件卡片

用卡片的形式展示文件。

## 何时使用

- 用于在对话或输入时展示文件。

## 代码演示

### 基本

:::demo 基础用法。

file-card/basic

:::

### 列表

:::demo 文件列表。

file-card/list

:::

## API

### FileCardProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 文件名称 | string | - | - |
| byte | 文件大小（字节） | number | - | - |
| size | 卡片大小 | `'small' \| 'default'` | `'default'` | - |
| description | 文件描述 | VNode \| string \| function | - | - |
| loading | 是否加载中 | boolean | false | - |
| type | 文件类型 | `'file' \| 'image' \| 'audio' \| 'video'` | - | - |
| src | 资源地址 | string | - | - |
| icon | 自定义图标；预设含 `java` / `javascript` / `python`（对齐 React） | VNode \| PresetIcons | - | 1.69.0（语言图标） |
| imageProps | 图片属性，同 ant-design-vue Image | ImageProps | - | - |
| videoProps | 视频属性（透传 `<video>`） | Record<string, any> | - | 1.85.0（文档） |
| audioProps | 音频属性（透传 `<audio>`） | Record<string, any> | - | 1.85.0（文档） |
| mask | 遮罩内容；函数可拿到 size/icon/name 等上下文。`type="image"` 请用 `imageProps.preview.mask` | VNode \| string \| ((info) => VNode \| string) | - | 1.85.0（文档） |
| spinProps | 图片加载中 Spin 配置；含 `showText` / `icon` / `percent`（`'auto'`） | FileCardSpinProps | - | 1.72.0；1.130.0（类型导出文档） |
| classNames | 语义化结构 className | Record<FileCardSemanticType, string> | - | 1.120.0（类型导出文档） |
| styles | 语义化结构 style | Record<FileCardSemanticType, CSSProperties> | - | 1.120.0（类型导出文档） |
| onClick | 点击回调 | `(info, event) => void` | - | - |

自 `1.130.0` 起可从包入口 `import type { FileCardSpinProps }`（对齐 React FileCard `spinProps` 扩展字段）。

```typescript | pure
type FileCardSpinProps = SpinProps & {
  showText?: boolean;
  icon?: VNode;
  percent?: number | 'auto';
  size?: SpinProps['size'] | 'middle' | 'medium';
};
```

自 `1.120.0` 起可从包入口 `import type { FileCardSemanticType }`（对齐 React FileCard `SemanticType` 键集）。

```typescript | pure
type FileCardSemanticType = 'root' | 'file' | 'icon' | 'name' | 'description';
```

#### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| file | 文件主体区域 |
| icon | 文件图标 |
| name | 文件名 |
| description | 描述 / 大小信息 |

### FileCard.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 文件列表；支持 `item.key` 作为列表项标识（对齐 React；Vue 中勿写在单卡 props） | (FileCardProps & \{ key?: string \| number \})[] | - | 1.76.0（`key`） |
| size | 卡片大小 | `'small' \| 'default'` | - | - |
| removable | 是否可移除 | boolean \| function | - | - |
| onRemove | 移除回调 | `(item) => void` | - | - |
| overflow | 超出样式 | `'scrollX' \| 'scrollY' \| 'wrap'` | - | - |
| extension | 列表扩展内容（如继续上传入口旁的自定义节点） | VNode \| string | - | 1.85.0（文档） |
| classNames | 语义化 class（`root`/`card` 为列表语义；亦可透传 `FileCardSemanticType` 键到单卡） | Partial<Record<FileCardListSemanticType \| FileCardSemanticType, string>> | - | 1.78.0（文档/单测）；1.120.0（类型导出文档） |
| styles | 语义化 style（同上） | Partial<Record<FileCardListSemanticType \| FileCardSemanticType, CSSProperties>> | - | 1.78.0（文档/单测）；1.120.0（类型导出文档） |

自 `1.120.0` 起可从包入口 `import type { FileCardListSemanticType }`。

```typescript | pure
type FileCardListSemanticType = 'root' | 'card';
```

## 贡献者

<doc-contributors component-name="file-card" :max-count="50" :show-view-all="true" />
