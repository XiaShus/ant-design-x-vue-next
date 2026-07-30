import { computed, ref, watch } from 'vue';
import { XAgent } from '../use-x-agent';
import useSyncState from './useSyncState';
import { useEventCallback } from '../_util/hooks/use-event-callback';
import { type SSEOutput, XStreamOptions } from '../x-stream';
import { XRequestParams } from '../x-request';
import type { AnyObject } from '../_util/type';
import {
  type ConversationKey,
  getConversationMessages,
  setConversationMessages,
} from './conversationStore';

export type SimpleType = string | number | boolean | object;

export type MessageStatus = 'local' | 'loading' | 'success' | 'error' | 'abort' | 'updating';

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

  /**
   * Isolate message list by conversation key (multi-conversation enterprise chat).
   */
  conversationKey?: ConversationKey;

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

const requestingMap = new Map<ConversationKey, boolean>();

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
    conversationKey: conversationKeyProp,
  } = config;

  const idRef = ref(0);
  const abortControllerRef = ref<AbortController | null>(null);
  const activeConversationKey = ref<ConversationKey>(
    conversationKeyProp ?? Symbol('ConversationKey'),
  );

  const buildDefaultMessages = (): MessageInfo<AgentMessage>[] =>
    (defaultMessages || []).map((info, index) => ({
      id: `default_${index}`,
      status: 'local' as const,
      ...info,
    }));

  const resolveInitialMessages = (key: ConversationKey): MessageInfo<AgentMessage>[] => {
    const stored = getConversationMessages<AgentMessage>(key);
    if (stored.length > 0) return stored;
    return buildDefaultMessages();
  };

  const [messages, setMessagesInner] = useSyncState<MessageInfo<AgentMessage>[]>(
    resolveInitialMessages(activeConversationKey.value),
    () => {},
  );

  const persistAndSetMessages = (
    updater:
      | MessageInfo<AgentMessage>[]
      | ((prev: MessageInfo<AgentMessage>[]) => MessageInfo<AgentMessage>[]),
  ) => {
    setMessagesInner((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setConversationMessages(activeConversationKey.value, next);
      return next;
    });
  };

  watch(
    () => conversationKeyProp,
    (key) => {
      if (key === undefined || key === activeConversationKey.value) return;
      // Persist current before switch
      setConversationMessages(activeConversationKey.value, messages.value);
      activeConversationKey.value = key;
      setMessagesInner(resolveInitialMessages(key));
    },
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

  const isRequesting = computed(
    () => requestingMap.get(activeConversationKey.value) === true,
  );

  const abort = useEventCallback(() => {
    abortControllerRef.value?.abort();
  });

  const setMessage = (
    id: string | number,
    patch:
      | Partial<MessageInfo<AgentMessage>>
      | ((origin: MessageInfo<AgentMessage>) => Partial<MessageInfo<AgentMessage>>),
  ) => {
    const origin = messages.value.find((info) => info.id === id);
    if (!origin) return false;
    const merge = typeof patch === 'function' ? patch(origin) : patch;
    persistAndSetMessages((ori) =>
      ori.map((info) => (info.id === id ? { ...info, ...merge, id: info.id } : info)),
    );
    return true;
  };

  const removeMessage = (id: string | number) => {
    const exists = messages.value.some((info) => info.id === id);
    if (!exists) return false;
    persistAndSetMessages((ori) => ori.filter((info) => info.id !== id));
    return true;
  };

  const innerOnRequest = (
    requestParams: RequestParams<AgentMessage> | Input | SimpleType,
    opts?: { updatingId?: string | number; reload?: boolean },
  ) => {
    if (!agent)
      throw new Error(
        'The agent parameter is required when using the onRequest method in an agent generated by useXAgent.',
      );

    const { updatingId, reload } = opts || {};
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

    let updatingMsgId: number | string | null = null;

    if (reload) {
      loadingMsgId = updatingId ?? null;
      updatingMsgId = updatingId ?? null;
      persistAndSetMessages((ori) =>
        ori.map((info) => {
          if (info.id !== updatingId) return info;
          if (requestPlaceholder) {
            const placeholderMsg =
              typeof requestPlaceholder === 'function'
                ? (requestPlaceholder as RequestPlaceholderFn<AgentMessage>)(message, {
                    messages: getFilteredMessages(ori),
                  })
                : requestPlaceholder;
            return { ...info, status: 'loading' as const, message: placeholderMsg };
          }
          return { ...info, status: 'loading' as const };
        }),
      );
    } else {
      persistAndSetMessages((ori) => {
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
    }

    requestingMap.set(activeConversationKey.value, true);

    const updateMessage = (status: MessageStatus, chunk: Output, chunks: Output[]) => {
      let msg = messages.value.find((info) => info.id === updatingMsgId);
      if (!msg) {
        const transformData = getTransformMessage({ chunk, status, chunks });
        msg = createMessage(transformData, status);
        persistAndSetMessages((ori) => {
          const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);
          return [...oriWithoutPending, msg!];
        });
        updatingMsgId = msg.id;
      } else {
        persistAndSetMessages((ori) => {
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
          updateMessage('updating', chunk, []);
        },
        onSuccess: (chunks) => {
          updateMessage('success', undefined as Output, chunks);
          requestingMap.set(activeConversationKey.value, false);
          abortControllerRef.value = null;
        },
        onError: async (error: Error) => {
          const lid = loadingMsgId;
          const uid = updatingMsgId;
          requestingMap.set(activeConversationKey.value, false);

          if (isAbortLikeError(error)) {
            persistAndSetMessages((ori) =>
              ori
                .filter((info) => {
                  // Drop distinct loading placeholder; keep message when reload uses same id
                  if (lid != null && info.id === lid && lid !== uid) return false;
                  return true;
                })
                .map((info) =>
                  uid != null && info.id === uid
                    ? { ...info, status: 'abort' as const }
                    : info,
                ),
            );
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
            if (reload && uid != null) {
              persistAndSetMessages((ori) =>
                ori.map((info) =>
                  info.id === uid
                    ? { ...info, message: fallbackMsg, status: 'error' as const }
                    : info,
                ),
              );
            } else {
              persistAndSetMessages((ori) => [
                ...ori.filter((info) => info.id !== lid && info.id !== uid),
                createMessage(fallbackMsg, 'error'),
              ]);
            }
          } else if (reload && uid != null) {
            persistAndSetMessages((ori) =>
              ori.map((info) =>
                info.id === uid ? { ...info, status: 'error' as const } : info,
              ),
            );
          } else {
            persistAndSetMessages((ori) =>
              ori.filter((info) => info.id !== lid && info.id !== uid),
            );
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
  };

  const onRequest = useEventCallback(
    (requestParams: RequestParams<AgentMessage> | Input | SimpleType) => {
      innerOnRequest(requestParams);
    },
  );

  /**
   * Regenerate an existing message in place (aligned with @ant-design/x-sdk onReload).
   * When `requestParams` is omitted, reuses the nearest previous `local` user message.
   */
  const onReload = (
    id: string | number,
    requestParams?: RequestParams<AgentMessage> | Input | SimpleType,
  ) => {
    if (!agent)
      throw new Error(
        'The agent parameter is required when using the onReload method in an agent generated by useXAgent.',
      );

    const idx = messages.value.findIndex((info) => info.id === id);
    if (idx < 0) {
      throw new Error(`message [${id}] is not found`);
    }

    let params = requestParams;
    if (params === undefined) {
      const prevLocal = [...messages.value.slice(0, idx)]
        .reverse()
        .find((info) => info.status === 'local');
      if (!prevLocal) {
        throw new Error(`message [${id}] has no previous user message to reload`);
      }
      params = prevLocal.message;
    }

    innerOnRequest(params, { updatingId: id, reload: true });
  };

  return {
    onRequest,
    onReload,
    abort,
    messages,
    parsedMessages,
    setMessages: persistAndSetMessages,
    setMessage,
    removeMessage,
    conversationKey: activeConversationKey,
    isRequesting,
  } as const;
}
