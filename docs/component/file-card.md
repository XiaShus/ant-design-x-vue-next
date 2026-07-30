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
| icon | 自定义图标 | VNode \| PresetIcons | - |
| onClick | 点击回调 | `(info, event) => void` | - |

### FileCard.List

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 文件列表 | FileCardProps[] | - |
| size | 卡片大小 | `'small' \| 'default'` | - |
| removable | 是否可移除 | boolean \| function | - |
| onRemove | 移除回调 | `(item) => void` | - |
| overflow | 超出样式 | `'scrollX' \| 'scrollY' \| 'wrap'` | - |

## 贡献者

<doc-contributors component-name="file-card" :max-count="50" :show-view-all="true" />
