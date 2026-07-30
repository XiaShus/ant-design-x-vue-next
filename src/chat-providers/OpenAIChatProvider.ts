import type { SSEOutput } from '../x-stream';
import AbstractChatProvider, { type TransformMessageInfo } from './AbstractChatProvider';
import { transformOpenAIMessage, toOpenAIMessages } from './openaiTransform';
import type { XModelMessage, XModelParams } from './types';

/**
 * OpenAI-compatible chat provider (aligned with @ant-design/x-sdk OpenAIChatProvider).
 * Extends AbstractChatProvider; use with useXChat via `provider` or `asTransformMessage()`.
 */
export class OpenAIChatProvider<
  ChatMessage extends XModelMessage = XModelMessage,
  Input extends XModelParams = XModelParams,
  Output extends SSEOutput = SSEOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  /**
   * Vue useXChat usually passes `{ message }`; SDK-style callers may pass `{ messages }`.
   */
  transformLocalMessage(requestParams: Partial<Input>): ChatMessage | ChatMessage[] {
    const raw = requestParams as Partial<Input> & { message?: string | ChatMessage };
    if (raw.messages?.length) {
      return raw.messages as ChatMessage[];
    }
    if (typeof raw.message === 'string') {
      return { role: 'user', content: raw.message } as ChatMessage;
    }
    if (raw.message && typeof raw.message === 'object') {
      return raw.message as ChatMessage;
    }
    return { role: 'user', content: '' } as ChatMessage;
  }

  /**
   * Prefer history already held by useXChat (includes the just-appended user message).
   * Falls back to merging history + local message when called standalone.
   */
  transformParams(requestParams: Partial<Input>, history?: ChatMessage[]): Input {
    const hist = history ?? this.getMessages();
    const local = this.transformLocalMessage(requestParams);
    const userMsg = (Array.isArray(local) ? local[local.length - 1] : local) as ChatMessage;
    const messages =
      (requestParams.messages?.length ? requestParams.messages : undefined) ??
      (hist.length ? hist : toOpenAIMessages([], userMsg));

    return {
      ...(this.config.params || {}),
      ...requestParams,
      stream: requestParams.stream ?? true,
      messages,
    } as Input;
  }

  transformMessage(info: TransformMessageInfo<ChatMessage, Output>): ChatMessage {
    return transformOpenAIMessage(info);
  }
}

export default OpenAIChatProvider;
