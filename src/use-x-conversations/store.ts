import type { AnyObject } from '../_util/type';
import type { SimpleType } from '../use-x-chat';
import { getConversationMessages } from '../use-x-chat/conversationStore';

export interface ConversationData extends AnyObject {
  key: string;
}

/**
 * Registry of ConversationStore instances (aligned with @ant-design/x-sdk conversationStoreHelper).
 */
export const conversationStoreHelper = {
  _allConversationStores: new Map<string, ConversationStore>(),
  set(key: string, store: ConversationStore) {
    conversationStoreHelper._allConversationStores.set(key, store);
  },
  delete(key: string) {
    conversationStoreHelper._allConversationStores.delete(key);
  },
  getConversation(conversationKey: string) {
    const stores = Array.from(conversationStoreHelper._allConversationStores.values());
    for (const store of stores) {
      const conversation = store.getConversation(conversationKey);
      if (conversation) return conversation;
    }
    return undefined;
  },
};

export class ConversationStore {
  private conversations: ConversationData[] = [];
  private listeners: Array<() => void> = [];
  private storeKey: string;
  private activeConversationKey: string;

  constructor(defaultConversations: ConversationData[], defaultActiveConversationKey: string) {
    this.conversations = [...defaultConversations];
    this.storeKey = Math.random().toString(36).slice(2);
    conversationStoreHelper.set(this.storeKey, this);
    this.activeConversationKey = defaultActiveConversationKey;
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  setActiveConversationKey = (key: string) => {
    this.activeConversationKey = key;
    this.emit();
    return true;
  };

  setConversations = (list: ConversationData[]) => {
    this.conversations = [...list];
    this.emit();
    return true;
  };

  getConversation = (key: ConversationData['key']) => {
    return this.conversations.find((item) => item.key === key);
  };

  addConversation = (conversation: ConversationData, placement?: 'prepend' | 'append') => {
    if (this.getConversation(conversation.key)) return false;
    this.setConversations(
      placement === 'prepend'
        ? [conversation, ...this.conversations]
        : [...this.conversations, conversation],
    );
    return true;
  };

  setConversation = (key: ConversationData['key'], conversation: ConversationData) => {
    const exist = this.getConversation(key);
    if (!exist) return false;
    Object.assign(exist, conversation);
    this.setConversations([...this.conversations]);
    return true;
  };

  removeConversation = (key: ConversationData['key']) => {
    const index = this.conversations.findIndex((item) => item.key === key);
    if (index === -1) return false;
    this.conversations.splice(index, 1);
    this.setConversations([...this.conversations]);
    return true;
  };

  getMessages = <Message extends SimpleType = SimpleType>(key: ConversationData['key']) => {
    return getConversationMessages<Message>(key);
  };

  getSnapshot = () => this.conversations;

  getActiveConversationKey = () => this.activeConversationKey;

  subscribe = (callback: () => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  };

  destroy = () => {
    conversationStoreHelper.delete(this.storeKey);
    this.listeners = [];
  };
}
