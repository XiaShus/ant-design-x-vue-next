# XCard A2UI 动态卡片

基于 A2UI 协议的动态卡片渲染（对齐 [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card)），支持 **v0.9（推荐）** 与 **v0.8（兼容）**，并提供 **Basic Catalog** 内置组件。

## 何时使用

- Agent 通过结构化 JSON 命令流动态构建交互界面。
- 需要 surface / dataModel / action 上报的企业级 Agent UI。
- 对接仍发送 v0.8 报文的旧 Agent。
- 希望开箱即用 Text / Button / 表单布局，无需手写全部宿主组件。

## 代码演示

### 基本（v0.9）

:::demo 本地 catalog + 自定义 Text / Button。

x-card/basic

:::

### 内置 Basic Catalog

:::demo `registerBasicCatalog()` 提供 ant-design-vue 包装组件。

x-card/basic-catalog

:::

### A2UI v0.8

:::demo `surfaceUpdate` + `beginRendering` 兼容旧协议。

x-card/v0-8

:::

## API

### XCard.Box

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| commands | 命令队列（追加式）；可混用 v0.8 / v0.9 | `A2UICommand[]`（`A2UICommand_v0_8 \| A2UICommand_v0_9`） | `[]` | 1.128.0（`A2UICommand*` 类型导出文档） |
| components | 已注册的 Vue 组件映射（组件名需大写开头） | `Record<string, Component>` | `{}` | - |
| allowedCatalogIds | 远程 catalog 白名单；未列出则拒绝 fetch（安全） | `string[]` | - | - |
| onAction | 组件触发 action 时回调 | `(payload: ActionPayload) => void` | - | 1.127.0（`ActionPayload` 类型导出文档） |

自 `1.127.0` 起可从包入口 `import type { ActionPayload, BoxProps, Catalog, CatalogComponent }`。

自 `1.128.0` 起可从包入口 `import type { A2UICommand, A2UICommand_v0_8, A2UICommand_v0_9 }`（亦导出别名 `XAgentCommand_v0_8` / `XAgentCommand_v0_9`）。

```typescript | pure
type A2UICommand = A2UICommand_v0_8 | A2UICommand_v0_9;

interface ActionPayload {
  name: string;
  surfaceId: string;
  context: Record<string, any>;
}

interface CatalogComponent {
  type: 'object';
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

interface Catalog {
  $schema?: string;
  $id?: string;
  title?: string;
  catalogId?: string;
  components?: Record<string, CatalogComponent>;
  [key: string]: any;
}
```

### XCard.Card

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | surfaceId | `string` |

### registerBasicCatalog

注册内置 Basic Catalog，并返回 `{ catalogId, components }` 供 `Box` 使用。

```ts
import { Box, Card, registerBasicCatalog } from 'ant-design-x-vue-next';

const { catalogId, components } = registerBasicCatalog();

// Box: commands + components + createSurface.catalogId = catalogId
```

内置组件：`Text`、`Button`、`TextField`、`CheckBox`、`Column`、`Row`、`Divider`、`Image`、`Card`。

也可单独使用：`createBasicCatalogComponents()`、`basicCatalog`、`BASIC_CATALOG_ID`。

### Catalog（自定义）

```ts
import { registerCatalog } from 'ant-design-x-vue-next';
import type { Catalog } from 'ant-design-x-vue-next';

const catalog: Catalog = {
  $id: 'local://demo',
  components: { Text: { type: 'object' }, Button: { type: 'object' } },
};
registerCatalog(catalog);
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
- 组件实现由宿主提供（或使用 `registerBasicCatalog`）；`onAction` 不要自动执行危险操作。
- 优先使用 `registerCatalog` / `registerBasicCatalog` + `local://`。

## 贡献者

<doc-contributors component-name="x-card" :max-count="50" :show-view-all="true" />
