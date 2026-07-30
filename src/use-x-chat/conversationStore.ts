import type { MessageInfo, SimpleType } from './use-x-chat';

export type ConversationKey = string | symbol;

/**
 * In-memory multi-conversation message store for useXChat.
 * Isolates message lists by conversationKey for enterprise multi-tab chat.
 */
const store = new Map<ConversationKey, MessageInfo<any>[]>();

export function getConversationMessages<Message extends SimpleType>(
  key: ConversationKey,
): MessageInfo<Message>[] {
  return (store.get(key) as MessageInfo<Message>[] | undefined)?.slice() || [];
}

export function setConversationMessages<Message extends SimpleType>(
  key: ConversationKey,
  messages: MessageInfo<Message>[],
): void {
  store.set(key, messages.slice());
}

export function clearConversation(key: ConversationKey): void {
  store.delete(key);
}

export function clearAllConversations(): void {
  store.clear();
}
