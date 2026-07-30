# useXConversations 多会话管理

管理会话列表与当前激活会话，并与 `useXChat` 的 `conversationKey` / 消息隔离存储对接。

## 何时使用

需要侧边栏会话列表、切换会话、新建/删除会话，且消息按会话隔离时。

## 代码演示

### 基本

:::demo 会话列表与消息隔离。

use-x-conversations/basic

:::

## API

```ts
import { useXConversations, useXChat } from 'ant-design-x-vue-next';

const {
  conversations,
  activeConversationKey,
  setActiveConversationKey,
  addConversation,
  removeConversation,
} = useXConversations({
  defaultConversations: [{ key: 'c1', label: '新对话' }],
  defaultActiveConversationKey: 'c1',
});

const { messages, onRequest } = useXChat({
  agent,
  conversationKey: activeConversationKey, // Ref 亦可
});
```

### XConversationConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultConversations | 初始会话列表（每项需含唯一 `key`） | `ConversationData[]` | `[]` |
| defaultActiveConversationKey | 初始激活会话 key | `string` | `''` |

### 返回值

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| conversations | 会话列表 | `ShallowRef<ConversationData[]>` |
| activeConversationKey | 当前激活 key | `Ref<string>` |
| setActiveConversationKey | 切换激活会话 | `(key) => boolean` |
| addConversation | 新增会话 | `(conversation, placement?) => boolean` |
| removeConversation | 删除会话 | `(key) => boolean` |
| setConversation | 更新会话元数据 | `(key, conversation) => boolean` |
| getConversation | 按 key 读取 | `(key) => ConversationData \| undefined` |
| setConversations | 整体替换列表 | `(list) => boolean` |
| getMessages | 读取该会话已持久化的消息（`conversationStore`） | `(key) => MessageInfo[]` |

`ConversationData` 至少包含 `key: string`，其余字段（如 `label`）可自由扩展。

## 贡献者

<doc-contributors component-name="use-x-conversations" :max-count="50" :show-view-all="true" />
