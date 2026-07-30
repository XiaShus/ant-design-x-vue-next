# XMarkdown Markdown 渲染

流式友好的 Markdown 渲染组件，对齐 [`@ant-design/x-markdown`](https://www.npmjs.com/package/@ant-design/x-markdown) 的核心能力（当前内置于本包，非独立 npm 包）。

## 何时使用

- 渲染大模型输出的 Markdown 内容。
- 需要流式追加展示，并显示尾部光标。
- 代码块希望自动使用 `CodeHighlighter` / `Mermaid`。

## 代码演示

### 基本

:::demo 基础 Markdown 渲染，代码块默认走 CodeHighlighter。

x-markdown/basic

:::

### 流式输出

:::demo 通过 `streaming.hasNextChunk` 与 `tail` 模拟流式输出。

x-markdown/streaming

:::

## API

### XMarkdownProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | Markdown 内容 | `string` | - |
| children | Markdown 内容（content 别名 / 默认插槽） | `string` | - |
| components | 自定义标签组件映射 | `Record<string, Component>` | 默认 `code` → CodeHighlighter/Mermaid |
| streaming | 流式配置 | `{ hasNextChunk?: boolean; tail?: boolean \| { content?: string } }` | - |
| config | Marked.js 扩展配置 | `MarkedExtension` | - |
| openLinksInNewTab | 链接新标签打开 | `boolean` | `false` |
| dompurifyConfig | DOMPurify 配置 | `Config` | - |
| disableDefaultStyles | 关闭内置默认样式 | `boolean \| DefaultStyleTag[]` | - |

## 说明

- 解析引擎：[`marked`](https://github.com/markedjs/marked)（与官方一致）。
- 安全清洗：[`dompurify`](https://github.com/cure53/DOMPurify)。
- 当前为 **MVP**：已覆盖常用渲染、链接、代码块组件映射与流式尾标；尚未完整移植官方增量 token 缓存与 DebugPanel。后续会继续对齐。

## 贡献者

<doc-contributors component-name="x-markdown" :max-count="50" :show-view-all="true" />
