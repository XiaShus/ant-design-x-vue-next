import type { SSEOutput } from '../x-stream';
import type { MessageStatus } from '../use-x-chat';
import { toOpenAIMessages } from './openaiTransform';
import { transformDeepSeekMessage } from './deepSeekTransform';
import type { XModelMessage, XModelParams } from './types';

/**
 * DeepSeek-compatible chat provider helpers (aligned with @ant-design/x-sdk DeepSeekChatProvider).
 * Maps `reasoning_content` into `<think>` blocks for Think component rendering.
 */
export class DeepSeekChatProvider<
  ChatMessage extends XModelMessage = XModelMessage,
  Input extends XModelParams = XModelParams,
  Output extends SSEOutput = SSEOutput,
> {
  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    const messages = (requestParams.messages ?? []) as XModelMessage[];
    const last = messages[messages.length - 1];
    return (last || { role: 'user', content: '' }) as ChatMessage;
  }

  transformParams(requestParams: Partial<Input>, history: ChatMessage[]): Input {
    const userMsg = this.transformLocalMessage(requestParams);
    return {
      ...requestParams,
      stream: requestParams.stream ?? true,
      messages: toOpenAIMessages(history, userMsg),
    } as Input;
  }

  transformMessage(info: {
    originMessage?: ChatMessage;
    chunk: Output;
    chunks: Output[];
    status: MessageStatus;
    responseHeaders?: Headers;
  }): ChatMessage {
    return transformDeepSeekMessage(info);
  }

  asTransformMessage() {
    return (info: {
      originMessage?: ChatMessage;
      chunk: Output;
      chunks: Output[];
      status: MessageStatus;
      responseHeaders?: Headers;
    }) => this.transformMessage(info);
  }
}

export default DeepSeekChatProvider;
