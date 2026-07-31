# Think 思考过程

展示大模型深度思考过程。

## 何时使用

- 用于在对话时展示大模型的深度思考过程。

## 代码演示

### 基本

:::demo 基础用法。

think/basic

:::

### 设置状态

:::demo 通过 `loading` / `blink` 展示思考中状态。

think/status

:::

### 是否展开

:::demo 受控展开。

think/expand

:::

## API

### ThinkProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 样式类名 | Record<ThinkSemanticType, string> | - | 1.113.0（类型导出文档） |
| styles | 样式 style | Record<ThinkSemanticType, CSSProperties> | - | 1.113.0（类型导出文档） |
| title | 状态文本 | VNode \| string \| (() => VNode \| string) | - | - |
| icon | 状态图标 | VNode \| (() => VNode) | - | - |
| loading | 加载中 | boolean \| VNode \| (() => VNode) | false | - |
| defaultExpanded | 默认是否展开 | boolean | true | - |
| expanded | 是否展开 | boolean | - | - |
| onExpand | 展开事件 | (expand: boolean) => void | - | - |
| blink | 闪动模式 | boolean | - | - |
| destroyOnHidden | 隐藏时是否销毁内容节点 | boolean | true | - |

自 `1.150.0` 起可从包入口 `import type { ThinkProps, ThinkRef }`（对齐 React Think 包入口 Props / Ref 类型）。

自 `1.113.0` 起可从包入口 `import type { ThinkSemanticType }`（对齐 React Think `SemanticType` 键集）。

```typescript | pure
type ThinkSemanticType = 'root' | 'status' | 'content';
```

### Think Ref

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 根节点 DOM（类型亦导出为 `ThinkRef`） | HTMLElement | 1.65.0；1.150.0（类型导出文档） |

### Think Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 思考内容 |
| title | 状态文本 |
| icon | 状态图标 |
| loading | 加载中图标 |

## 贡献者

<doc-contributors component-name="think" :max-count="50" :show-view-all="true" />
