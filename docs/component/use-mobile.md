# useMobile 移动端检测

检测粗指针 / 触控优先设备，对齐 `@ant-design/x` 的 `useMobile`。

## 何时使用

- 需要在移动端调整交互（例如始终展示操作菜单）
- 与 CSS `@media (pointer: coarse)` 语义一致时

## 代码演示

### 基本

:::demo `useMobile` 返回 `Ref<boolean>`，SSR 安全（挂载前为 `false`）。

use-mobile/basic

:::

## API

```ts
import { useMobile } from 'ant-design-x-vue-next';

const isMobile = useMobile();
const isCoarse = useMobile('(pointer: coarse)'); // 默认
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| query | `matchMedia` 查询串 | string | `'(pointer: coarse)'` | 1.31.0 |

返回值：`Ref<boolean>`
