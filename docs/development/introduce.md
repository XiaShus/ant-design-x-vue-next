
# Ant Design X of Vue

`ant-design-x-vue-next` 是遵循 Ant Design 设计体系的 Vue UI 库，是 [`@ant-design/x`](https://github.com/ant-design/x) 的社区续作（基于 [`ant-design-x-vue`](https://github.com/wzc520pyfm/ant-design-x-vue)），用于构建由 AI 驱动的界面，并持续对齐官方 React 版能力。

> 组件对齐进度见 [与 Ant Design X 对齐](/component/align)。

<div style="display: flex; align-items: center; gap: 20px;">
  <img width="150" src="/images/x-logo.svg"/>
  <span style="color: rgb(170, 170, 170); font-size: 30px; use-select: none;">+</span>
  <img width="160" src="/images/vue.svg"/>
</div>

## ✨ 特性

- 🌈 基于 RICH 交互范式，提供卓越的 AI 交互体验
- 🧩 覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面
- ⚡ 轻松对接符合 OpenAI 标准的模型推理服务
- 🔄 提供好用的数据流管理功能，让开发更高效
- 📦 提供多种模板，快速启动 LUI 应用开发
- 🛡 采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性
- 🎨 支持细粒度的样式调整，满足各种场景的个性化需求

## 安装

> [!IMPORTANT]
> 确保你的 vue 版本大于 3.5

### 使用 npm 或 yarn 或 pnpm 或 bun 安装

::: code-group

```sh [npm]
$ npm install ant-design-x-vue-next --save
```

```sh [pnpm]
$ pnpm install ant-design-x-vue-next --save
```

```sh [yarn]
$ yarn add ant-design-x-vue-next
```

```sh [bun]
$ bun add ant-design-x-vue-next
```

:::

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antdx`。

<span style="display: flex;gap: 4px;align-items: center;">你可以通过 [![](https://data.jsdelivr.com/v1/package/npm/ant-design-x-vue/badge)](https://www.jsdelivr.com/package/npm/ant-design-x-vue) 或[UNPKG](https://unpkg.com/ant-design-x-vue/dist/)进行下载。</span>

无任何构建的原始 HTML 在线示例：[CodePen 示例 >](https://codepen.io/wzc520pyfm/pen/vEOVQLa)

现代浏览器大多已原生支持 ES 模块，还可以启用 [导入映射表 (Import Maps)](https://caniuse.com/import-maps)：[CodePen 示例 >](https://codepen.io/wzc520pyfm/pen/gbpBQLq)

### 自动导入

在项目中自动导入组件，需要使用 `unplugin-vue-components` 插件，如果未安装，你可以通过以下命令安装：

::: code-group

```sh [npm]
$ npm install unplugin-vue-components -D
```

```sh [pnpm]
$ pnpm install unplugin-vue-components -D
```

```sh [yarn]
$ yarn add unplugin-vue-components -D
```

```sh [bun]
$ bun add unplugin-vue-components -d
```

:::

在 `Vite` 或 `Webpack` 的配置文件中，添加以下依赖和插件：

::: code-group

```js [vite.config.js]
// vite.config.js
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// add the following dependencies
import components from 'unplugin-vue-components/vite';
import { AntDesignXVueResolver } from 'ant-design-x-vue-next/resolver';

export default defineConfig({
  // ...
  plugins: [
    // add the following plugin
    components({
      resolvers: [AntDesignXVueResolver()]
    })
  ]
});
```

```js [webpack.config.js]
// webpack.config.js

// add the following dependencies
const Components = require('unplugin-vue-components/webpack');
const { AntDesignXVueResolver } = require('ant-design-x-vue-next/resolver');

module.exports = {
  configureWebpack: {
    plugins: [
      // add the following plugin
      Components.default({
        resolvers: [AntDesignXVueResolver()]
      })
    ]
  }
};
```

:::

更多打包工具的示例，可以参考 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components#installation)

在项目中，以 `AX` 开头的组件，将被自动解析为 `ant-design-x-vue-next` 组件并导入到文件中，你可以直接在模板中使用它们：

```html
<script setup>
// auto import equals to
// import { Bubble as AXBubble } from 'ant-design-x-vue-next';
</script>

<template>
  <AXBubble content="Hello AI" />
</template>
```



## 🧩 原子组件

我们基于 RICH 交互范式，在不同的交互阶段提供了大量的原子组件，帮助你灵活搭建你的 AI 对话应用（分组对齐 Ant Design X）：

- 通用: `Bubble`、`Conversations`（`Notification` 规划中）
- 唤醒: `Welcome`、`Prompts`
- 表达: `Sender`、`Attachments`、`Suggestion`（`Sources` / `FileCard` / `Folder` / `CodeHighlighter` / `Mermaid` 规划中）
- 确认: `Think`、`ThoughtChain`
- 反馈: `Actions`

下面是使用原子组件搭建一个最简单的对话框的代码示例:

```vue
<script setup lang="ts">
import {
  // 消息气泡
  Bubble,
  // 发送框
  Sender,
} from 'ant-design-x-vue';

defineOptions({ name: 'SampleChat' });

const messages = [
  {
    content: 'Hello, Ant Design X Vue!',
    role: 'user',
  },
];
</script>

<template>
  <Bubble.List :items="messages" />
  <Sender />
</template>
```

这里有一个在线示例可供参考：[Example Project](https://stackblitz.com/edit/atgajqmx?file=src%2FDemo.vue)，也推荐fork该示例反馈bug。

::: warning

文档中 tsx 风格的代码示例采用 [`defineRender`](https://vue-macros.dev/zh-CN/macros/define-render.html) 编写，要运行它们，你还需要集成 [`Vue Macros`](https://vue-macros.dev/zh-CN/guide/bundler-integration.html).

Vue模板风格的示例代码在逐步更新中，你可以在左上角将 **风格偏好** 切换至 `setup` 预览。

:::
