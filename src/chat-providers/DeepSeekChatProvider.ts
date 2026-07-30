import type { SSEOutput } from '../x-stream';
import AbstractChatProvider, { type TransformMessageInfo } from './AbstractChatProvider';
import { toOpenAIMessages } from './openaiTransform';
import { transformDeepSeekMessage } from './deepSeekTransform';
import type { XModelMessage, XModelParams } from './types';

/**
 * DeepSeek-compatible chat provider (aligned with @ant-design/x-sdk DeepSeekChatProvider).
 * Maps `reasoning_content` into `<think>` blocks for Think component rendering.
 */
export class DeepSeekChatProvider<
  ChatMessage extends XModelMessage = XModelMessage,
  Input extends XModelParams = XModelParams,
  Output extends SSEOutput = SSEOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
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
    return transformDeepSeekMessage(info);
  }
}

export default DeepSeekChatProvider;
