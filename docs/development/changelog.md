---
title: 更新日志
customClass: changelog-page
---

# 更新日志

`ant-design-x-vue-next` 遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

- 修订版本号：日常 bugfix 更新。
- 次版本号：带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性。

本页记录 **Vue Next 社区续作** 的版本变更。上游 [`ant-design-x-vue`](https://github.com/wzc520pyfm/ant-design-x-vue) 的历史变更见仓库根目录 [`CHANGELOG.md`](https://github.com/XiaShus/ant-design-x-vue-next/blob/main/CHANGELOG.md)。

官方 React 版更新日志见 [x.ant.design 更新日志](https://x.ant.design/changelog-cn)。

---

## 1.12.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 SDK：`AbstractChatProvider` / `DefaultChatProvider`；`OpenAIChatProvider` / `DeepSeekChatProvider` 继承抽象基类。
- 🆕 `useXChat` 支持 `provider`；`conversationKey` 支持 `MaybeRefOrGetter`（可直接绑定 `useXConversations`）。
- 🆕 `useXConversations` 多会话列表管理（对接 `conversationStore`）。
- 📖 对齐进度与文档页更新；新增 [useXConversations](/component/use-x-conversations)。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.12.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.11.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `useXChat`：`setMessage` / `removeMessage` / `onReload`（编辑、删除、原地重新生成）。
- 🆕 `Actions` 支持 `item.disabled`；文档补充 regenerate + copy 演示。
- 🆕 `XMarkdown` DebugPanel；`XMCPClient`；`DeepSeekChatProvider`。
- 🛠 修复 `dist/style.css` 导出与构建产物对齐；Resolver 支持 `<AXProvider>` → `XProvider`。
- 📖 新增 [从 ant-design-x-vue 迁移](/development/migrate-from-ant-design-x-vue) 指南。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.11.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.10.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `XMarkdown` 企业能力：安全消毒 fail-closed、`escapeRawHtml`、增量流式 token 缓存、`Latex()` / KaTeX、`AnimationText`。
- 🆕 SDK：`XRequest` timeout / streamTimeout / retry / middlewares / `abort`；`useXChat.abort` / `conversationKey`；`OpenAIChatProvider`。
- 🆕 `XCard`（A2UI v0.9）：`Box` / `Card`、本地 catalog、远程 catalog 白名单。
- 🛠 依赖新增 `katex`；文档站补充 XCard / LaTeX / 企业接入说明。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.10.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.9.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 新增内置 `XMarkdown`（MVP）：`marked` + `DOMPurify`，支持流式尾标、自定义组件映射；代码块默认对接 `CodeHighlighter` / `Mermaid`。
- 🛠 依赖新增 `marked`、`dompurify`；构建脚本改为 `pnpm exec` 以兼容 Windows PATH。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.9.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.8.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 新增 `notification` / `useNotification`，对齐官方系统级 Web Notification API。
- 🆕 新增 `CodeHighlighter` 组件（基于 `prismjs`），支持按需语言加载、自定义 Header 与复制。
- 🆕 新增 `Mermaid` 组件，支持图表渲染、缩放平移、图片/代码双视图与操作栏配置。
- 🛠 依赖新增 `prismjs`、`mermaid`；XProvider 透传新增组件样式配置。
- 🛠 Git tag `v1.8.0` 已创建；本版本 npm 与 `1.9.0` 一并交付（见上）。

## 1.7.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 新增 `Think` 组件，对齐 `@ant-design/x` 思考过程展示（展开、loading、blink）。
- 🆕 新增 `Sources` 组件，支持引用列表、折叠与轮播卡片。
- 🆕 新增 `FileCard` / `FileCard.List`，以卡片形式展示文件。
- 🆕 新增 `Folder` 组件，目录树 + 文件预览（受控选中/展开、`fileContentService`、FolderRef 树操作）。
- 📖 文档站侧边栏分组对齐官方 Ant Design X（通用 / 唤醒 / 表达 / 确认 / 反馈 / 工具）。
- 📖 新增组件对齐进度页与占位文档（Notification / CodeHighlighter / Mermaid 等）。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.7.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。
- 🛠 修复 Sources 的 `Key` 类型与 Folder 构建类型问题，保障 `vue-tsc` / 发布构建通过。

---

## 1.6.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 基于 [`ant-design-x-vue@1.6.0`](https://github.com/wzc520pyfm/ant-design-x-vue) fork 为社区续作仓库 [`XiaShus/ant-design-x-vue-next`](https://github.com/XiaShus/ant-design-x-vue-next)。
- 🆕 包名调整为 `ant-design-x-vue-next`，对齐目标为 React [`@ant-design/x`](https://github.com/ant-design/x) 2.9.x。
- 📖 文档站部署至 Netlify：https://ant-design-x-vue-next-524.netlify.app
- 🛠 首发 npm [`ant-design-x-vue-next@1.6.0`](https://www.npmjs.com/package/ant-design-x-vue-next)（含 Think 组件）。

#### 继承自上游 1.6.0 的能力

Bubble、Conversations、Welcome、Prompts、Sender、Attachments、Suggestion、ThoughtChain、Actions、XProvider，以及 `useXAgent` / `useXChat` / `XStream` / `XRequest` 等（详见上游变更记录）。
