import type { MessageStatus, SimpleType } from '../use-x-chat';
import type {
  AbstractXRequestClass,
  ManualXRequestCallbacks,
  ManualXRequestOptions,
} from '../x-request/manual-x-request';

export interface ChatProviderConfig<
  Input = unknown,
  Output = unknown,
  ChatMessage extends SimpleType = SimpleType,
> {
  /**
   * Base params merged by DefaultChatProvider.transformParams
   * (aligned with @ant-design/x-sdk request options.params).
   */
  params?: Record<string, unknown>;
  /**
   * Optional manual XRequest owned by the provider (SDK-style).
   * When set, useXChat can run without useXAgent.
   */
  request?:
    | AbstractXRequestClass<Input, Output, ChatMessage>
    | (() => AbstractXRequestClass<Input, Output, ChatMessage>);
}

export interface TransformMessageInfo<ChatMessage extends SimpleType, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  responseHeaders?: Headers;
}

/**
 * Base chat provider (aligned with @ant-design/x-sdk AbstractChatProvider).
 * Supports transform-only mode or provider-owned manual XRequest.
 */
export abstract class AbstractChatProvider<
  ChatMessage extends SimpleType = SimpleType,
  Input = unknown,
  Output = unknown,
> {
  protected config: ChatProviderConfig<Input, Output, ChatMessage>;
  private _getMessagesFn?: () => ChatMessage[];
  private _request?: AbstractXRequestClass<Input, Output, ChatMessage>;
  private _originalCallbacks?: ManualXRequestCallbacks<Output, ChatMessage>;

  constructor(config: ChatProviderConfig<Input, Output, ChatMessage> = {}) {
    this.config = config;
    if (config.request) {
      const request = typeof config.request === 'function' ? config.request() : config.request;
      if (!request.manual) {
        throw new Error('request must be manual');
      }
      this._request = request;
      this._originalCallbacks = request.options?.callbacks;
    }
  }

  public get request(): AbstractXRequestClass<Input, Output, ChatMessage> | undefined {
    return this._request;
  }

  public get hasRequest(): boolean {
    return !!this._request;
  }

  /**
   * Merge onRequest params with history / provider defaults before calling the agent/request.
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    history?: ChatMessage[],
    options?: ManualXRequestOptions<Input, Output, ChatMessage>,
  ): Input;

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

  /**
   * Wire useXChat stream handlers into the owned manual request callbacks.
   */
  injectRequest({
    onUpdate,
    onSuccess,
    onError,
  }: {
    onUpdate: (data: Output, responseHeaders: Headers) => any;
    onSuccess: (data: Output[], responseHeaders: Headers) => any;
    onError: (error: any, errorInfo?: any) => any;
  }) {
    if (!this._request) {
      throw new Error('provider.request is not configured');
    }
    const originalOnUpdate = this._originalCallbacks?.onUpdate;
    const originalOnSuccess = this._originalCallbacks?.onSuccess;
    const originalOnError = this._originalCallbacks?.onError;
    this._request.options.callbacks = {
      onUpdate: (data: Output, responseHeaders: Headers) => {
        const msg = onUpdate(data, responseHeaders);
        if (originalOnUpdate) originalOnUpdate(data, responseHeaders, msg);
      },
      onSuccess: (data: Output[], responseHeaders: Headers) => {
        const msg = onSuccess(data, responseHeaders);
        if (originalOnSuccess) originalOnSuccess(data, responseHeaders, msg);
      },
      onError: (error, errorInfo, responseHeaders) => {
        const fallbackMsg = onError(error, errorInfo);
        if (originalOnError) originalOnError(error, errorInfo, responseHeaders, fallbackMsg);
        return undefined;
      },
    };
  }

  /** Ready-to-use transformMessage for useXChat */
  asTransformMessage() {
    return (info: TransformMessageInfo<ChatMessage, Output>) => this.transformMessage(info);
  }
}

export default AbstractChatProvider;
