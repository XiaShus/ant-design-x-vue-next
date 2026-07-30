
# useXChat 数据管理

配合 Agent hook 进行对话数据管理。

## 何时使用

通过 Agent 进行会话数据管理，并产出供页面渲染使用的数据。

## 代码演示

### 基本

:::demo 基础用法。

use-x-chat/basic

:::

### 流式输出

:::demo 使用流式输出更新内容。

use-x-chat/stream

:::

### 重新生成

:::demo 助手气泡底部用 `Actions` 接 `onReload`（原地重试）与复制，不重复追加用户消息。

use-x-chat/reload

:::

### 多项建议

:::demo 通过定制能力，返回多个推荐内容。

use-x-chat/suggestions

:::

### 模型接入

:::demo 接入云服务平台，可发送消息、处理数据、终止消息。

use-x-chat/model

:::

## API

```tsx | pure
type useXChat<
  AgentMessage,
  ParsedMessage = AgentMessage,
  Input = RequestParams<AgentMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<AgentMessage, ParsedMessage>) => XChatConfigReturnType;
```

### XChatConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| agent | 通过 `useXAgent` 生成的 `agent`，当使用 `onRequest` 方法时, `agent` 参数是必需的。 | XAgent | - |  |
| conversationKey | 多会话隔离 key，切换时自动持久化/恢复消息列表；可传 Ref（配合 useXConversations） | `MaybeRefOrGetter<string \| symbol>` | - |  |
| defaultMessages | 默认展示信息 | { status, message }[] | - |  |
| parser | 将 AgentMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 AgentMessage。支持将一条 AgentMessage 转换成多条 ParsedMessage | (message: AgentMessage) => BubbleMessage \| BubbleMessage[] | - |  |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | AgentMessage \| () => AgentMessage | - |  |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | AgentMessage \| () => AgentMessage | - |  |
| transformMessage | 可在更新数据时对`messages`做转换，同时会更新到`messages` | (info: {originMessage?: AgentMessage,chunk: Output,chunks: Output[],status: MessageStatus}) => AgentMessage| - | - |
| provider | `AbstractChatProvider` 实例；未设置 `transformMessage` 时使用其 `transformMessage`，请求前调用 `transformParams` | `AbstractChatProvider` | - | - |
| transformStream | 可选的转换函数，用于处理流数据 | `XStreamOptions<Output>['transformStream']` | - | - |
| resolveAbortController | `AbortController` 控制器，用于控制流状态 | (abortController: AbortController) => void| - | - |

### XChatConfigReturnType

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| messages | 当前管理的内容 | AgentMessages[] |  |
| parsedMessages | 经过 `parser` 转译过的内容 | ParsedMessages[] |  |
| onRequest | 添加一条 Message，并且触发请求，若无`key`为`message`的数据则会将整个数据做为消息处理 | (requestParams: AgentMessage \| RequestParams) => void |  |
| onReload | 按 id 原地重新生成（不重复追加用户消息）；省略第二参时复用上一条 `local` 用户消息 | `(id, requestParams?) => void` |  |
| abort | 中止当前进行中的请求；已流式输出的内容会保留，状态置为 `abort` | () => void |  |
| setMessages | 直接修改 messages，不会触发请求 | (messages: { message, status }[]) => void |  |
| setMessage | 按 id 合并更新单条消息（编辑内容 / 状态等） | `(id, patch) => boolean` |  |
| removeMessage | 按 id 删除单条消息 | `(id) => boolean` |  |
| isRequesting | 当前会话是否正在请求 | `ComputedRef<boolean>` |  |
| conversationKey | 当前会话 key | `Ref<string \| symbol>` |  |

`MessageStatus`：`local` | `loading` | `updating` | `success` | `error` | `abort`。

### OpenAI / DeepSeek Provider

```ts
import {
  useXChat,
  useXAgent,
  OpenAIChatProvider,
  DeepSeekChatProvider,
} from 'ant-design-x-vue-next';

const provider = new OpenAIChatProvider({ params: { model: 'gpt-4o-mini' } });
// DeepSeek：reasoning_content → <think> 块，可配合 Think 组件
// const provider = new DeepSeekChatProvider();

const [agent] = useXAgent({ baseURL: '/api/chat', model: 'gpt-4o-mini' });
const { onRequest, abort, messages } = useXChat({
  agent: agent.value,
  conversationKey: 'session-1',
  // 推荐：直接传 provider（自动 injectGetMessages + transformMessage/Params）
  provider,
  // 或：transformMessage: provider.asTransformMessage(),
});
```

多会话列表请配合 [useXConversations](/component/use-x-conversations)。

### MCP Client

```ts
import { XMCPClient } from 'ant-design-x-vue-next';

const client = XMCPClient('https://your-mcp-host/tools', {
  headers: { Authorization: 'Bearer xxx' },
});
const tools = await client.tools();
```

### RequestParams

继承 [XRequestParams](/component/x-request#xrequestparams)。

| 属性    | 说明           | 类型         | 默认值 | 版本 |
| ------- | -------------- | ------------ | ------ | ---- |
| message | 当前消息的内容 | AgentMessage | -      | -    |
## 贡献者

<doc-contributors component-name="use-x-chat" :max-count="50" :show-view-all="true" />
