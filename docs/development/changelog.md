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

## 1.31.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 公开导出 `useMobile`（默认 `(pointer: coarse)`），SSR 安全。
- 🆕 Conversations 在移动端始终显示菜单图标（`item-menu-always`）。
- 📖 新增 useMobile 文档与演示。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.31.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.30.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Bubble `onTyping(rendererContent, currentContent)` 打字过程回调。
- 📖 对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.30.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.29.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Bubble `typing.keepPrefix`：内容替换时可选从头重打（默认 `true` 保留公共前缀续打）。
- 📖 Bubble 打字前缀演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.29.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.28.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Sender 接入 `useLocale('Sender')`：停止加载 / 录音图标 SVG `<title>` 跟随 `stopLoading` / `speechRecording`。
- 📖 对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.28.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.27.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Sender `SlotTextArea` 向 React contentEditable 运行时加深：根编辑区 `contentEditable`，`text` / `content` 槽可直接编辑；`input` / `select` / `tag` / `custom` 保持为非编辑嵌入节点；支持纯文本粘贴与 `focus({ cursor: 'start' \| 'end' \| 'slot', key? })`。
- 📖 Sender 词槽文档与对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.27.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.26.1

`2026-07-30`

### ant-design-x-vue-next

- 🛠 修复 `1.26.0` 发布产物未包含 `items[]` status 对齐的问题；正式带上 `loading` / `abort`（`pending` → `loading`）。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.26.1`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.26.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 ThoughtChain `items[]` status 对齐 React：`loading` / `success` / `error` / `abort`；`pending` 作为兼容别名映射为 `loading`。（该版本 npm 产物不完整，请使用 1.26.1）
- 📖 ThoughtChain 节点状态演示更新；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.26.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.25.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 ThoughtChain 链级 React 2.x API：`line`（solid/dashed/dotted/false）、顶层 `defaultExpandedKeys` / `expandedKeys` / `onExpand`；保留 `collapsible` 对象作为兼容层并与顶层 expand 合并。
- 🆕 `items[]` 节点支持 `blink` / `collapsible` / `destroyOnHidden`（默认 `true`，折叠时卸载内容）。
- 📖 ThoughtChain 新增「折叠时销毁内容」演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.25.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.24.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `ThoughtChain.Item`：独立复合节点，支持 `variant`（solid/outlined/text）、`status`（loading/success/error/abort）、`blink`、`disabled` 与语义化 `classNames` / `styles`。
- 📖 ThoughtChain 新增「简洁思维链」演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.24.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.23.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 X locale pack：`useLocale` / `LocaleProvider`，`XProvider.locale` 驱动 Conversations / Actions / Bubble / Mermaid / Folder 文案；导出 `ant-design-x-vue-next/locale/zh_CN`、`en_US`。
- 📖 XProvider 国际化演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.23.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.22.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Sender `slotConfig` / `skill` / 结构化 `SlotTextArea`：词槽填空、`getValue` / `insert` / `clear`、扩展 `onSubmit` / `onChange`。
- 📖 Sender 词槽填空演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.22.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.21.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Conversations `creation` + `Conversations.Creation`：新建对话按钮。
- 📖 Conversations 文档新增「新建对话」演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.21.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.20.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Bubble `streaming`：流式进行中不触发 `onTypingComplete`。
- 🆕 Bubble `footerPlacement`：`outer/inner` × `start/end`。
- 🆕 `typing.effect`：支持 `typing` / `fade-in`。
- 📖 Bubble 流式与 Footer 位置演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.20.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.19.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `Bubble.System` / `Bubble.Divider`：系统消息与会话分割线。
- 🆕 Bubble `editable`：contentEditable 编辑态 + `onEditConfirm` / `onEditCancel`。
- 📖 Bubble 文档新增演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.19.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.18.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `Sender.Switch`：工具栏模式开关（受控 / 非受控、loading、disabled、checkedChildren）。
- 📖 Sender 文档新增 Switch 演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.18.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.17.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 Actions 预设：`Actions.Copy` / `Actions.Feedback` / `Actions.Item` / `Actions.Audio`。
- 🆕 `items[].actionRender`：自定义渲染操作项，可组合预设与业务控件（如 Pagination）。
- 📖 Actions 文档新增「预设操作」演示；对齐进度更新。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.17.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.16.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 XCard **Basic Catalog**：`registerBasicCatalog()` / `createBasicCatalogComponents()`，内置 Text、Button、TextField、CheckBox、Column、Row、Divider、Image、Card。
- 🛠 `Card` 为 path 绑定控件注入 `valuePath`，支持 TextField / CheckBox 双向写回 dataModel。
- 📖 新增 [XCard](/component/x-card) Basic Catalog 演示；对齐进度标记 x-card 内置 catalog 完成。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.16.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.15.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `createManualXRequest` / `AbstractXRequestClass`：SDK 风格 manual 请求，供 Provider 托管。
- 🆕 `AbstractChatProvider` 支持 `request` + `injectRequest`；`useXChat` 可仅用 `provider` 发请求（无需 `useXAgent`）。
- 📖 更新 useXChat / XRequest / 对齐进度文档。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.15.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.14.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `setXRequestGlobalOptions`：应用级 headers / timeout / middlewares / fetch 默认值。
- 🆕 `useXChat`：异步 `defaultMessages`、`isDefaultMessagesRequesting`、`queueRequest`、`MessageInfo.extraInfo`。
- 🛠 GitHub Release 流水线：npm 版本已存在时跳过 publish，避免本地发版后再推 tag 导致 E403。
- 🛠 补建此前失败的 `v1.12.0` / `v1.13.0` GitHub Release。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.14.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

## 1.13.0

`2026-07-30`

### ant-design-x-vue-next

- 🆕 `XCard` 兼容 A2UI **v0.8**（`surfaceUpdate` / `dataModelUpdate` / `beginRendering` / `literalString` / action.context 数组）。
- 🛠 npm `files` 显式包含 `README.md` / `README.en.md` / `LICENSE`，修复包页 README 展示问题。
- 📖 XCard 文档补充 v0.8 演示与协议对照。
- 🛠 发布 npm 包 [`ant-design-x-vue-next@1.13.0`](https://www.npmjs.com/package/ant-design-x-vue-next)。

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
