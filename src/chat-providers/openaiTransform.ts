import type { SSEOutput } from '../x-stream';
import type { MessageStatus } from '../use-x-chat';
import type { XModelMessage } from './types';

export type OpenAITransformInfo<ChatMessage = XModelMessage, Output = SSEOutput> = {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  /** Optional response headers (content-type detection) */
  responseHeaders?: Headers;
};

/**
 * Parse OpenAI-compatible SSE / JSON chunks into cumulative assistant message.
 * Use as `transformMessage` in useXChat for enterprise LLM chat.
 */
export function transformOpenAIMessage<
  ChatMessage extends XModelMessage = XModelMessage,
  Output extends SSEOutput = SSEOutput,
>(info: OpenAITransformInfo<ChatMessage, Output>): ChatMessage {
  const { originMessage, chunk, responseHeaders } = info;
  let currentContent = '';
  let role = 'assistant';

  try {
    let message: any;
    const contentType = responseHeaders?.get('content-type') || '';
    const isSSE = contentType.includes('text/event-stream') || typeof (chunk as any)?.data === 'string';

    if (isSSE) {
      const data = (chunk as SSEOutput)?.data;
      if (data && String(data).trim() !== '[DONE]') {
        message = typeof data === 'string' ? JSON.parse(data) : data;
      }
    } else if (chunk) {
      message = chunk;
    }

    if (message) {
      message?.choices?.forEach((choice: any) => {
        if (choice?.delta) {
          currentContent += choice.delta.content || '';
          role = choice.delta.role || role;
        } else if (choice?.message) {
          currentContent += choice.message.content || '';
          role = choice.message.role || role;
        }
      });
    }
  } catch (error) {
    console.error('[OpenAIChatProvider] transformMessage error', error);
  }

  const prev =
    typeof originMessage?.content === 'string'
      ? originMessage.content
      : originMessage?.content && typeof originMessage.content === 'object'
        ? (originMessage.content as { text: string }).text || ''
        : '';

  return {
    ...(originMessage || {}),
    content: `${prev}${currentContent}`,
    role: (originMessage as any)?.role || role,
  } as ChatMessage;
}

/**
 * Build OpenAI chat messages array from local history + current user message.
 */
export function toOpenAIMessages(
  history: XModelMessage[],
  userMessage: string | XModelMessage,
): XModelMessage[] {
  const next =
    typeof userMessage === 'string'
      ? ({ role: 'user', content: userMessage } as XModelMessage)
      : userMessage;
  return [...history, next];
}
