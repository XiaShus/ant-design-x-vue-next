
# ThoughtChain 思维链

思维链组件用于可视化和追踪 Agent 对 Actions 和 Tools 的调用链。

## 何时使用

* 调试和跟踪复杂 Agent System 中的调用链
* 类似的链式场景中使用

## 代码演示

### 基本

:::demo 基础用法。

thought-chain/basic

:::

### 尺寸

:::demo ThoughtChain 有大、中、小三种尺寸。默认尺寸为中 - `middle`。

thought-chain/size

:::

### 节点状态

:::demo 思维链节点支持配置 `status` 属性来明显的表明当前节点的执行状态

thought-chain/status

:::

### 可折叠的

:::demo 节点配置 `collapsible`，并用 `defaultExpandedKeys` 控制初始展开

thought-chain/collapsible

:::

### 受控模式

:::demo 使用顶层 `expandedKeys` / `onExpand` 开启受控模式（旧版 `collapsible` 对象仍可用）

thought-chain/controlled

:::

### 折叠时销毁内容

:::demo 节点 `destroyOnHidden`（默认 `true`）控制折叠时是否从 DOM 卸载内容

thought-chain/destroy-on-hidden

:::

### 客制化

:::demo `items` 属性支持灵活的客制化配置；`line` 可设置连接线样式

thought-chain/customization

:::

### 嵌套使用

:::demo ThoughtChain 组件支持嵌套使用

thought-chain/nested 

:::

### tooltip 提示

:::demo 配置 `tooltip` 可开启对思维链节点内容区域的 tooltip 提示功能

thought-chain/tooltip

:::

### 简洁思维链

:::demo `ThoughtChain.Item` 独立复合组件，支持 `variant` / `status` / `blink` / `disabled`

thought-chain/simple

:::

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### ThoughtChainProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 思维节点集合（类型亦导出为 `ThoughtChainItemType`，对齐 React） | ThoughtChainItem[] / ThoughtChainItemType[] | - | 1.82.0（`ThoughtChainItemType` 导出） |
| defaultExpandedKeys | 初始化展开的节点 | string[] | - | 1.25.0 |
| expandedKeys | 当前展开的节点 | string[] | - | 1.25.0 |
| onExpand | 展开节点变化回调 | (expandedKeys: string[]) => void | - | 1.25.0 |
| collapsible | 是否可折叠（兼容旧 API，可与顶层 expand 合并） | boolean \| CollapsibleOptions | - | - |
| line | 线条样式，为 `false` 时不展示线条 | boolean \| 'solid' \| 'dashed' \| 'dotted' | `true` | 1.25.0 |
| classNames | 语义化结构的类名 | Record<'root' \| 'item' \| 'itemHeader' \| 'itemIcon' \| 'itemContent' \| 'itemFooter', string> | - | 1.58.0 起含 `root` / `itemIcon` |
| prefixCls | 自定义前缀 | string | - | - |
| rootClassName | 自定义根类名 | string | - | - |
| size | 尺寸 | 'large' \| 'middle' \| 'small' | 'middle' | - |
| styles | 语义化结构的样式 | Record<'root' \| 'item' \| 'itemHeader' \| 'itemIcon' \| 'itemContent' \| 'itemFooter', CSSProperties> | - | 1.58.0 起含 `root` / `itemIcon` |

### ThoughtChain Ref

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | 根节点 DOM | HTMLDivElement | 1.60.0 |

### ThoughtChainItem（items[] 节点）

自 `1.82.0` 起可从包入口 `import type { ThoughtChainItem, ThoughtChainItemType }`（`ThoughtChainItemType` 为 React 同名别名）。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 思维节点唯一标识符 | string | - | - |
| title | 思维节点标题 | VNode \| string | - | - |
| description | 思维节点描述 | VNode \| string | - | - |
| content | 思维节点内容 | VNode \| string | - | - |
| extra | 思维节点额外内容 | VNode \| string | - | - |
| footer | 思维节点脚注 | VNode \| string | - | - |
| icon | 思维节点图标 | VNode \| string \| number | - | - |
| status | 思维节点状态（`pending` 为兼容别名，等同 `loading`） | `'loading' \| 'success' \| 'error' \| 'abort'` | - | 1.26.0 |
| collapsible | 是否可折叠 | boolean | - | 1.25.0 |
| blink | 闪动效果 | boolean | - | 1.25.0 |
| destroyOnHidden | 隐藏时是否销毁内容节点 | boolean | `true` | 1.25.0 |
| tooltip | 思维节点 tooltip | boolean \| TooltipConfig | - | 1.100.0（类型导出） |

自 `1.100.0` 起可从包入口 `import type { TooltipConfig }`。

### ThoughtChain.Item

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | 自定义前缀 | string | - | 1.24.0 |
| icon | 思维链图标 | VNode \| string | - | 1.24.0 |
| title | 思维链标题 | VNode \| string | - | 1.24.0 |
| description | 思维链描述 | VNode \| string | - | 1.24.0 |
| status | 思维链状态 | `'loading' \| 'success' \| 'error' \| 'abort'` | - | 1.24.0 |
| variant | 变体配置 | `'solid' \| 'outlined' \| 'text'` | `solid` | 1.24.0 |
| blink | 闪动效果 | boolean | `false` | 1.24.0 |
| disabled | 是否禁用 | boolean | `false` | 1.24.0 |
| classNames | 语义化类名 | Record<'root' \| 'icon' \| 'title' \| 'description', string> | - | 1.24.0 |
| styles | 语义化样式 | Record<'root' \| 'icon' \| 'title' \| 'description', CSSProperties> | - | 1.24.0 |
| rootClassName | 根元素样式类名 | string | - | 1.24.0 |

#### ThoughtChain.Item Ref

| 名称 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| nativeElement | 根节点 DOM | HTMLElement | - | 1.71.0 |

### CollapsibleOptions

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultExpandedKeys | 初始化展开的节点 | string[] | - | 1.25.0 |
| expandedKeys | 当前展开的节点 | string[] | - | - |
| onExpand | 展开节点变化的回调函数 | (expandedKeys: string[]) => void | - | - |

### TooltipConfig

| 属性               | 说明                | 类型          | 默认值 | 版本 |
| ------------------ | ------------------- | ------------ | ------ | ---- |
| titleConfig        | 标题 Tooltip 配置    | [TooltipProps](https://www.antdv.com/components/tooltip-cn#api) | -      | -    |
| descriptionConfig  | 副标题 Tooltip 配置  | [TooltipProps](https://www.antdv.com/components/tooltip-cn#api) | -      | -    |

## Semantic DOM

<!-- <code src="./demo/_semantic.tsx" simplify="true"></code> -->

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="ThoughtChain"></ComponentTokenTable> -->
## 贡献者

<doc-contributors component-name="thought-chain" :max-count="50" :show-view-all="true" />
