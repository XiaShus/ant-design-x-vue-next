import type { SSEOutput } from '../x-stream';
import type { MessageStatus } from '../use-x-chat';
import type { XModelMessage } from './types';

export type DeepSeekTransformInfo<ChatMessage = XModelMessage, Output = SSEOutput> = {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  responseHeaders?: Headers;
};

function contentAsString(content: XModelMessage['content'] | undefined): string {
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text: string }).text || '';
  }
  return '';
}

/**
 * Parse DeepSeek-compatible SSE/JSON chunks, mapping `reasoning_content` into `<think>` blocks.
 */
export function transformDeepSeekMessage<
  ChatMessage extends XModelMessage = XModelMessage,
  Output extends SSEOutput = SSEOutput,
>(info: DeepSeekTransformInfo<ChatMessage, Output>): ChatMessage {
  const { originMessage, chunk, responseHeaders } = info;
  let currentContent = '';
  let currentThink = '';
  let role = 'assistant';

  try {
    let message: any;
    const contentType = responseHeaders?.get('content-type') || '';
    const isSSE =
      contentType.includes('text/event-stream') || typeof (chunk as any)?.data === 'string';

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
          currentThink = choice.delta.reasoning_content || '';
          currentContent += choice.delta.content || '';
          role = choice.delta.role || role;
        } else if (choice?.message) {
          currentThink = choice.message.reasoning_content || '';
          currentContent += choice.message.content || '';
          role = choice.message.role || role;
        }
      });
    }
  } catch (error) {
    console.error('[DeepSeekChatProvider] transformMessage error', error);
  }

  let originMessageContent = contentAsString(originMessage?.content);
  let content = '';

  if (!originMessageContent && currentThink) {
    content = `\n\n<think>\n\n${currentThink?.replace?.(/^\n{0,2}/, '')}`;
  } else if (
    originMessageContent.includes('<think>') &&
    !originMessageContent.includes('</think>') &&
    currentContent
  ) {
    originMessageContent = originMessageContent.replace('<think>', '<think status="done">');
    content = `${originMessageContent?.replace?.(/[\s\n]{0,2}$/, '')}\n\n</think>\n\n${currentContent}`;
  } else {
    content = `${originMessageContent || ''}${currentThink}${currentContent}`;
  }

  return {
    ...(originMessage || {}),
    content,
    role: role || (originMessage as any)?.role || 'assistant',
  } as ChatMessage;
}
