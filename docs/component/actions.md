
# Actions 操作列表

用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 何时使用

Actions 组件用于快速配置一些 AI 场景下所需要的操作按钮/功能。

## 代码演示

### 基本

:::demo 基础用法。

actions/basic

:::

### 更多菜单项

:::demo 支持嵌套菜单项和自定义点击事件。

actions/sub

:::

### 使用变体

:::demo 使用 `variant` 属性来设置不同的样式变体。

actions/variant

:::

### 预设操作

:::demo 通过 `actionRender` 组合 `Actions.Copy` / `Feedback` / `Item` / `Audio`。

actions/preset

:::

### 淡入动画

:::demo `fadeIn` / `fadeInLeft` 挂载淡入；切换类型后点 Re-Render 可重播。

actions/fade-in

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### ActionsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 包含多个操作项的列表 | ActionItem[] | - | - |
| rootClassName | 根节点样式类 | string | - | - |
| classNames | 语义化结构 className | Record<ActionsSemanticType, string> | - | 1.51.0；1.123.0（类型导出文档） |
| styles | 语义化结构 style | Record<ActionsSemanticType, CSSProperties> | - | 1.51.0；1.123.0（类型导出文档） |
| block | 子操作项是否占据一行 | boolean | false | - |
| onClick | Item 操作项被点击时的回调函数 | `function({ item, key, keyPath, domEvent })` | - | - |
| style | 根节点样式 | CSSProperties | - | - |
| variant | 变体（`border` 为 `filled` 的废弃别名） | `'borderless' \| 'outlined' \| 'filled' \| 'border'` | 'borderless' | 1.39.0（`outlined`/`filled`） |
| prefixCls | 样式类名的前缀 | string | - | - |
| fadeIn | 挂载时淡入 | boolean | `false` | 1.35.0 |
| fadeInLeft | 挂载时从左淡入（与 `fadeIn` 同时设置时优先） | boolean | `false` | 1.35.0 |
| dropdownProps | 透传给子菜单 Dropdown | `DropdownProps` | - | 1.35.0 |

自 `1.137.0` 起可从包入口 `import type { ActionsProps, ActionsRef }`（对齐 React Actions 包入口 Props / Ref 类型）。

自 `1.123.0` 起可从包入口 `import type { ActionsSemanticType }`（对齐 React Actions `SemanticType` 键集；预设项另有 `Actions*SemanticType`，见 `1.96.0`）。

```typescript | pure
type ActionsSemanticType = 'root' | 'item' | 'itemDropdown';
```

#### Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| item | 操作项 |
| itemDropdown | 带下拉的操作项触发器 |

### Actions Ref

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 根节点 DOM（类型亦导出为 `ActionsRef`） | HTMLDivElement | 1.61.0；1.137.0（类型导出文档） |

### ItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 自定义操作的唯一标识 | string | - | - |
| label | 自定义操作的显示标签 | string | - | - |
| icon | 自定义操作的图标 | VNode | - | - |
| disabled | 是否禁用 | boolean | `false` | - |
| danger | 危险样式（顶层操作项，对齐 React） | boolean | `false` | 1.94.0 |
| children | 子操作项 | ActionItem[] | - | - |
| subItems | 子操作项（对齐 React；与 `children` 同时传入时优先 `children`） | ActionItem[] | - | 1.92.0 |
| triggerSubMenuAction | 触发子菜单的操作 | `'hover' \| 'click'` | 'hover' | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: ActionItem) => void | - | - |
| actionRender | 自定义渲染操作项（可挂载预设组件） | `((item) => VNodeChild) \| VNodeChild` | - | 1.17.0 |

### SubItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 自定义操作的显示标签 | string | - | - |
| key | 自定义操作的唯一标识 | string | - | - |
| icon | 自定义操作的图标 | VNode | - | - |
| disabled | 是否禁用 | boolean | `false` | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: ActionItem) => void | - | - |
| danger | 语法糖，设置危险 icon | boolean | false | - |
| actionRender | 自定义渲染操作项 | `((item) => VNodeChild) \| VNodeChild` | - | 1.17.0 |

### 预设组件

| 组件 | 说明 | 版本 |
| --- | --- | --- |
| `Actions.Copy` | 复制文本（基于 Typography copyable） | 1.17.0 |
| `Actions.Feedback` | 点赞 / 点踩 | 1.17.0 |
| `Actions.Item` | 带 status 的通用操作按钮（loading / running / error） | 1.17.0 |
| `Actions.Audio` | 音频播放状态按钮 | 1.17.0 |

自 `1.84.0` 起可从包入口 `import type { ActionsFeedbackProps, ActionsItemProps, ActionsCopyProps, ActionsAudioProps }`（对齐 React 导出习惯）。
自 `1.96.0` 起可从包入口 `import type { ActionsFeedbackSemanticType, ActionsCopySemanticType, ActionsItemSemanticType, ActionsAudioSemanticType }`。

### Actions.Feedback

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 反馈状态值 | `'like' \| 'dislike' \| 'default'` | `default` | 1.17.0 |
| onChange / `@change` | 反馈状态变化回调 | `(value: 'like' \| 'dislike' \| 'default') => void` | - | 1.17.0 |
| classNames | 语义化 class | Record<'root' \| 'like' \| 'liked' \| 'dislike' \| 'disliked', string> | - | 1.96.0 |
| styles | 语义化 style | Record<'root' \| 'like' \| 'liked' \| 'dislike' \| 'disliked', CSSProperties> | - | 1.96.0 |

### Actions.Copy

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| text | 复制的文本 | string | `''` | 1.17.0 |
| icon | 复制按钮图标；可为 `[default, copied]` 二元组 | VNode \| [VNode, VNode] | - | 1.17.0 |
| classNames | 语义化 class | Record<'root', string> | - | 1.96.0 |
| styles | 语义化 style | Record<'root', CSSProperties> | - | 1.96.0 |

### Actions.Audio

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| status | 播放状态 | `'loading' \| 'error' \| 'running' \| 'default'` | `default` | 1.17.0 |
| classNames | 语义化 class | Record<'root' \| 'default' \| 'running' \| 'error' \| 'loading', string> | - | 1.96.0 |
| styles | 语义化 style | Record<'root' \| 'default' \| 'running' \| 'error' \| 'loading', CSSProperties> | - | 1.96.0 |

### Actions.Item

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| status | 状态 | `'loading' \| 'error' \| 'running' \| 'default'` | `default` | 1.17.0 |
| label | 自定义操作的显示标签 | string | - | 1.17.0 |
| defaultIcon | 默认状态图标 | VNode | - | 1.17.0 |
| runningIcon | 执行状态图标 | VNode | - | 1.17.0 |
| classNames | 语义化 class | Record<'root' \| 'default' \| 'running' \| 'error' \| 'loading', string> | - | 1.96.0 |
| styles | 语义化 style | Record<'root' \| 'default' \| 'running' \| 'error' \| 'loading', CSSProperties> | - | 1.96.0 |

### ActionItem

```typescript | pure
type ActionItem = ItemType | SubItemType;
```

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Actions"></ComponentTokenTable> -->

## 贡献者

<doc-contributors component-name="actions" :max-count="50" :show-view-all="true" />

