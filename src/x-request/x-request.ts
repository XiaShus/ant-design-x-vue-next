import XStream from '../x-stream';
import xFetch from './x-fetch';

import type { SSEOutput, XStreamOptions } from '../x-stream';
import type { XFetchMiddlewares, XFetchOptions } from './x-fetch';

import type { AnyObject } from '../_util/type';
import { computed, MaybeRefOrGetter, toValue } from 'vue';

export interface XRequestBaseOptions {
  /**
   * @description Base URL, e.g., 'https://api.example.com/v1/chat'
   */
  baseURL: string;

  /**
   * @description Model name, e.g., 'gpt-3.5-turbo'
   */
  model?: string;

  /**
   * @warning 🔥🔥 Its dangerously!
   *
   * Enabling the dangerouslyApiKey option can be dangerous because it exposes
   * your secret API credentials in the client-side code. Web browsers are inherently
   * less secure than server environments, any user with access to the browser can
   * potentially inspect, extract, and misuse these credentials. This could lead to
   * unauthorized access using your credentials and potentially compromise sensitive
   * data or functionality.
   */
  dangerouslyApiKey?: string;
}

interface XRequestCustomOptions {
  /**
   * @description Extra headers merged into every request
   */
  headers?: Record<string, string>;
  /**
   * @description Custom fetch
   */
  fetch?: XFetchOptions['fetch'];
  /**
   * @description Middleware for request and response
   */
  middlewares?: XFetchMiddlewares;
  /**
   * @description Request timeout in ms (abort when exceeded before first byte)
   */
  timeout?: number;
  /**
   * @description Idle timeout between stream chunks in ms
   */
  streamTimeout?: number;
  /**
   * @description Delay before retry after failure (ms). Set to enable retry.
   */
  retryInterval?: number;
  /**
   * @description Max retry attempts when retryInterval is set
   */
  retryTimes?: number;
  /**
   * @description Separator for stream data parsing
   */
  streamSeparator?: string;
  /**
   * @description Separator for different parts within the stream
   */
  partSeparator?: string;
  /**
   * @description Separator for key-value pairs in the stream data
   */
  kvSeparator?: string;
}

export type XRequestOptions = XRequestBaseOptions & XRequestCustomOptions;

/** Global defaults applied to every XRequest instance (aligned with @ant-design/x-sdk). */
export type XRequestGlobalOptions = Pick<
  XRequestOptions,
  | 'headers'
  | 'timeout'
  | 'streamTimeout'
  | 'middlewares'
  | 'fetch'
  | 'retryInterval'
  | 'retryTimes'
  | 'streamSeparator'
  | 'partSeparator'
  | 'kvSeparator'
>;

const globalOptions: XRequestGlobalOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Set app-wide XRequest defaults (headers / timeout / middlewares / fetch…).
 * Instance options override global ones.
 */
export function setXRequestGlobalOptions(options: XRequestGlobalOptions) {
  Object.assign(globalOptions, options);
}

/** Test / debug helper */
export function getXRequestGlobalOptions(): Readonly<XRequestGlobalOptions> {
  return globalOptions;
}

/** Reset globals (tests) */
export function resetXRequestGlobalOptions() {
  for (const key of Object.keys(globalOptions) as (keyof XRequestGlobalOptions)[]) {
    delete globalOptions[key];
  }
  globalOptions.headers = { 'Content-Type': 'application/json' };
}

type XRequestMessageContent = string | AnyObject;

interface XRequestMessage extends AnyObject {
  role?: string;
  content?: XRequestMessageContent;
}

/**
 * Compatible with the parameters of OpenAI's chat.completions.create,
 * with plans to support more parameters and adapters in the future
 */
export interface XRequestParams {
  /**
   * @description Model name, e.g., 'gpt-3.5-turbo'
   * @default XRequestOptions.model
   */
  model?: string;

  /**
   * @description Indicates whether to use streaming for the response
   */
  stream?: boolean;

  /**
   * @description The messages to be sent to the model
   */
  messages?: XRequestMessage[];
}

export interface XRequestCallbacks<Output> {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (chunks: Output[]) => void;

  /**
   * @description Callback when the request fails.
   * Return a number to override retryInterval for this error.
   */
  onError: (error: Error) => void | number;

  /**
   * @description Callback when the request is updated
   */
  onUpdate: (chunk: Output) => void;

  /**
   * @description Callback monitoring and control the stream
   */
  onStream?: (abortController: AbortController) => void;
}

export type XRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  params: XRequestParams & Input,
  callbacks: XRequestCallbacks<Output>,
  transformStream?: XStreamOptions<Output>['transformStream'],
) => Promise<void>;

const LastEventId = 'Last-Event-ID';

class XRequestClass {
  readonly baseURL;
  readonly model;

  private defaultHeaders: Record<string, string>;
  private customOptions: XRequestCustomOptions;

  private abortController?: AbortController;
  private timeoutHandler?: ReturnType<typeof setTimeout>;
  private streamTimeoutHandler?: ReturnType<typeof setTimeout>;
  private retryTimer?: ReturnType<typeof setTimeout>;

  private _isTimeout = false;
  private _isStreamTimeout = false;
  private _isRequesting = false;
  private retryTimes = 0;
  private lastEventId?: string;
  private lastParams?: AnyObject;
  private lastCallbacks?: XRequestCallbacks<any>;
  private lastTransformStream?: XStreamOptions<any>['transformStream'];

  private constructor(options: XRequestOptions) {
    const {
      baseURL,
      model,
      dangerouslyApiKey,
      headers,
      fetch: customFetch,
      middlewares,
      timeout,
      streamTimeout,
      retryInterval,
      retryTimes,
      streamSeparator,
      partSeparator,
      kvSeparator,
    } = options;

    this.baseURL = baseURL;
    this.model = model;
    this.defaultHeaders = {
      ...(globalOptions.headers || {}),
      'Content-Type': 'application/json',
      ...(headers || {}),
      ...(dangerouslyApiKey && {
        Authorization: dangerouslyApiKey,
      }),
    };
    this.customOptions = {
      headers,
      fetch: customFetch ?? globalOptions.fetch,
      middlewares: middlewares ?? globalOptions.middlewares,
      timeout: timeout ?? globalOptions.timeout,
      streamTimeout: streamTimeout ?? globalOptions.streamTimeout,
      retryInterval: retryInterval ?? globalOptions.retryInterval,
      retryTimes: retryTimes ?? globalOptions.retryTimes,
      streamSeparator: streamSeparator ?? globalOptions.streamSeparator,
      partSeparator: partSeparator ?? globalOptions.partSeparator,
      kvSeparator: kvSeparator ?? globalOptions.kvSeparator,
    };
  }

  public static init(options: XRequestOptions): XRequestClass {
    if (!options.baseURL || typeof options.baseURL !== 'string')
      throw new Error('The baseURL is not valid!');

    return new XRequestClass(options);
  }

  public get isTimeout() {
    return this._isTimeout;
  }

  public get isStreamTimeout() {
    return this._isStreamTimeout;
  }

  public get isRequesting() {
    return this._isRequesting;
  }

  /** Abort in-flight request and clear timers */
  public abort = () => {
    this.clearTimers();
    this.abortController?.abort();
    this._isRequesting = false;
  };

  public create = async <Input = AnyObject, Output = SSEOutput>(
    params: XRequestParams & Input,
    callbacks?: XRequestCallbacks<Output>,
    transformStream?: XStreamOptions<Output>['transformStream'],
  ) => {
    this.resetRetryState();
    this.lastParams = params;
    this.lastCallbacks = callbacks;
    this.lastTransformStream = transformStream;
    await this.executeCreate(params, callbacks, transformStream);
  };

  private resetRetryState() {
    this.clearTimers();
    this.retryTimes = 0;
    this.lastEventId = undefined;
    this._isTimeout = false;
    this._isStreamTimeout = false;
  }

  private clearTimers() {
    if (this.timeoutHandler) clearTimeout(this.timeoutHandler);
    if (this.streamTimeoutHandler) clearTimeout(this.streamTimeoutHandler);
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.timeoutHandler = undefined;
    this.streamTimeoutHandler = undefined;
    this.retryTimer = undefined;
  }

  private executeCreate = async <Input = AnyObject, Output = SSEOutput>(
    params: XRequestParams & Input,
    callbacks?: XRequestCallbacks<Output>,
    transformStream?: XStreamOptions<Output>['transformStream'],
    extraHeaders?: Record<string, string>,
  ) => {
    this.abortController = new AbortController();
    this._isTimeout = false;
    this._isStreamTimeout = false;
    this._isRequesting = true;

    const requestInit = {
      method: 'POST' as const,
      body: JSON.stringify({
        model: this.model,
        ...params,
      }),
      headers: {
        ...this.defaultHeaders,
        ...(extraHeaders || {}),
      },
      signal: this.abortController.signal,
    };

    callbacks?.onStream?.(this.abortController);

    const timeout = this.customOptions.timeout;
    if (timeout && timeout > 0) {
      this.timeoutHandler = setTimeout(() => {
        this._isTimeout = true;
        this.abortController?.abort();
        const err = new Error('TimeoutError');
        err.name = 'TimeoutError';
        this.handleError(err, callbacks);
      }, timeout);
    }

    try {
      const response = await xFetch(this.baseURL, {
        fetch: this.customOptions.fetch,
        middlewares: this.customOptions.middlewares,
        ...requestInit,
      });

      if (this.timeoutHandler) {
        clearTimeout(this.timeoutHandler);
        this.timeoutHandler = undefined;
      }

      if (this._isTimeout) {
        return;
      }

      if (transformStream) {
        await this.customResponseHandler<Output>(response, callbacks, transformStream);
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      const mimeType = contentType.split(';')[0].trim();

      switch (mimeType) {
        case 'text/event-stream':
          await this.sseResponseHandler<Output>(response, callbacks);
          break;
        case 'application/json':
          await this.jsonResponseHandler<Output>(response, callbacks);
          break;
        default:
          throw new Error(`The response content-type: ${contentType} is not support!`);
      }
    } catch (error) {
      if (this.timeoutHandler) {
        clearTimeout(this.timeoutHandler);
        this.timeoutHandler = undefined;
      }

      // Timeout / stream-timeout already notified via handleError
      if (this._isTimeout || this._isStreamTimeout) {
        return;
      }

      const err =
        error instanceof Error ||
        (typeof DOMException !== 'undefined' && error instanceof DOMException)
          ? (error as Error)
          : new Error('Unknown error!');

      this.handleError(err, callbacks);

      // Do not throw when a retry is scheduled or user aborted
      if (this.retryTimer || err.name === 'AbortError') {
        return;
      }

      throw err;
    }
  };

  private handleError<Output>(error: Error, callbacks?: XRequestCallbacks<Output>) {
    this._isRequesting = false;

    if (error.name === 'AbortError' && !this._isTimeout && !this._isStreamTimeout) {
      callbacks?.onError?.(error);
      return;
    }

    const returnOfOnError = callbacks?.onError?.(error);
    const retryInterval =
      typeof returnOfOnError === 'number' ? returnOfOnError : this.customOptions.retryInterval;

    if (
      error.name !== 'AbortError' &&
      retryInterval &&
      retryInterval > 0 &&
      (typeof this.customOptions.retryTimes !== 'number' ||
        this.retryTimes < this.customOptions.retryTimes)
    ) {
      this.retryTimes += 1;
      this.retryTimer = setTimeout(() => {
        const extraHeaders: Record<string, string> = {};
        if (typeof this.lastEventId !== 'undefined') {
          extraHeaders[LastEventId] = this.lastEventId;
        }
        void this.executeCreate(
          this.lastParams as AnyObject,
          this.lastCallbacks,
          this.lastTransformStream,
          extraHeaders,
        );
      }, retryInterval);
    }
  }

  private processStream = async <Output = SSEOutput>(
    stream: AsyncGenerator<Output>,
    callbacks?: XRequestCallbacks<Output>,
  ) => {
    const chunks: Output[] = [];
    const streamTimeout = this.customOptions.streamTimeout;

    try {
      while (true) {
        if (streamTimeout && streamTimeout > 0) {
          this.streamTimeoutHandler = setTimeout(() => {
            this._isStreamTimeout = true;
            this.abortController?.abort();
            const err = new Error('StreamTimeoutError');
            err.name = 'StreamTimeoutError';
            this.handleError(err, callbacks);
          }, streamTimeout);
        }

        let result: IteratorResult<Output>;
        try {
          result = await stream.next();
        } catch {
          if (this._isStreamTimeout || this._isTimeout) {
            return;
          }
          throw new Error('Stream read failed');
        }

        if (this.streamTimeoutHandler) {
          clearTimeout(this.streamTimeoutHandler);
          this.streamTimeoutHandler = undefined;
        }

        if (this._isStreamTimeout) {
          return;
        }

        if (result.done) break;

        if (result.value) {
          chunks.push(result.value);
          callbacks?.onUpdate?.(result.value);

          const maybeId = (result.value as SSEOutput)?.id;
          if (typeof maybeId !== 'undefined') {
            this.lastEventId = String(maybeId);
          }
        }
      }

      this._isRequesting = false;
      callbacks?.onSuccess?.(chunks);
    } finally {
      if (this.streamTimeoutHandler) {
        clearTimeout(this.streamTimeoutHandler);
        this.streamTimeoutHandler = undefined;
      }
    }
  };

  private customResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
    transformStream?: XStreamOptions<Output>['transformStream'],
  ) => {
    const stream = XStream({
      readableStream: response.body!,
      transformStream,
      streamSeparator: this.customOptions.streamSeparator,
      partSeparator: this.customOptions.partSeparator,
      kvSeparator: this.customOptions.kvSeparator,
    });

    await this.processStream(stream[Symbol.asyncIterator](), callbacks);
  };

  private sseResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
  ) => {
    const stream = XStream<Output>({
      readableStream: response.body!,
      streamSeparator: this.customOptions.streamSeparator,
      partSeparator: this.customOptions.partSeparator,
      kvSeparator: this.customOptions.kvSeparator,
    });

    await this.processStream(stream[Symbol.asyncIterator](), callbacks);
  };

  private jsonResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
  ) => {
    const chunk: Output = await response.json();

    callbacks?.onUpdate?.(chunk);
    this._isRequesting = false;
    callbacks?.onSuccess?.([chunk]);
  };
}

const XRequest = (options: MaybeRefOrGetter<XRequestOptions>) => {
  return computed(() => {
    return XRequestClass.init(toValue(options));
  });
};

export default XRequest;
