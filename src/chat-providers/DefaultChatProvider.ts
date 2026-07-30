import type { SimpleType } from '../use-x-chat';
import type { ManualXRequestOptions } from '../x-request/manual-x-request';
import AbstractChatProvider, {
  type ChatProviderConfig,
  type TransformMessageInfo,
} from './AbstractChatProvider';

/**
 * Default chat provider (aligned with @ant-design/x-sdk DefaultChatProvider).
 * Pass-through transforms for simple string / object message stacks.
 */
export class DefaultChatProvider<
  ChatMessage extends SimpleType = SimpleType,
  Input = ChatMessage,
  Output = ChatMessage,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  constructor(config: ChatProviderConfig<Input, Output, ChatMessage> = {}) {
    super(config);
  }

  transformParams(
    requestParams: Partial<Input>,
    _history?: ChatMessage[],
    options?: ManualXRequestOptions<Input, Output, ChatMessage>,
  ): Input {
    if (requestParams !== null && typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      ...(options?.params || this.request?.options?.params || {}),
      ...(this.config.params || {}),
      ...(requestParams || {}),
    } as Input;
  }

  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    return requestParams as unknown as ChatMessage;
  }

  transformMessage(info: TransformMessageInfo<ChatMessage, Output>): ChatMessage {
    const { chunk, chunks, originMessage } = info;

    if (chunk) {
      return chunk as unknown as ChatMessage;
    }

    if (Array.isArray(chunks)) {
      const last = chunks.length > 0 ? chunks[chunks.length - 1] : undefined;
      return originMessage ? originMessage : (last as unknown as ChatMessage);
    }

    return chunks as unknown as ChatMessage;
  }
}

export default DefaultChatProvider;
