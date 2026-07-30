import { onScopeDispose, shallowRef, type Ref, type ShallowRef } from 'vue';
import type { MessageInfo, SimpleType } from '../use-x-chat';
import {
  ConversationStore,
  conversationStoreHelper,
  type ConversationData,
} from './store';

export type { ConversationData };
export { ConversationStore, conversationStoreHelper };

export interface XConversationConfig {
  defaultConversations?: ConversationData[];
  defaultActiveConversationKey?: string;
}

export interface XConversationsReturn {
  conversations: ShallowRef<ConversationData[]>;
  activeConversationKey: Ref<string>;
  setActiveConversationKey: (key: string) => boolean;
  addConversation: (
    conversation: ConversationData,
    placement?: 'prepend' | 'append',
  ) => boolean;
  removeConversation: (key: string) => boolean;
  setConversation: (key: string, conversation: ConversationData) => boolean;
  getConversation: (key: string) => ConversationData | undefined;
  setConversations: (list: ConversationData[]) => boolean;
  getMessages: <Message extends SimpleType = SimpleType>(
    key: string,
  ) => MessageInfo<Message>[];
}

/**
 * Multi-conversation list management (aligned with @ant-design/x-sdk useXConversations).
 * Pair with useXChat({ conversationKey: activeConversationKey }) for message isolation.
 */
export function useXConversations(config: XConversationConfig = {}): XConversationsReturn {
  const store = new ConversationStore(
    config.defaultConversations || [],
    config.defaultActiveConversationKey || '',
  );

  const conversations = shallowRef(store.getSnapshot());
  const activeConversationKey = shallowRef(store.getActiveConversationKey());

  const unsubscribe = store.subscribe(() => {
    conversations.value = store.getSnapshot();
    activeConversationKey.value = store.getActiveConversationKey();
  });

  onScopeDispose(() => {
    unsubscribe();
    store.destroy();
  });

  return {
    conversations,
    activeConversationKey,
    setActiveConversationKey: store.setActiveConversationKey,
    addConversation: store.addConversation,
    removeConversation: store.removeConversation,
    setConversation: store.setConversation,
    getConversation: store.getConversation,
    setConversations: store.setConversations,
    getMessages: store.getMessages,
  };
}

export default useXConversations;
