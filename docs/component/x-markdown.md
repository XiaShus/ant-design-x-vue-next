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

### 数学公式（LaTeX）

:::demo 通过 `Latex()` 插件渲染 KaTeX 公式（`$...$` / `$$...$$`）。

x-markdown/latex

:::

### 性能调试

:::demo 设置 `debug` 显示 FPS / Memory 浮层，支持录制与图表回看。

x-markdown/debug

:::

## API

### XMarkdownProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | Markdown 内容 | `string` | - |
| children | Markdown 内容（content 别名 / 默认插槽） | `string` | - |
| components | 自定义标签组件映射 | `Record<string, Component>` | 默认 `code` → CodeHighlighter/Mermaid |
| streaming | 流式配置（`hasNextChunk` 增量缓存；`enableAnimation` 淡入） | `{ hasNextChunk?; tail?; enableAnimation?; animationConfig?; incompleteMarkdownComponentMap? }` | - |
| config | Marked.js 扩展配置 | `MarkedExtension` | - |
| openLinksInNewTab | 链接新标签打开 | `boolean` | `false` |
| escapeRawHtml | 转义 Markdown 中的原始 HTML（**不信任模型输出时请开启**） | `boolean` | `false` |
| dompurifyConfig | DOMPurify 配置 | `Config` | - |
| disableDefaultStyles | 关闭内置默认样式 | `boolean \| DefaultStyleTag[]` | - |
| debug | 显示性能调试浮层（FPS / Memory / 录制） | `boolean` | `false` |

### Latex 插件

```ts
import { XMarkdown, Latex } from 'ant-design-x-vue-next';

<XMarkdown content={md} config={{ extensions: Latex() }} />
```

## 企业使用建议

- 对大模型输出务必开启 `escapeRawHtml`，并按需收紧 `dompurifyConfig`。
- 自定义组件标签会自动合并进 DOMPurify `ADD_TAGS`；不要手动关闭消毒。
- 链接新开页请配合 `openLinksInNewTab`（自动带 `rel="noopener noreferrer"`）。
- 流式场景请设置 `streaming.hasNextChunk: true`，启用增量 token 缓存。

## 说明

- 解析引擎：[`marked`](https://github.com/markedjs/marked)（与官方一致）。
- 安全清洗：[`dompurify`](https://github.com/cure53/DOMPurify)（含 happy-dom 兼容补丁，失败时 fail-closed，绝不回退原始 HTML）。
- 已覆盖常用渲染、链接、代码块、流式尾标、**增量 token 缓存**、**LaTeX/KaTeX**、**AnimationText** 与 **DebugPanel**。
- 仍在对齐：独立包拆分。

## 贡献者

<doc-contributors component-name="x-markdown" :max-count="50" :show-view-all="true" />
