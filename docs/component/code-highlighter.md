# CodeHighlighter 代码高亮

用于高亮代码格式，对齐 [`@ant-design/x` CodeHighlighter](https://x.ant.design/components/code-highlighter-cn)。

## 何时使用

- 用于展示带语法高亮的代码片段，并提供复制功能及头部语言信息。
- 可与 Markdown / 对话气泡等内容组合，增强代码块展示与交互。

## 代码演示

### 基本

:::demo 基础用法，支持多种语言与 `prismLightMode` 轻量模式。

code-highlighter/basic

:::

### 自定义 Header

:::demo 通过 `header` 自定义头部内容。

code-highlighter/custom-header

:::

## API

### CodeHighlighterProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| lang | 代码语言类型 | `string` | - | - |
| children | 代码内容（也可通过默认插槽传入） | `string` | - | - |
| header | 头部内容；为 `false` / `null` 时不显示头部 | `VNode \| string \| (() => VNode \| string \| false \| null) \| false \| null` | - | - |
| highlightProps | 透传到 `pre` 的额外属性 | `object` | - | - |
| prismLightMode | 是否使用 Prism 轻量模式，按 `lang` 按需加载语言 | `boolean` | `true` | - |
| classNames | 语义化结构 className | Record<CodeHighlighterSemanticType, string> | - | 1.115.0（类型导出文档） |
| styles | 语义化结构 style | Record<CodeHighlighterSemanticType, CSSProperties> | - | 1.115.0（类型导出文档） |

自 `1.149.0` 起可从包入口 `import type { CodeHighlighterProps, CodeHighlighterRef }`（对齐 React CodeHighlighter 包入口 Props / Ref 类型）。

### CodeHighlighterRef

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 获取原生 DOM 节点（类型亦导出为 `CodeHighlighterRef`） | `HTMLDivElement \| null` | 1.149.0（类型导出文档） |

自 `1.115.0` 起可从包入口 `import type { CodeHighlighterSemanticType }`（对齐 React CodeHighlighter `SemanticType` 键集）。

```typescript | pure
type CodeHighlighterSemanticType = 'root' | 'header' | 'headerTitle' | 'code';
```

#### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| header | 头部区域 |
| headerTitle | 头部标题 / 语言信息 |
| code | 代码高亮区域 |

### CodeHighlighterSlots

| 插槽名 | 说明 |
| --- | --- |
| default | 代码内容 |
| header | 自定义头部 |

## 说明

- 底层使用 [`prismjs`](https://prismjs.com/) 做语法高亮（React 版为 `react-syntax-highlighter`）。
- 默认头部使用 `Typography.Text` 的 `copyable` 提供复制（React 版为 `Actions.Copy`）。
- `prismLightMode={false}` 会预加载一组常用语言，便于减少首次切换语言的等待。

## 贡献者

<doc-contributors component-name="code-highlighter" :max-count="50" :show-view-all="true" />
