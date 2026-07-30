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

## Unreleased

### ant-design-x-vue-next

- 🆕 新增 `notification` / `useNotification`，对齐官方系统级 Web Notification API。
- 🆕 新增 `CodeHighlighter` 组件（基于 `prismjs`），支持按需语言加载、自定义 Header 与复制。

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
