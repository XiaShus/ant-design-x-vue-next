# XCard A2UI 动态卡片

基于 A2UI 协议的动态卡片渲染（对齐 [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card)），支持 **v0.9（推荐）** 与 **v0.8（兼容）**。

## 何时使用

- Agent 通过结构化 JSON 命令流动态构建交互界面。
- 需要 surface / dataModel / action 上报的企业级 Agent UI。
- 对接仍发送 v0.8 报文的旧 Agent。

## 代码演示

### 基本（v0.9）

:::demo 本地 catalog + Text / Button 渲染（v0.9）。

x-card/basic

:::

### A2UI v0.8

:::demo `surfaceUpdate` + `beginRendering` 兼容旧协议。

x-card/v0-8

:::

## API

### XCard.Box

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| commands | 命令队列（追加式）；可混用 v0.8 / v0.9 | `(A2UICommand_v0_8 \| A2UICommand_v0_9)[]` | `[]` |
| components | 已注册的 Vue 组件映射（组件名需大写开头） | `Record<string, Component>` | `{}` |
| allowedCatalogIds | 远程 catalog 白名单；未列出则拒绝 fetch（安全） | `string[]` | - |
| onAction | 组件触发 action 时回调 | `(payload: ActionPayload) => void` | - |

### XCard.Card

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | surfaceId | `string` |

### Catalog

```ts
import { registerCatalog, loadCatalog, clearCatalogCache } from 'ant-design-x-vue-next';

registerCatalog({
  $id: 'local://demo',
  components: { Text: { type: 'object' }, Button: { type: 'object' } },
});
```

## 协议版本

组件根据命令形态自动识别：

| | v0.9（推荐） | v0.8（兼容） |
| --- | --- | --- |
| 识别 | 带 `version: 'v0.9'` | 无 version，使用 `surfaceUpdate` 等 |
| 建画布 | `createSurface` | `beginRendering`（需先 `surfaceUpdate`） |
| 更新组件 | `updateComponents` + `"component": "Text"` | `surfaceUpdate` + `{ Text: {...} }` |
| 数据更新 | `updateDataModel`：`path` + `value` | `dataModelUpdate`：`contents` |
| Action | `action.event.name` / `event.context` 对象 | `action.name` / `context` 数组 |

## 企业安全建议

- **务必**配置 `allowedCatalogIds`，禁止 Agent 任意 URL 拉 catalog（防 SSRF）。
- 组件实现由宿主提供；`onAction` 不要自动执行危险操作，需业务侧二次确认。
- 优先使用 `registerCatalog` + `local://` 本地目录；新 Agent 请使用 v0.9。

## 贡献者

<doc-contributors component-name="x-card" :max-count="50" :show-view-all="true" />
