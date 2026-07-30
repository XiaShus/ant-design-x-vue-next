# Ant Design X of Vue

`ant-design-x-vue-next` 是遵循 Ant Design 设计体系的 Vue UI 库，用于构建由 AI 驱动的界面。

它是官方 React 版 [`@ant-design/x`](https://github.com/ant-design/x) 的**社区续作**（基于 [`ant-design-x-vue`](https://github.com/wzc520pyfm/ant-design-x-vue)），持续对齐官方能力与文档结构。

<div style="display: flex; align-items: center; gap: 20px; margin: 24px 0;">
  <img width="150" src="/images/x-logo.svg" alt="Ant Design X" />
  <span style="color: rgb(170, 170, 170); font-size: 30px; user-select: none;">+</span>
  <img width="160" src="/images/vue.svg" alt="Vue" />
</div>

## 快速入口

| 入口 | 说明 |
| --- | --- |
| [组件总览](/component/overview) | 按 RICH 分组浏览全部组件 |
| [更新日志](/development/changelog) | 版本变更时间线（对齐官方风格） |
| [对齐进度](/component/align) | 与 `@ant-design/x` 的对照表 |
| [设计语言](https://x.ant.design/docs/spec/introduce-cn) | 官方 RICH 设计指南（外链） |
| [样板间](/playground/independent) | 独立式 / 助手式演示 |

## 特性

- 基于 RICH 交互范式，提供卓越的 AI 交互体验
- 覆盖对话场景常用组件：唤醒、表达、确认、反馈
- 轻松对接符合 OpenAI 标准的模型推理服务
- 提供 `useXChat` / `XRequest` / `XStream` 等数据流能力
- TypeScript 开发，细粒度样式与语义化 DOM 可定制

## 安装

> [!IMPORTANT]
> 确保你的 Vue 版本大于等于 3.5，并安装 `ant-design-vue`。

::: code-group

```sh [npm]
$ npm install ant-design-vue ant-design-x-vue-next --save
```

```sh [pnpm]
$ pnpm add ant-design-vue ant-design-x-vue-next
```

```sh [yarn]
$ yarn add ant-design-vue ant-design-x-vue-next
```

```sh [bun]
$ bun add ant-design-vue ant-design-x-vue-next
```

:::

### 浏览器引入

在浏览器中使用 `script` 引入 UMD 产物，全局变量为打包配置中的库名。可通过 [jsDelivr](https://www.jsdelivr.com/package/npm/ant-design-x-vue-next) 或 [UNPKG](https://unpkg.com/ant-design-x-vue-next/) 获取：

```html
<script src="https://unpkg.com/ant-design-x-vue-next/dist/index.umd.js"></script>
```

推荐在现代工程中使用 npm 安装与按需/自动导入。

### 自动导入

使用 `unplugin-vue-components` 时，可通过 resolver 自动解析以 `AX` 开头的组件：

::: code-group

```js [vite.config.js]
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import components from 'unplugin-vue-components/vite';
import { AntDesignXVueResolver } from 'ant-design-x-vue-next/resolver';

export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [AntDesignXVueResolver()],
    }),
  ],
});
```

```js [webpack.config.js]
const Components = require('unplugin-vue-components/webpack');
const { AntDesignXVueResolver } = require('ant-design-x-vue-next/resolver');

module.exports = {
  configureWebpack: {
    plugins: [
      Components.default({
        resolvers: [AntDesignXVueResolver()],
      }),
    ],
  },
};
```

:::

```html
<script setup>
// auto import equals to
// import { Bubble as AXBubble } from 'ant-design-x-vue-next';
</script>

<template>
  <AXBubble content="Hello AI" />
</template>
```

## 快速上手

```vue
<script setup lang="ts">
import { Bubble, Sender } from 'ant-design-x-vue-next';

const messages = [{ content: 'Hello, Ant Design X Vue Next!', role: 'user' }];
</script>

<template>
  <Bubble.List :items="messages" />
  <Sender />
</template>
```

## 原子组件（RICH）

分组对齐官方 Ant Design X：

- **通用**: `Bubble`、`Conversations`、`notification`（系统 Web Notification）
- **唤醒**: `Welcome`、`Prompts`
- **表达**: `Sender`、`Attachments`、`Suggestion`、`Folder`、`CodeHighlighter`、`Mermaid`
- **确认**: `Think`、`ThoughtChain`
- **反馈**: `Actions`、`Sources`、`FileCard`

完整对照见 [与 Ant Design X 对齐](/component/align)。

::: warning

文档中 tsx 风格的代码示例采用 [`defineRender`](https://vue-macros.dev/zh-CN/macros/define-render.html) 编写，要运行它们还需集成 [`Vue Macros`](https://vue-macros.dev/zh-CN/guide/bundler-integration.html)。

也可在左上角将 **风格偏好** 切换至 `setup` 预览模板风格示例。

:::
