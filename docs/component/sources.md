# Sources 引用来源

展示引用的数据来源地址。

## 何时使用

- 在联网搜索模式下展示引用的数据来源地址。

## 代码演示

### 基本

:::demo 基础用法。

sources/basic

:::

### 展开

:::demo 受控展开。

sources/expand

:::

## API

### SourcesProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题内容 | VNode \| string | - |
| items | 来源内容 | SourcesItem[] | - |
| expandIconPosition | 折叠图标位置 | `'start' \| 'end'` | `'start'` |
| defaultExpanded | 默认是否展开 | boolean | true |
| expanded | 是否展开 | boolean | - |
| onExpand | 展开事件 | `(expand: boolean) => void` | - |
| onClick | 点击事件 | `(item: SourcesItem) => void` | - |
| inline | 行内模式 | boolean | false |
| activeKey | 行内模式激活 key | string \| number | - |
| popoverOverlayWidth | 弹出层宽度 | number \| string | 300 |

```ts
interface SourcesItem {
  key?: string | number
  title: VNode | string
  url?: string
  icon?: VNode | string
  description?: VNode | string
}
```

## 贡献者

<doc-contributors component-name="sources" :max-count="50" :show-view-all="true" />
