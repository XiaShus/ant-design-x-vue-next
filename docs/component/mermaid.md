# Mermaid 图表工具

用于渲染交互式 Mermaid 图表，对齐 [`@ant-design/x` Mermaid](https://x.ant.design/components/mermaid-cn)。

## 何时使用

- 需要在应用中渲染支持缩放、平移、图片/代码双视图切换的交互式 Mermaid 图表。
- 可与 Markdown / 对话内容组合展示模型输出的流程图、时序图等。

## 代码演示

### 基本

:::demo 基础用法。

mermaid/basic

:::

### 自定义 Header

:::demo 通过 `header` 自定义顶部内容。

mermaid/custom-header

:::

### Header Actions

:::demo 配置缩放、下载、复制与自定义操作。

mermaid/header-actions

:::

## API

### MermaidProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 图表代码内容（也可通过默认插槽传入） | `string` | - | - |
| header | 顶部内容；为 `null` 时不显示头部 | `VNode \| string \| (() => VNode \| string \| null) \| null` | - | - |
| highlightProps | 透传给代码视图中 `CodeHighlighter` 的配置 | `object` | - | - |
| config | Mermaid 配置项 | MermaidConfig | - | 1.110.0（类型重导出） |
| actions | 操作栏配置 | `{ enableZoom?: boolean; enableDownload?: boolean; enableCopy?: boolean; customActions?: ActionItem[] }` | `{ enableZoom: true, enableDownload: true, enableCopy: true }` | - |
| onRenderTypeChange | 渲染类型切换回调 | `(value: 'image' \| 'code') => void` | - | - |
| classNames | 语义化结构 className（键类型亦导出为 `MermaidType`，对齐 React） | Record<'root' \| 'header' \| 'graph' \| 'code', string> | - | 1.89.0（`MermaidType` 导出） |
| styles | 语义化结构 style | Record<'root' \| 'header' \| 'graph' \| 'code', CSSProperties> | - | - |

自 `1.110.0` 起可从包入口 `import type { MermaidConfig }`（重导出自 `mermaid`，无需再从 `mermaid` 单独 import 类型）。

### MermaidSlots

| 插槽名 | 说明 |
| --- | --- |
| default | 图表代码内容 |
| header | 自定义头部 |

## FAQ

### 使用 `config` 时如何避免重复初始化？

请保证 `config` 引用稳定，避免在模板中直接写对象字面量。推荐用 `computed` / 常量缓存：

```ts
const config = computed(() => ({
  theme: isDark.value ? 'dark' : 'base',
  fontFamily: 'monospace',
}));
```

## 贡献者

<doc-contributors component-name="mermaid" :max-count="50" :show-view-all="true" />
