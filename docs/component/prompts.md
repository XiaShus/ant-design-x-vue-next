
# Prompts 提示集

用于显示一组与当前上下文相关的预定义的问题或建议。

## 何时使用

Prompts 组件用于显示一组与当前上下文相关的预定义的问题或建议。

## 代码演示

### 基本

<ClientOnly>

:::demo 基础用法。

prompts/basic

:::

</ClientOnly>

### 不可用状态

:::demo 要将 prompt 标记为禁用，请向 prompt 添加 `disabled` 属性。

prompts/disabled

:::

### 纵向展示

:::demo 使用 `vertical` 属性，控制 Prompts 展示方向。

prompts/flex-vertical

:::

### 可换行

:::demo 使用 `wrap` 属性，控制 Prompts 超出区域长度时是否可以换行。

prompts/flex-wrap

:::

### 响应式宽度

:::demo 配合 `wrap` 与 `styles` 固定宽度展示。

prompts/flex-wrap-fixed

:::

### 嵌套组合

<ClientOnly>

:::demo 嵌套组合。

prompts/nest

:::

</ClientOnly>

### 淡入动画

<ClientOnly>

:::demo `fadeIn` / `fadeInLeft` 挂载淡入；切换类型后点 Re-Render 可重播。

prompts/fade-in

:::

</ClientOnly>

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### PromptsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，用于各个提示项的不同部分 | Record<PromptsSemanticType, string> | - | 1.56.0 起含 `root`；1.111.0（类型导出文档） |
| items | 包含多个提示项的列表（类型亦导出为 `PromptsItemType`，对齐 React） | PromptProps[] | - | 1.79.0（类型导出） |
| prefixCls | 样式类名的前缀 | string | - | - |
| rootClassName | 根节点的样式类名 | string | - | - |
| styles | 自定义样式，用于各个提示项的不同部分 | Record<PromptsSemanticType, CSSProperties> | - | 1.56.0 起含 `root`；1.111.0（类型导出文档） |
| title | 显示在提示列表顶部的标题 | VNode \| string \| (() => VNode \| string) | - | - |
| vertical | 设置为 `true` 时, 提示列表将垂直排列 | boolean | `false` | - |
| wrap | 设置为 `true` 时, 提示列表将自动换行 | boolean | `false` | - |
| fadeIn | 挂载时淡入 | boolean | `false` | 1.34.0 |
| fadeInLeft | 挂载时从左淡入（与 `fadeIn` 同时设置时优先） | boolean | `false` | 1.34.0 |
| onItemClick | 提示项被点击时的回调函数 | (info: { data: PromptProps }) => void | - | - |

自 `1.144.0` 起可从包入口 `import type { PromptsProps, PromptsRef }`（对齐 React Prompts 包入口 Props / Ref 类型）。

### Prompts Ref

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 根节点 DOM（类型亦导出为 `PromptsRef`） | HTMLDivElement | 1.59.0；1.144.0（类型导出文档） |

#### PromptsSemanticType

自 `1.111.0` 起可从包入口 `import type { PromptsSemanticType }`（对齐 React prompts 模块 `SemanticType` 键集；Vue 使用带前缀导出名以免与其它组件冲突）。

```typescript | pure
type PromptsSemanticType =
  | 'root'
  | 'list'
  | 'item'
  | 'itemContent'
  | 'title'
  | 'subList'
  | 'subItem';
```

### Prompts Slots

| 插槽名 | 说明 |
| --- | --- |
| title | 显示在提示列表顶部的标题 |

### PromptProps

自 `1.79.0` 起可从包入口 `import type { PromptProps, PromptsItemType }`（`PromptsItemType` 为 React 同名别名）。

| 属性        | 说明                         | 类型            | 默认值  | 版本 |
| ----------- | ---------------------------- | --------------- | ------- | ---- |
| children    | 嵌套的子提示项               | PromptProps[]   | -       | -    |
| description | 提示描述提供额外的信息       | VNode \| string | -       | -    |
| disabled    | 设置为 `true` 时禁用点击事件 | boolean         | `false` | -    |
| icon        | 提示图标显示在提示项的左侧   | VNode | -       | -    |
| key         | 唯一标识用于区分每个提示项   | string          | -       | -    |
| label       | 提示标签显示提示的主要内容   | VNode \| string | -       | -    |

## Semantic DOM

<vp-semantic component="Prompts"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Prompts"></ComponentTokenTable> -->
## 贡献者

<doc-contributors component-name="prompts" :max-count="50" :show-view-all="true" />
