import { computed, ref } from 'vue';
import { XAgent } from '../use-x-agent';
import useSyncState from './useSyncState';
import { useEventCallback } from '../_util/hooks/use-event-callback';
import { type SSEOutput, XStreamOptions } from '../x-stream';
import { XRequestParams } from '../x-request';
import type { AnyObject } from '../_util/type';

export type SimpleType = string | number | boolean | object;

export type MessageStatus = 'local' | 'loading' | 'success' | 'error' | 'abort';

type RequestPlaceholderFn<Message extends SimpleType> = (
  message: Message,
  info: { messages: Message[] },
) => Message;

type RequestFallbackFn<Message extends SimpleType> = (
  message: Message,
  info: { error: Error; messages: Message[] },
) => Message | Promise<Message>;

type TransformMessageFn<Message, Output> = (info: {
  originMessage?: Message;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
}) => Message;

type RequestParams<Message> = Omit<XRequestParams, 'message'> & {
  message: Message;
} & AnyObject;

export interface XChatConfig<
  AgentMessage extends SimpleType = string,
  BubbleMessage extends SimpleType = AgentMessage,
  Input = AgentMessage,
  Output = AgentMessage,
> {
  agent?: XAgent<AgentMessage, Input, Output>;

  defaultMessages?: DefaultMessageInfo<AgentMessage>[];

  /** Convert agent message to bubble usage message type */
  parser?: (message: AgentMessage) => BubbleMessage | BubbleMessage[];

  requestPlaceholder?: AgentMessage | RequestPlaceholderFn<AgentMessage>;
  requestFallback?: AgentMessage | RequestFallbackFn<AgentMessage>;
  transformMessage?: TransformMessageFn<AgentMessage, Output>;
  transformStream?: XStreamOptions<AgentMessage>['transformStream'];
  resolveAbortController?: (abortController: AbortController) => void;
}

export interface MessageInfo<Message extends SimpleType> {
  id: number | string;
  message: Message;
  status: MessageStatus;
}

export type DefaultMessageInfo<Message extends SimpleType> = Pick<MessageInfo<Message>, 'message'> &
  Partial<Omit<MessageInfo<Message>, 'message'>>;

export type RequestResultObject<Message> = {
  message: Message | Message[];
  status: MessageStatus;
};

export type StandardRequestResult<Message extends SimpleType> = Omit<
  RequestResultObject<Message>,
  'message' | 'status'
> & {
  message: Message;
  status?: MessageStatus;
};

function toArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

function isAbortLikeError(error: Error) {
  return (
    error.name === 'AbortError' ||
    error.name === 'TimeoutError' ||
    error.name === 'StreamTimeoutError'
  );
}

export default function useXChat<
  AgentMessage extends SimpleType = string,
  ParsedMessage extends SimpleType = AgentMessage,
  Input = RequestParams<AgentMessage>,
  Output = SSEOutput,
>(config: XChatConfig<AgentMessage, ParsedMessage, Input, Output>) {
  const {
    defaultMessages,
    agent,
    requestFallback,
    requestPlaceholder,
    parser,
    transformMessage,
    transformStream,
    resolveAbortController,
  } = config;

  // ========================= Agent Messages =========================
  const idRef = ref(0);
  const abortControllerRef = ref<AbortController | null>(null);

  const defaultMessage = computed<MessageInfo<AgentMessage>[]>(() =>
    (defaultMessages || []).map((info, index) => ({
      id: `default_${index}`,
      status: 'local' as const,
      ...info,
    })),
  );
  const [messages, setMessages] = useSyncState<MessageInfo<AgentMessage>[]>(
    defaultMessage.value,
    () => {},
  );

  const createMessage = (message: AgentMessage, status: MessageStatus) => {
    const msg: MessageInfo<AgentMessage> = {
      id: `msg_${idRef.value}`,
      message,
      status,
    };

    idRef.value += 1;

    return msg;
  };

  // ========================= BubbleMessages =========================
  const parsedMessages = computed(() => {
    const list: MessageInfo<ParsedMessage>[] = [];
    messages.value.forEach((agentMsg) => {
      const rawParsedMsg = parser ? parser(agentMsg.message) : agentMsg.message;
      const bubbleMsgs = toArray(rawParsedMsg as ParsedMessage);

      bubbleMsgs.forEach((bubbleMsg, bubbleMsgIndex) => {
        let key = agentMsg.id;
        if (bubbleMsgs.length > 1) {
          key = `${key}_${bubbleMsgIndex}`;
        }

        list.push({
          id: key,
          message: bubbleMsg,
          status: agentMsg.status,
        });
      });
    });

    return list;
  });

  // ============================ Request =============================
  const getFilteredMessages = (msgs: MessageInfo<AgentMessage>[]) =>
    msgs
      .filter((info) => info.status !== 'loading' && info.status !== 'error')
      .map((info) => info.message);

  const getRequestMessages = () => getFilteredMessages(messages.value);

  const getTransformMessage: TransformMessageFn<AgentMessage, Output> = (params) => {
    const { chunk, chunks, originMessage } = params;
    if (typeof transformMessage === 'function') {
      return transformMessage(params);
    }

    if (chunk) {
      return chunk as unknown as AgentMessage;
    }

    if (Array.isArray(chunks)) {
      const last = chunks?.length > 0 ? chunks?.[chunks?.length - 1] : undefined;
      return originMessage ? originMessage : (last as unknown as AgentMessage);
    }

    return chunks as unknown as AgentMessage;
  };

  const abort = useEventCallback(() => {
    abortControllerRef.value?.abort();
  });

  const onRequest = useEventCallback(
    (requestParams: RequestParams<AgentMessage> | Input | SimpleType) => {
      if (!agent)
        throw new Error(
          'The agent parameter is required when using the onRequest method in an agent generated by useXAgent.',
        );

      let loadingMsgId: number | string | null = null;
      let message: AgentMessage;
      let otherRequestParams = {};

      if (requestParams && typeof requestParams === 'object' && 'message' in requestParams) {
        const { message: requestParamsMessage, ...other } =
          requestParams as RequestParams<AgentMessage>;
        message = requestParamsMessage;
        otherRequestParams = other;
      } else {
        message = requestParams as AgentMessage;
      }

      setMessages((ori) => {
        let nextMessages = [...ori, createMessage(message, 'local')];
        if (requestPlaceholder) {
          let placeholderMsg: AgentMessage;

          if (typeof requestPlaceholder === 'function') {
            placeholderMsg = (requestPlaceholder as RequestPlaceholderFn<AgentMessage>)(message, {
              messages: getFilteredMessages(nextMessages),
            });
          } else {
            placeholderMsg = requestPlaceholder;
          }
          const loadingMsg = createMessage(placeholderMsg, 'loading');
          loadingMsgId = loadingMsg.id;

          nextMessages = [...nextMessages, loadingMsg];
        }

        return nextMessages;
      });

      let updatingMsgId: number | string | null = null;

      const updateMessage = (status: MessageStatus, chunk: Output, chunks: Output[]) => {
        let msg = messages.value.find((info) => info.id === updatingMsgId);
        if (!msg) {
          const transformData = getTransformMessage({ chunk, status, chunks });
          msg = createMessage(transformData, status);
          setMessages((ori) => {
            const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);
            return [...oriWithoutPending, msg!];
          });
          updatingMsgId = msg.id;
        } else {
          setMessages((ori) => {
            return ori.map((info) => {
              if (info.id === updatingMsgId) {
                const transformData = getTransformMessage({
                  originMessage: info.message,
                  chunk,
                  chunks,
                  status,
                });
                return {
                  ...info,
                  message: transformData,
                  status,
                };
              }
              return info;
            });
          });
        }

        return msg;
      };

      agent.request(
        {
          message,
          messages: getRequestMessages(),
          ...otherRequestParams,
        } as Input,
        {
          onUpdate: (chunk) => {
            updateMessage('loading', chunk, []);
          },
          onSuccess: (chunks) => {
            updateMessage('success', undefined as Output, chunks);
            abortControllerRef.value = null;
          },
          onError: async (error: Error) => {
            const lid = loadingMsgId;
            const uid = updatingMsgId;

            if (isAbortLikeError(error)) {
              // Keep streamed partial content with abort status; drop unused placeholder
              setMessages((ori) => {
                if (uid != null) {
                  return ori
                    .filter((info) => info.id !== lid)
                    .map((info) =>
                      info.id === uid ? { ...info, status: 'abort' as const } : info,
                    );
                }
                return ori.filter((info) => info.id !== lid);
              });
              abortControllerRef.value = null;
              return;
            }

            if (requestFallback) {
              let fallbackMsg: AgentMessage;

              if (typeof requestFallback === 'function') {
                fallbackMsg = await (requestFallback as RequestFallbackFn<AgentMessage>)(message, {
                  error,
                  messages: getRequestMessages(),
                });
              } else {
                fallbackMsg = requestFallback;
              }

              setMessages((ori) => [
                ...ori.filter((info) => info.id !== lid && info.id !== uid),
                createMessage(fallbackMsg, 'error'),
              ]);
            } else {
              setMessages((ori) => {
                return ori.filter((info) => info.id !== lid && info.id !== uid);
              });
            }
            abortControllerRef.value = null;
          },
          onStream: (controller) => {
            abortControllerRef.value = controller;
            resolveAbortController?.(controller);
          },
        },
        transformStream,
      );
    },
  );

  return {
    onRequest,
    abort,
    messages,
    parsedMessages,
    setMessages,
  } as const;
}
