import type { SSEOutput } from '../x-stream';
import type { MessageStatus } from '../use-x-chat';
import { transformOpenAIMessage, toOpenAIMessages, type OpenAITransformInfo } from './openaiTransform';
import type { XModelMessage, XModelParams } from './types';

/**
 * OpenAI-compatible chat provider helpers (aligned with @ant-design/x-sdk OpenAIChatProvider).
 * Works with the existing Vue agent / useXChat stack via transformMessage.
 */
export class OpenAIChatProvider<
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

  transformMessage(info: OpenAITransformInfo<ChatMessage, Output>): ChatMessage {
    return transformOpenAIMessage(info);
  }

  /** Ready-to-use transformMessage for useXChat */
  asTransformMessage() {
    return (info: {
      originMessage?: ChatMessage;
      chunk: Output;
      chunks: Output[];
      status: MessageStatus;
    }) => this.transformMessage(info);
  }
}

export default OpenAIChatProvider;
