# Ant Design X Vue Next

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
![vue][vue-version-src]
[![Netlify Status][netlify-src]][netlify-href]

> Community continuation of [ant-design-x-vue](https://github.com/wzc520pyfm/ant-design-x-vue), aligning follow-up features with [@ant-design/x](https://github.com/ant-design/x).

Ant Design X For Vue. 🔥 [English](./README.en.md)

这里是 [Ant Design X](https://github.com/ant-design/x) 的 Vue 实现（社区续作）。

**仓库：** https://github.com/XiaShus/ant-design-x-vue-next  
**文档站：** https://ant-design-x-vue-next-524.netlify.app  
**npm：** https://www.npmjs.com/package/ant-design-x-vue-next

**上游：**
- Vue 原版：https://github.com/wzc520pyfm/ant-design-x-vue
- React 对齐目标：https://github.com/ant-design/x（当前 `@ant-design/x@2.9.0`）

## ✨ 特性

- 🌈 基于 RICH 交互范式，提供卓越的 AI 交互体验
- 🧩 覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面
- ⚡ 轻松对接符合 OpenAI 标准的模型推理服务
- 🔄 提供好用的数据流管理功能，让开发更高效
- 📦 提供多种模板，快速启动 LUI 应用开发
- 🛡 采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性
- 🎨 支持细粒度的样式调整，满足各种场景的个性化需求

## 📦 安装

```bash
$ npm i ant-design-vue ant-design-x-vue-next
```

```bash
$ yarn add ant-design-vue ant-design-x-vue-next
```

```bash
$ pnpm add ant-design-vue ant-design-x-vue-next
```

开发阶段也可继续使用源码别名 `ant-design-x-vue`（与原仓库兼容）。

## 🔨 示例

```html
<script setup lang="ts">
import { Bubble, XProvider } from 'ant-design-x-vue-next';
</script>

<template>
  <Bubble content="Hello AI" />
</template>
```

## 🧭 对齐进度（相对 @ant-design/x 2.9）

| 组件 / 包 | Vue Next | React `@ant-design/x` |
| --- | --- | --- |
| Bubble / Sender / Conversations / … | ✅（继承 1.6.0） | ✅ |
| Think | ✅（本仓库新增） | ✅ |
| Sources | ✅（本仓库新增） | ✅ |
| FileCard | ✅（本仓库新增） | ✅ |
| Folder | ✅（本仓库新增） | ✅ |
| Notification | ✅（本仓库新增） | ✅ |
| CodeHighlighter | ✅（本仓库新增） | ✅ |
| Mermaid | ✅（本仓库新增） | ✅ |
| `@ant-design/x-markdown` / `x-sdk` / `x-card` | ⏳ | ✅ |

## ⌨️ 开发

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm docs:dev

# build library source code
$ pnpm run build

# build docs code
$ pnpm run docs:build

# Locally preview the production build.
$ pnpm run docs:preview

# Lint
$ pnpm lint
```

## 🔗 链接

* [Vue](https://vuejs.org/)
* [Ant Design Vue](https://www.antdv.com/)
* [Ant Design X (React)](https://x.ant.design/)
* [原 Vue 仓库](https://github.com/wzc520pyfm/ant-design-x-vue)

## 📄 LICENSE

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/ant-design-x-vue-next.svg?style=flat
[npm-version-href]: https://www.npmjs.com/package/ant-design-x-vue-next
[npm-downloads-src]: https://img.shields.io/npm/dm/ant-design-x-vue-next.svg?style=flat
[npm-downloads-href]: https://www.npmjs.com/package/ant-design-x-vue-next
[vue-version-src]: https://img.shields.io/badge/vue-%20%3E%3D%203.5-47c219
[license-src]: https://img.shields.io/github/license/XiaShus/ant-design-x-vue-next?style=flat
[license-href]: https://github.com/XiaShus/ant-design-x-vue-next/blob/main/LICENSE
[netlify-src]: https://api.netlify.com/api/v1/badges/768dab5b-1472-4133-942d-e06f30e6f1f9/deploy-status
[netlify-href]: https://ant-design-x-vue-next-524.netlify.app
