<script>
import { useStorage } from '@vueuse/core';
const preferLocal = useStorage('antdx-docs-preference', 'tsx');
</script>

# Bubble 对话气泡

用于聊天的气泡组件。

## 何时使用

常用于聊天的时候。

## 代码演示

### 基本

:::demo 基础用法。

bubble/basic

:::

### 系统消息

:::demo `Bubble.System` 居中系统提示。

bubble/system

:::

### 分割线

:::demo `Bubble.Divider` 会话分段。

bubble/divider

:::

### 可编辑

:::demo `editable` + `onEditConfirm` / `onEditCancel`。

bubble/editable

:::

### 流式输出

:::demo `streaming` 控制流式结束时机；可叠加 `typing`。

bubble/stream

:::

### Footer 位置

:::demo `footerPlacement`：outer / inner × start / end。

bubble/footer-placement

:::

### 支持位置和头像

:::demo 通过 `avatar` 设置自定义头像，通过 `placement` 设置位置，提供了 `start`、`end` 两个选项。

bubble/avatar-and-placement

:::

### 头和尾

:::demo 通过 `header` 和 `footer` 属性设置气泡的头部和底部。

bubble/header-and-footer

:::

### 加载中

:::demo 通过 `loading` 属性控制加载状态。

bubble/loading

:::

### 打字效果

:::demo 通过设置 `typing` 属性，开启打字效果。更新 `content` 如果是之前的子集，则会继续输出，否则会重新输出。

bubble/typing

:::

### 自定义渲染内容

:::demo 自定义渲染内容。

bubble/custom-content

:::

### 渲染markdown内容

:::demo 配合 `markdown-it` 实现自定义渲染内容。

bubble/markdown

:::

### 变体

:::demo 通过 `variant` 属性设置气泡的样式变体。

bubble/variant

:::

### 形状

:::demo 通过 `shape` 属性设置气泡的形状。

bubble/shape

:::

### 气泡列表

:::demo 预设样式的气泡列表，支持自动滚动。使用 `roles` 设置气泡默认属性。

bubble/list

:::

### 语义化自定义

:::demo 示例通过语义化以及加载定制，来调整气泡效果。

bubble/bubble-custom

:::

<span v-if="preferLocal === 'setup'">

:::demo 还可以使用插槽：

bubble/bubble-custom-slot

:::

</span>

### 自定义列表内容

:::demo 自定义气泡列表内容，这对于个性化定制场景非常有用。

bubble/list-custom

:::

### 深度思考

:::demo 带深度思考。

bubble/with-think

:::

### 使用 GPT-Vis 渲染图表 (no support)

@antv/GPT-Vis 仅支持React。

:::demo 配合 @antv/GPT-Vis 实现大模型输出的图表渲染，支持模型流式输出。

bubble/gpt-vis

:::


## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### Bubble

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| avatar | 展示头像 | VNode | - |  |
| classNames | 语义化结构 class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| content | 聊天内容 | ContentType | - |  |
| footer | 底部内容 | VNode \| (content: ContentType, info: { key?: string \| number }) => VNode | - |  |
| header | 头部内容 | VNode \| (content: ContentType, info: { key?: string \| number }) => VNode | - |  |
| loading | 聊天内容加载状态 | boolean | - |  |
| placement | 信息位置 | `start` \| `end` | `start` |  |
| shape | 气泡形状 | `round` \| `corner` | - |  |
| styles | 语义化结构 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| typing | 设置聊天内容打字动画 | boolean \| \{ step?: number, interval?: number \} | false |  |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `filled` |  |
| loadingRender | 自定义渲染加载态内容 | () => VNode | - |  |
| messageRender | 自定义渲染内容 | <ContentType extends [BubbleContentType](https://github.com/wzc520pyfm/ant-design-x-vue/blob/main/src/bubble/interface.ts#L23) = string>(content?: ContentType) => VNode | - |  |
| onTypingComplete | 打字效果完成时的回调，如果没有设置 typing 将在渲染时立刻触发 | () => void | - |  |
| editable | 是否可编辑（content 需为 string） | `boolean \| { editing?: boolean; okText?; cancelText? }` | `false` | 1.19.0 |
| onEditConfirm | 编辑确认回调 | `(content: string) => void` | - | 1.19.0 |
| onEditCancel | 编辑取消回调 | `() => void` | - | 1.19.0 |
| streaming | 流式传输中；为 true 时不触发 `onTypingComplete` | boolean | `false` | 1.20.0 |
| footerPlacement | footer 位置 | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | 随 placement | 1.20.0 |
| typing.effect | 打字效果 | `typing` \| `fade-in` | `typing` | 1.20.0 |

### Bubble.System

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 系统消息内容 | ContentType | - | 1.19.0 |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `shadow` | 1.19.0 |
| shape | 气泡形状 | `round` \| `corner` | - | 1.19.0 |

### Bubble.Divider

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 分割线文案 | ContentType | - | 1.19.0 |
| dividerProps | 透传 ant-design-vue Divider | `DividerProps`（如 `dashed` / `plain`） | - | 1.19.0 |

### Bubble Slots

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| avatar | 头像 | - |
| header | 头部面板 | \{ content: ContentType, info: \{ key?: string \| number \} \} |
| footer | 底部内容 | \{ content: ContentType, info: \{ key?: string \| number \} \} |
| loading | loading占位 | - |
| message | 消息内容 | \{ content: ContentType \} |

#### ContentType

默认类型

```typescript
type ContentType = Vue.VNode | AnyObject | string | number;
```

自定义类型使用

```tsx
type CustomContentType = {
  ...
}

<Bubble<CustomContentType> {...props} />
// or
const MyBubble = Bubble<CustomContentType>;
<MyBubble v-bind="props" />
```

### Bubble.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoScroll | 当内容更新时，自动滚动到最新位置。如果用户滚动，则会暂停自动滚动。 | boolean | true |  |
| items | 气泡数据列表 | (BubbleProps & { key?: string \| number, role?: string })[] | - |  |
| roles | 设置气泡默认属性，`items` 中的 `role` 会进行自动对应 | Record<string, BubbleProps> \| (bubble, index) => BubbleProps | - |  |
| onScroll | 监听 `Bubble.List` 滚动 | (e: Event) => void | - | 1.5.0 |

### Bubble.List Slots

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| avatar | 头像 | \{ item: BubbleProps & \{ key?: string \| number, role?: string \} \} |
| header | 头部面板 | \{ item: BubbleProps & \{ key?: string \| number, role?: string \} \} |
| footer | 底部内容 | \{ item: BubbleProps & \{ key?: string \| number, role?: string \} \} |
| loading | loading占位 | \{ item: BubbleProps & \{ key?: string \| number, role?: string \} \} |
| message | 消息内容 | \{ item: BubbleProps & \{ key?: string \| number, role?: string \} \} |

## Semantic DOM

<vp-semantic component="Bubble"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Bubble"></ComponentTokenTable> -->

## 贡献者

<doc-contributors component-name="bubble" :max-count="50" :show-view-all="true" />
