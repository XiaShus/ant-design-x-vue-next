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

### 旁侧 Extra

:::demo `extra` 渲染在气泡旁侧（时间戳等）；与 `extraInfo`（`contentRender` 元数据）不同。

bubble/extra

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

### 打字前缀保留

:::demo `typing.keepPrefix`（默认 `true`）控制内容替换时是否从公共前缀续打；设为 `false` 则始终从头重打。

bubble/animation

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
| avatar | 展示头像（支持 BubbleSlot） | `AvatarProps \| VNode \| (content, info: InfoType) => VNode` | - | 1.43.0（函数 BubbleSlot） |
| classNames | 语义化结构 class（含 `root` / `body`） | Record<BubbleSemanticType, string> | - | 1.64.0（`root`/`body`）；1.125.0（类型导出文档） |
| content | 聊天内容 | ContentType | - |  |
| footer | 底部内容 | VNode \| (content: ContentType, info: { key?: string \| number }) => VNode | - |  |
| header | 头部内容 | VNode \| (content: ContentType, info: { key?: string \| number }) => VNode | - |  |
| loading | 聊天内容加载状态 | boolean | - |  |
| placement | 信息位置 | `start` \| `end` | `start` |  |
| shape | 气泡形状 | `round` \| `corner` | - |  |
| styles | 语义化结构 style（含 `root` / `body`） | Record<BubbleSemanticType, CSSProperties> | - | 1.64.0（`root`/`body`）；1.125.0（类型导出文档） |
| typing | 设置聊天内容打字动画；可为 `(content, info) => boolean \| TypingOption` | boolean \| TypingOption \| `((content, info) => boolean \| TypingOption)` | false | 1.40.0（函数形式） |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `filled` |  |
| loadingRender | 自定义渲染加载态内容 | () => VNode | - |  |
| contentRender | 自定义渲染内容（React 2.x 主 API） | `(content: ContentType, info: InfoType) => VNode \| string` | - | 1.36.0 |
| messageRender | 同 `contentRender`（兼容旧名，已弃用；同时设置时以 `contentRender` 为准） | `(content: ContentType, info?: InfoType) => VNode \| string` | - | - |
| status | 消息状态（供 `contentRender` 的 `info`，非 DOM 属性） | `MessageStatus` | - | 1.36.0 |
| extraInfo | 额外元数据（供 `contentRender` 的 `info`，非 DOM 属性） | `object` | - | 1.36.0 |
| extra | 气泡旁侧 UI（时间戳 / Actions 等；非 `extraInfo`） | `VNode \| string \| (content, info: InfoType) => VNode \| string` | - | 1.37.0 |
| onTyping | 打字过程回调 | (rendererContent: string, currentContent: string) => void | - | 1.30.0 |
| onTypingComplete | 打字效果完成时的回调，如果没有设置 typing 将在渲染时立刻触发 | () => void | - |  |
| editable | 是否可编辑（content 需为 string） | `boolean \| { editing?: boolean; okText?; cancelText? }` | `false` | 1.19.0 |
| onEditConfirm | 编辑确认回调 | `(content: string) => void` | - | 1.19.0 |
| onEditCancel | 编辑取消回调 | `() => void` | - | 1.19.0 |
| streaming | 流式传输中；为 true 时不触发 `onTypingComplete` | boolean | `false` | 1.20.0 |
| footerPlacement | footer 位置 | FooterPlacement | 随 placement | 1.20.0；1.99.0（类型导出） |
| typing.effect | 打字效果 | BubbleTypingEffect | `typing` | 1.20.0；1.99.0（类型导出） |
| typing.step | 每次前进字符数；数组为闭区间随机步长 | `number \| [number, number]` | `1` | 1.43.0（区间） |
| typing.keepPrefix | 内容变化时是否保留公共前缀续打（流式场景） | boolean | `true` | 1.29.0 |

自 `1.138.0` 起可从包入口 `import type { BubbleProps, BubbleRef }`（对齐 React Bubble 包入口 Props / Ref 类型；`BubbleRef` 自 `1.78.0` 已导出）。

自 `1.125.0` 起可从包入口 `import type { BubbleSemanticType }`（对齐 React Bubble `SemanticType` 键集）。

```typescript | pure
type BubbleSemanticType =
  | 'root'
  | 'body'
  | 'avatar'
  | 'content'
  | 'header'
  | 'footer'
  | 'extra';
```

自 `1.99.0` 起可从包入口 `import type { TypingOption, BubbleTypingEffect, FooterPlacement }`。
自 `1.103.0` 起可从包入口 `import type { BubbleContentType, SlotInfoType }`（`SlotInfoType` 为 `InfoType` 别名）。

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
type InfoType = { key?: string | number; status?: MessageStatus; extraInfo?: object };
type SlotInfoType = InfoType;
type BubbleContentType = VNode | string | AnyObject | number;
type FooterPlacement = 'outer-start' | 'outer-end' | 'inner-start' | 'inner-end';
type BubbleTypingEffect = 'typing' | 'fade-in';
type TypingOption = {
  step?: number | [number, number];
  interval?: number;
  suffix?: VNode | string;
  effect?: BubbleTypingEffect;
  keepPrefix?: boolean;
};
```

### Bubble Ref

可通过模板 `ref` 获取（类型 `BubbleRef`，自 `1.78.0` 从包入口导出；`1.138.0` 起与 `BubbleProps` 一并在文档中标明）：

| 名称 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 气泡根节点 DOM（类型亦导出为 `BubbleRef`） | HTMLElement | 1.78.0；1.138.0（类型导出文档） |

### Bubble.System

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 系统消息内容 | ContentType | - | 1.19.0 |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `shadow` | 1.19.0 |
| shape | 气泡形状 | `round` \| `corner` | - | 1.19.0 |

#### Bubble.System / Bubble.Divider Ref

| 名称 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 根节点 DOM（转发自内部 Bubble，对齐 React） | HTMLElement | 1.77.0 |

### Bubble.Divider

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 分割线文案 | ContentType | - | 1.19.0 |
| dividerProps | 透传 ant-design-vue Divider | `DividerProps`（如 `dashed` / `plain`） | - | 1.19.0 |

### Bubble Slots

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| avatar | 头像 | `{ content, info: InfoType }` |
| header | 头部面板 | \{ content: ContentType, info: InfoType \} |
| footer | 底部内容 | \{ content: ContentType, info: InfoType \} |
| extra | 旁侧内容 | \{ content: ContentType, info: InfoType \} |
| loading | loading占位 | - |
| message | 消息内容 | \{ content: ContentType \} |

#### ContentType

默认类型（包入口导出名为 `BubbleContentType`，自 `1.103.0`）：

```typescript
type BubbleContentType = VNode | AnyObject | string | number;
// 文档中的 ContentType 即 BubbleContentType
type ContentType = BubbleContentType;
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
| items | 气泡数据列表；`role: 'system' \| 'divider'` 渲染对应子组件（类型亦导出为 `BubbleItemType`，对齐 React） | BubbleItemType[] / BubbleDataType[] | - | 1.81.0（`BubbleItemType` 导出） |
| roles | 设置气泡默认属性，`items` 中的 `role` 会进行自动对应（与 `role` 等价；同时传入时优先 `roles`） | Record<string, BubbleProps> \| (bubble, index) => BubbleProps | - |  |
| role | 对齐 React：同 `roles` | Record<string, BubbleProps> \| (bubble, index) => BubbleProps | - | 1.68.0 |
| classNames | 语义化 className（含气泡语义键与列表键） | Record<ListSemanticType, string> | - | 1.53.0；1.125.0（类型导出文档） |
| styles | 语义化 style（同上） | Record<ListSemanticType, CSSProperties> | - | 1.53.0；1.125.0（类型导出文档） |
| onScroll | 监听 `Bubble.List` 滚动（scroll-box） | (e: Event) => void | - | 1.5.0 |

自 `1.140.0` 起可从包入口 `import type { BubbleListProps, BubbleListRef }`（对齐 React Bubble.List 包入口 Props / Ref 类型）。

自 `1.125.0` 起文档明确包入口 `import type { ListSemanticType }`（`Bubble.List` 语义键；含 `BubbleSemanticType` 与 `root` / `scroll` / `bubble` / `system` / `divider`）。

```typescript | pure
type ListSemanticType =
  | BubbleSemanticType
  | 'root'
  | 'scroll'
  | 'bubble'
  | 'system'
  | 'divider';
```

### Bubble.List Ref

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 外层列表根节点（类型亦导出为 `BubbleListRef`） | HTMLDivElement | 1.55.0（指向 root；此前为 scroll-box）；1.140.0（类型导出文档） |
| scrollBoxNativeElement | 可滚动容器 | HTMLDivElement | 1.55.0 |
| scrollTo | 滚动到指定位置或气泡 | `(options: { top?: number \| 'top' \| 'bottom'; offset?: number; key?: string \| number; behavior?: ScrollBehavior; block?: ScrollLogicalPosition }) => void` | 1.55.0（`top`；`offset` 兼容旧用法） |

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
