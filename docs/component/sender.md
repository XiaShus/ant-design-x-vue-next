# Sender 输入框

用于聊天的输入框组件。

## 何时使用

需要构建一个对话场景下的输入框

## 代码演示

### 基本用法

<ClientOnly>

:::demo 基础用法，受控进行状态管理。自定义触发器。

sender/basic

:::

</ClientOnly>

### 提交用法

<ClientOnly>

:::demo 通过 `submitType` 控制换行与提交模式。

sender/submitType

:::

</ClientOnly>

### 语音输入

<ClientOnly>

:::demo 语音输入，需要用户同意麦克风权限。

sender/speech

:::

</ClientOnly>

### 语音输入图标

<ClientOnly>

:::demo 调整语音输入显示的图标，包含正在录音的图标。

sender/speechIcon

:::

</ClientOnly>

### 自定义语音输入

<ClientOnly>

:::demo 自定义语音逻辑，从而实现调用三方库的语音识别功能。

sender/speechCustom

:::

</ClientOnly>

### 自定义后缀 suffix

<ClientOnly>

:::demo 通过 `suffix` 自定义操作区（对齐 React 2.x；原 `actions` 仍可用）。

sender/suffix

:::

</ClientOnly>

### 自定义按钮（actions，兼容）

<ClientOnly>

:::demo `actions` 为历史 API，与 `suffix` 等价；同时设置时以 `suffix` 为准。

sender/actions

:::

</ClientOnly>

### 模式开关 Switch

:::demo `Sender.Switch`：思考 / 搜索等模式切换（受控与非受控）。

sender/switch

:::

### 词槽填空

<ClientOnly>

:::demo 通过 `slotConfig` 与 `skill` 构建结构化输入；SlotTextArea 已对齐 React 的 contentEditable 根编辑区（text/content 可编辑，input/select/tag/custom 为非编辑嵌入节点）；支持 `getValue` / `insert` / `clear`、纯文本粘贴与 `onSubmit(message, slotConfig, skill)`。

sender/slot-filling

:::

</ClientOnly>

### 展开面板

<ClientOnly>

:::demo 使用 `header` 自定义文件上传示例。

sender/header

:::

</ClientOnly>

### 引用

<ClientOnly>

:::demo 使用 `header` 做引用效果。

sender/headerFixed

:::

</ClientOnly>

### 自定义底部内容

:::demo 使用 `footer` 自定义底部内容。

sender/footer

:::

### 自定义输入框

:::demo 使用 `components.input` 自定义输入框。

sender/custom-input

:::

### 调整样式

<ClientOnly>

:::demo 通过 `actions` 属性，调整默认样式。

sender/sendStyle

:::

</ClientOnly>

### 黏贴文件

<ClientOnly>

:::demo 使用 `onPasteFile` 获取黏贴的文件，配合 Attachments 进行文件上传。

sender/pasteImage

:::

</ClientOnly>

### 聚焦

<ClientOnly>

:::demo 使用 `ref` 选项控制聚焦。

sender/focus

:::

</ClientOnly>

## API

<!-- 通用属性参考：[通用属性](/docs/react/common-props) -->

### SenderProps

| 属性           | 说明                                                                        | 类型                                                                   | 默认值                  | 版本 |
| -------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------- | ---- |
| suffix         | 自定义操作区（React 2.x 主 API），设为 `false` 可隐藏                        | VNode \| (oriNode, info: \{ components: ActionsComponents \}) => VNode \| false | - | 1.33.0 |
| actions        | 同 `suffix`（兼容旧名，已弃用）                                             | VNode \| (oriNode, info: \{ components: ActionsComponents \}) => VNode \| false | - | - |
| allowSpeech    | 是否允许语音输入                                                            | boolean \| SpeechConfig                                                | false                   | -    |
| classNames     | 样式类名                                                                    | [见下](#semantic-dom)                                                  | -                       | -    |
| components     | 自定义组件，input默认为[Input.TextArea](https://www.antdv.com/components/input-cn#api)，确保在自定义输入组件时，按照 `Input.TextArea` 实现所有必要的 props，以避免功能不全。| Record<'input', ComponentType> | -   | -    |
| defaultValue   | 输入框默认值                                                                | string                                                                 | -                       | -    |
| disabled       | 是否禁用                                                                    | boolean                                                                | false                   | -    |
| loading        | 是否加载中                                                                  | boolean                                                                | false                   | -    |
| header         | 头部面板                                                                    | VNode \| () => VNode                                                   | -                       | -    |
| prefix         | 前缀内容                                                                    | VNode \| () => VNode                                                   | -                       | -    |
| footer         | 底部内容                                                                    | VNode \| FooterRender                                                  | -                       | 1.102.0（`FooterRender` 导出） |
| readOnly       | 是否让输入框只读                                                            | boolean                                                                | false                   | -    |
| rootClassName  | 根元素样式类                                                                | string                                                                 | -                       | -    |
| styles         | 语义化定义样式                                                              | [见下](#semantic-dom)                                                  | -                       | -    |
| submitType     | 提交模式；`false` 禁用回车提交                                              | SubmitType                                                             | `enter`                 | 1.98.0（类型导出） |
| value(v-model) | 输入框值                                                                    | string                                                                 | -                       | -    |
| slotConfig     | 词槽配置，设置后启用结构化 SlotTextArea（contentEditable）输入                | `SlotConfigType[]`                                                     | -                       | 1.22.0 |
| skill          | 技能芯片，显示在词槽输入起始位置                                              | `SkillType`                                                            | -                       | 1.22.0 |
| onSubmit       | 点击发送按钮的回调                                                          | (message: string, slotConfig?: SlotConfigType[], skill?: SkillType) => void | -                  | -    |
| onChange       | 输入框值改变的回调；词槽模式下 `slotConfig` 项含当前 `value`（`SlotConfigWithValue`） | (value: string, event?: ChangeEvent, slotConfig?: SlotConfigWithValue[], skill?: SkillType) => void | - | 1.108.0（`SlotConfigWithValue` 导出） |
| onCancel       | 点击取消按钮的回调                                                          | () => void                                                             | -                       | -    |
| onPasteFile    | 黏贴文件的回调                                                              | (firstFile: File, files: FileList) => void                             | -                       | -    |
| autoSize       | 自适应内容高度，可设置为 true \| false 或对象：\{ minRows: 2, maxRows: 6 \} | boolean \| \{ minRows?: number; maxRows?: number \}                    | \{ maxRows: 8 \}        | -    |

```typescript | pure
type SpeechConfig = {
  // 当设置 `recording` 时，内置的语音输入功能将会被禁用。
  // 交由开发者实现三方语音输入的功能。
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
  audioIcon?: ButtonProps['icon'] | VNode;
  audioDisabledIcon?: ButtonProps['icon'] | VNode;
  audioRecordingIcon?: ButtonProps['icon'] | VNode;
};
```

自 `1.83.0` 起可从包入口 `import type { SenderComponents, ActionsComponents }`（对齐 React Sender 模块导出）。
自 `1.98.0` 起可从包入口 `import type { SubmitType }`（`'enter' | 'shiftEnter' | false`）。
自 `1.102.0` 起可从包入口 `import type { FooterRender }`。

```typescript | pure
type ActionsComponents = {
  SendButton: InstanceType<ButtonProps>;
  ClearButton: InstanceType<ButtonProps>;
  LoadingButton: InstanceType<ButtonProps>;
  SpeechButton: InstanceType<ButtonProps>;
};
type FooterRender = (info: { components: ActionsComponents }) => VNode;
```

自 `1.104.0` 起可从包入口 `import type { SlotConfigTextType, SlotConfigInputType, SlotConfigSelectType, SlotConfigTagType, SlotConfigCustomType, SlotConfigContentType }`（`SlotConfigType` 联合成员）。
自 `1.108.0` 起可从包入口 `import type { SlotConfigBaseType, SlotConfigWithValue }`。

```typescript | pure
type SlotConfigType =
  | SlotConfigTextType
  | SlotConfigInputType
  | SlotConfigSelectType
  | SlotConfigTagType
  | SlotConfigCustomType
  | SlotConfigContentType;

type SlotConfigWithValue = SlotConfigType & { value?: string };

type SkillType = {
  title?: VNode;
  value: string;
  toolTip?: TooltipProps;
  closable?: boolean | { closeIcon?: VNode; onClose?: (e: MouseEvent) => void; disabled?: boolean };
};
```

### Sender Slots

| 插槽名  | 说明     | 类型                                                                                                                                                                                                  |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| header  | 头部面板 | -                                                                                                                                                                                                     |
| prefix  | 前缀内容 | _                                                                                                                                                                                                     |
| suffix  | 操作区（推荐） | \{ ori: VNode; info: \{ components: \{ SendButton: InstanceType\<Button\>; ClearButton: InstanceType\<Button\>; LoadingButton: InstanceType\<Button\>; SpeechButton: InstanceType\<Button\>; \} \} \} |
| actions | 同 `suffix`（兼容） | 同上 |
| footer  | 底部内容 | \{ info: \{ components: \{ SendButton: InstanceType\<Button\>; ClearButton: InstanceType\<Button\>; LoadingButton: InstanceType\<Button\>; SpeechButton: InstanceType\<Button\>; \} \} \}             |

#### Sender Ref

| 属性          | 说明     | 类型                                                                       | 默认值 | 版本 |
| ------------- | -------- | -------------------------------------------------------------------------- | ------ | ---- |
| nativeElement | 外层容器 | `HTMLDivElement`                                                           | -      | -    |
| inputElement  | 输入元素（纯文本为 textarea；词槽模式为 SlotTextArea 根节点） | `HTMLElement \| null` | - | 1.52.0 |
| focus         | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' \| 'slot', key?: string }) | - | - |
| blur          | 取消焦点 | () => void                                                                 | -      | -    |
| getValue      | 获取词槽合成值（slot 模式） | () => \{ value: string; slotConfig: SlotConfigWithValue[]; skill?: SkillType \} | - | 1.22.0；1.108.0（`SlotConfigWithValue`） |
| insert        | 插入文本或词槽；`position: 'cursor'` 按选区插入，`replaceCharacters` 可删除光标前触发符（如 `/`） | `((value: string) => void) & ((slotConfig: SlotConfigType[], position?: 'start' \| 'end' \| 'cursor', replaceCharacters?: string, preventScroll?: boolean) => void)` | - | 1.41.0（字符串）；1.42.0（cursor / replaceCharacters） |
| clear         | 清空输入（slot 模式重置插入项） | () => void | - | 1.22.0 |

### Sender.Header

自 `1.95.0` 起可从包入口 `import type { SenderHeaderProps }`（对齐 React）。

| 属性         | 说明                                        | 类型                    | 默认值 | 版本 |
| ------------ | ------------------------------------------- | ----------------------- | ------ | ---- |
| children     | 面板内容                                    | VNode                   | -      | -    |
| closable     | 是否可关闭                                  | boolean                 | true   | -    |
| forceRender  | 强制渲染，在初始化便需要 ref 内部元素时使用 | boolean                 | false  | -    |
| open         | 是否展开                                    | boolean                 | -      | -    |
| title        | 标题                                        | VNode                   | -      | -    |
| onOpenChange | 展开状态改变的回调                          | (open: boolean) => void | -      | -    |
| classNames | 语义化 class（`header` / `content`） | Record<'header' \| 'content', string> | - | 1.95.0（文档） |
| styles | 语义化 style（`header` / `content`） | Record<'header' \| 'content', CSSProperties> | - | 1.95.0（文档） |

### Sender.Switch

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 受控选中状态 | boolean | - | 1.18.0 |
| defaultValue | 非受控默认选中 | boolean | `false` | 1.18.0 |
| icon | 图标 | VNode | - | 1.18.0 |
| checkedChildren | 选中时文案 | VNode | - | 1.18.0 |
| unCheckedChildren | 未选中时文案 | VNode | - | 1.18.0 |
| loading | 加载中 | boolean | `false` | 1.18.0 |
| disabled | 禁用 | boolean | `false` | 1.18.0 |
| onChange / `@change` | 状态变化回调 | `(checked: boolean) => void` | - | 1.18.0 |

#### Sender.Switch Ref

| 名称 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| nativeElement | 外层容器 | `HTMLDivElement` | - | 1.70.0 |

## Semantic DOM

<vp-semantic component="Sender"></vp-semantic>

## 主题变量（Design Token）

<!-- <ComponentTokenTable component="Sender"></ComponentTokenTable> -->

## 贡献者

<doc-contributors component-name="sender" :max-count="50" :show-view-all="true" />
