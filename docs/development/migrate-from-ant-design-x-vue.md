# 从 ant-design-x-vue 迁移

本指南帮助你把依赖从上游 [`ant-design-x-vue`](https://github.com/wzc520pyfm/ant-design-x-vue) 替换为社区续作 [`ant-design-x-vue-next`](https://github.com/XiaShus/ant-design-x-vue-next)。

`ant-design-x-vue-next` 是 **API 超集**：原 1.6.x 的 Bubble / Sender / useXChat / XRequest 等均可继续使用，并额外提供 Think、XMarkdown、Sources、XCard 等能力。

## 1. 安装

```bash
pnpm remove ant-design-x-vue
pnpm add ant-design-x-vue-next
```

保持 peer 依赖：

- `vue` >= 3.5
- `ant-design-vue` >= 4

## 2. 替换 import

全局替换包名即可：

```diff
- import { Bubble, XProvider, useXChat } from 'ant-design-x-vue'
+ import { Bubble, XProvider, useXChat } from 'ant-design-x-vue-next'
```

## 3. 按需自动导入（unplugin-vue-components）

```ts
import Components from 'unplugin-vue-components/vite'
import { AntDesignXVueResolver } from 'ant-design-x-vue-next/resolver'

export default {
  plugins: [
    Components({
      resolvers: [AntDesignXVueResolver()],
    }),
  ],
}
```

模板中使用 `AX` 前缀，例如 `<AXBubble />`、`<AXProvider>`（解析为导出的 `XProvider`）。

## 4. 样式

组件样式以 **CSS-in-JS** 为主，一般无需手动引入 CSS。

若你的工程需要静态样式入口：

```ts
import 'ant-design-x-vue-next/dist/style.css'
```

（与 `dist/ant-design-x-vue-next.css` 等价。）

## 5. 冒烟清单

迁移后建议至少验证：

1. 根节点用 `XProvider`（或 `<AXProvider>`）包裹
2. `Bubble` / `Sender` 收发消息正常
3. `useXChat` 流式更新；`abort()` 可停止；`onReload(id)` 可原地重试
4. 若渲染模型 Markdown，使用 `XMarkdown` 并建议开启 `escapeRawHtml`
5. Actions 的 `disabled`（如请求中禁用 Retry）表现正常

## 6. 常见差异

| 项 | 说明 |
| --- | --- |
| 包名 | 必须改为 `ant-design-x-vue-next`，不能继续依赖旧包 |
| Resolver | 从 `ant-design-x-vue-next/resolver` 引入 |
| 新增组件 | Think / Sources / FileCard / Folder / CodeHighlighter / Mermaid / XMarkdown / XCard / Notification 等可直接用 |
| React 独立包 | `@ant-design/x-skill`、完整 AbstractChatProvider 栈仍在对齐中，一般不影响从旧 Vue 包迁移 |

## 相关链接

- [介绍](/development/introduce)
- [对齐进度](/component/align)
- [更新日志](/development/changelog)
- npm：https://www.npmjs.com/package/ant-design-x-vue-next
