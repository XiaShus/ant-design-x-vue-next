# XCard A2UI 动态卡片

基于 A2UI 协议的动态卡片渲染（对齐 [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card)），当前实现 **v0.9** 命令集。

## 何时使用

- Agent 通过结构化 JSON 命令流动态构建交互界面。
- 需要 surface / dataModel / action 上报的企业级 Agent UI。

## 代码演示

### 基本

:::demo 本地 catalog + Text / Button 渲染。

x-card/basic

:::

## API

### XCard.Box

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| commands | 命令队列（追加式） | `A2UICommand_v0_9[]` | `[]` |
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

## 企业安全建议

- **务必**配置 `allowedCatalogIds`，禁止 Agent 任意 URL 拉 catalog（防 SSRF）。
- 组件实现由宿主提供；`onAction` 不要自动执行危险操作，需业务侧二次确认。
- 优先使用 `registerCatalog` + `local://` 本地目录。

## 说明

- 当前支持 A2UI **v0.9**：`createSurface` / `updateComponents` / `updateDataModel` / `deleteSurface`。
- v0.8 兼容后续对齐。

## 贡献者

<doc-contributors component-name="x-card" :max-count="50" :show-view-all="true" />
