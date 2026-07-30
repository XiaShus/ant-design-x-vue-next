import type { MessageStatus, SimpleType } from '../use-x-chat';

export interface ChatProviderConfig {
  /**
   * Base params merged by DefaultChatProvider.transformParams
   * (aligned with @ant-design/x-sdk request options.params).
   */
  params?: Record<string, unknown>;
}

export interface TransformMessageInfo<ChatMessage extends SimpleType, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  responseHeaders?: Headers;
}

/**
 * Base chat provider (Vue-adapted from @ant-design/x-sdk AbstractChatProvider).
 * Owns message transforms for useXChat; does not require React's AbstractXRequestClass.
 */
export abstract class AbstractChatProvider<
  ChatMessage extends SimpleType = SimpleType,
  Input = unknown,
  Output = unknown,
> {
  protected config: ChatProviderConfig;
  private _getMessagesFn?: () => ChatMessage[];

  constructor(config: ChatProviderConfig = {}) {
    this.config = config;
  }

  /**
   * Merge onRequest params with history / provider defaults before calling the agent.
   */
  abstract transformParams(requestParams: Partial<Input>, history?: ChatMessage[]): Input;

  /**
   * Convert onRequest params into the local (user) ChatMessage for rendering.
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage | ChatMessage[];

  /**
   * Convert streaming / final chunks into an assistant ChatMessage.
   */
  abstract transformMessage(info: TransformMessageInfo<ChatMessage, Output>): ChatMessage;

  getMessages(): ChatMessage[] {
    return this._getMessagesFn?.() ?? [];
  }

  injectGetMessages(getMessages: () => ChatMessage[]) {
    this._getMessagesFn = getMessages;
  }

  /** Ready-to-use transformMessage for useXChat */
  asTransformMessage() {
    return (info: TransformMessageInfo<ChatMessage, Output>) => this.transformMessage(info);
  }
}

export default AbstractChatProvider;
