import type { AnyObject } from '../_util/type';
import type { SSEOutput, XStreamOptions } from '../x-stream';
import type { XFetchMiddlewares, XFetchOptions } from './x-fetch';
import XRequestFactory, {
  getXRequestGlobalOptions,
  type XRequestOptions as LegacyXRequestOptions,
} from './x-request';

type SimpleType = string | number | boolean | object;

/**
 * SDK-style callbacks (aligned with @ant-design/x-sdk).
 * Headers are optional for backward-friendly hosts.
 */
export interface ManualXRequestCallbacks<Output, ChatMessage extends SimpleType = any> {
  onSuccess: (chunks: Output[], responseHeaders: Headers, chatMessage?: any) => void;
  onError: (
    error: Error,
    errorInfo?: any,
    responseHeaders?: Headers,
    fallbackMsg?: any,
  ) => void | number;
  onUpdate?: (chunk: Output, responseHeaders: Headers, chatMessage?: any) => void;
}

export interface ManualXRequestOptions<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
> {
  callbacks?: ManualXRequestCallbacks<Output, ChatMessage>;
  params?: Partial<Input>;
  headers?: Record<string, string>;
  timeout?: number;
  streamTimeout?: number;
  fetch?: XFetchOptions['fetch'];
  middlewares?: XFetchMiddlewares;
  transformStream?: XStreamOptions<Output>['transformStream'];
  streamSeparator?: string;
  partSeparator?: string;
  kvSeparator?: string;
  /** Must be true for provider-owned requests */
  manual?: boolean;
  retryInterval?: number;
  retryTimes?: number;
  model?: string;
  dangerouslyApiKey?: string;
}

export abstract class AbstractXRequestClass<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
> {
  baseURL!: string;
  options!: ManualXRequestOptions<Input, Output, ChatMessage>;

  constructor(baseURL: string, options?: ManualXRequestOptions<Input, Output, ChatMessage>) {
    if (!baseURL || typeof baseURL !== 'string') throw new Error('The baseURL is not valid!');
    this.baseURL = baseURL;
    this.options = options || {};
  }

  abstract get asyncHandler(): Promise<any>;
  abstract get isTimeout(): boolean;
  abstract get isStreamTimeout(): boolean;
  abstract get isRequesting(): boolean;
  abstract get manual(): boolean;

  abstract run(params?: Input): boolean;
  abstract abort(): void;
}

/**
 * Manual XRequest instance for AbstractChatProvider (aligned with @ant-design/x-sdk XRequest(baseURL, { manual: true })).
 * Reuses the legacy Vue XRequest.create engine under the hood.
 */
export class ManualXRequestClass<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
> extends AbstractXRequestClass<Input, Output, ChatMessage> {
  private _asyncHandler: Promise<any> = Promise.resolve();
  private _manual: boolean;
  private lastHeaders: Headers = new Headers();
  private legacy: {
    create: (
      params: any,
      callbacks?: {
        onSuccess: (chunks: Output[]) => void;
        onError: (error: Error) => void | number;
        onUpdate: (chunk: Output) => void;
        onStream?: (c: AbortController) => void;
      },
      transformStream?: XStreamOptions<Output>['transformStream'],
    ) => Promise<void>;
    abort: () => void;
    isTimeout: boolean;
    isStreamTimeout: boolean;
    isRequesting: boolean;
  };

  constructor(baseURL: string, options?: ManualXRequestOptions<Input, Output, ChatMessage>) {
    super(baseURL, options);
    this._manual = options?.manual ?? false;
    const global = getXRequestGlobalOptions();
    const legacyOptions: LegacyXRequestOptions = {
      baseURL,
      model: options?.model,
      dangerouslyApiKey: options?.dangerouslyApiKey,
      headers: {
        ...(global.headers || {}),
        ...(options?.headers || {}),
      },
      fetch: options?.fetch ?? global.fetch,
      middlewares: {
        ...(global.middlewares || {}),
        ...(options?.middlewares || {}),
        onResponse: async (response) => {
          this.lastHeaders = response.headers;
          const userOnResponse =
            options?.middlewares?.onResponse || global.middlewares?.onResponse;
          if (userOnResponse) {
            return userOnResponse(response);
          }
          return response;
        },
      },
      timeout: options?.timeout ?? global.timeout,
      streamTimeout: options?.streamTimeout ?? global.streamTimeout,
      retryInterval: options?.retryInterval ?? global.retryInterval,
      retryTimes: options?.retryTimes ?? global.retryTimes,
      streamSeparator: options?.streamSeparator ?? global.streamSeparator,
      partSeparator: options?.partSeparator ?? global.partSeparator,
      kvSeparator: options?.kvSeparator ?? global.kvSeparator,
    };
    this.legacy = XRequestFactory(legacyOptions).value as any;
  }

  get asyncHandler() {
    return this._asyncHandler;
  }

  get isTimeout() {
    return this.legacy.isTimeout;
  }

  get isStreamTimeout() {
    return this.legacy.isStreamTimeout;
  }

  get isRequesting() {
    return this.legacy.isRequesting;
  }

  get manual() {
    return this._manual;
  }

  run(params?: Input): boolean {
    if (!this.manual) {
      console.warn('[XRequest] The request is not manual, so it cannot be run!');
      return false;
    }
    const callbacks = this.options.callbacks;
    const body = {
      ...(this.options.params || {}),
      ...(params || {}),
    };
    this._asyncHandler = this.legacy.create(
      body,
      {
        onUpdate: (chunk) => {
          callbacks?.onUpdate?.(chunk, this.lastHeaders);
        },
        onSuccess: (chunks) => {
          callbacks?.onSuccess?.(chunks, this.lastHeaders);
        },
        onError: (error) => {
          return callbacks?.onError?.(error, undefined, this.lastHeaders);
        },
      },
      this.options.transformStream,
    );
    return true;
  }

  abort() {
    this.legacy.abort();
  }
}

/**
 * Create a manual SDK-style XRequest (use with AbstractChatProvider).
 *
 * @example
 * ```ts
 * const request = createManualXRequest('/api/chat', { manual: true, params: { model: 'gpt-4o-mini' } });
 * const provider = new OpenAIChatProvider({ request });
 * ```
 */
export function createManualXRequest<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
>(
  baseURL: string,
  options?: ManualXRequestOptions<Input, Output, ChatMessage>,
): AbstractXRequestClass<Input, Output, ChatMessage> {
  return new ManualXRequestClass<Input, Output, ChatMessage>(baseURL, {
    manual: true,
    ...options,
  });
}

export default createManualXRequest;
