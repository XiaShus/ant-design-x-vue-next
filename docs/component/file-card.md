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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 文件名称 | string | - |
| byte | 文件大小（字节） | number | - |
| size | 卡片大小 | `'small' \| 'default'` | `'default'` |
| description | 文件描述 | VNode \| string \| function | - |
| loading | 是否加载中 | boolean | false |
| type | 文件类型 | `'file' \| 'image' \| 'audio' \| 'video'` | - |
| src | 资源地址 | string | - |
| icon | 自定义图标；预设含 `java` / `javascript` / `python`（对齐 React） | VNode \| PresetIcons | - | 1.69.0（语言图标） |
| imageProps | 图片属性，同 ant-design-vue Image | ImageProps | - | - |
| videoProps | 视频属性（透传 `<video>`） | Record<string, any> | - | 1.85.0（文档） |
| audioProps | 音频属性（透传 `<audio>`） | Record<string, any> | - | 1.85.0（文档） |
| mask | 遮罩内容；函数可拿到 size/icon/name 等上下文。`type="image"` 请用 `imageProps.preview.mask` | VNode \| string \| ((info) => VNode \| string) | - | 1.85.0（文档） |
| spinProps | 图片加载中 Spin 配置；含 `showText` / `icon` / `percent`（`'auto'`） | SpinProps & \{ showText?: boolean; icon?: VNode; percent?: number \| 'auto' \} | - | 1.72.0 |
| onClick | 点击回调 | `(info, event) => void` | - |

### FileCard.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 文件列表；支持 `item.key` 作为列表项标识（对齐 React；Vue 中勿写在单卡 props） | (FileCardProps & \{ key?: string \| number \})[] | - | 1.76.0（`key`） |
| size | 卡片大小 | `'small' \| 'default'` | - | - |
| removable | 是否可移除 | boolean \| function | - | - |
| onRemove | 移除回调 | `(item) => void` | - | - |
| overflow | 超出样式 | `'scrollX' \| 'scrollY' \| 'wrap'` | - | - |
| extension | 列表扩展内容（如继续上传入口旁的自定义节点） | VNode \| string | - | 1.85.0（文档） |
| classNames | 语义化 class（`root` 列表根；`card` 透传到每张 FileCard；其余透传 FileCard 语义） | Record<'root' \| 'card' \| …, string> | - | 1.78.0（文档/单测） |
| styles | 语义化 style（同上） | Record<'root' \| 'card' \| …, CSSProperties> | - | 1.78.0（文档/单测） |

## 贡献者

<doc-contributors component-name="file-card" :max-count="50" :show-view-all="true" />
