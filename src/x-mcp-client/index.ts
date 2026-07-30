import type { AnyObject } from '../_util/type';
import XRequest, { type XRequestOptions } from '../x-request';

export interface XMCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties: AnyObject;
  };
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}

export type XMCPClientOptions = Pick<
  XRequestOptions,
  'timeout' | 'fetch' | 'middlewares' | 'dangerouslyApiKey' | 'model'
> & {
  /** Extra request headers */
  headers?: Record<string, string>;
  /** Body params merged into XRequest.create */
  params?: AnyObject;
};

class XMCPClientClass {
  readonly baseURL: string;
  private options: XMCPClientOptions | undefined;

  constructor(baseURL: string, options?: XMCPClientOptions) {
    if (!baseURL || typeof baseURL !== 'string') {
      throw new Error('The baseURL is not valid!');
    }
    this.baseURL = baseURL;
    this.options = options;
  }

  /**
   * Fetch MCP tool list from the given endpoint (POST JSON via XRequest).
   * Aligned with `@ant-design/x-sdk` XMCPClient.tools().
   */
  async tools(): Promise<XMCPTool[]> {
    const { headers, params, middlewares, ...rest } = this.options || {};

    const mergedMiddlewares = {
      ...middlewares,
      onRequest: async (
        input: Parameters<typeof fetch>[0],
        init?: Parameters<typeof fetch>[1],
      ): Promise<Parameters<typeof fetch>> => {
        const nextInit: RequestInit = {
          ...(init || {}),
          headers: {
            ...((init?.headers as Record<string, string>) || {}),
            ...(headers || {}),
          },
        };
        if (middlewares?.onRequest) {
          return middlewares.onRequest(input, nextInit);
        }
        return [input, nextInit];
      },
    };

    return new Promise((resolve, reject) => {
      const request = XRequest({
        baseURL: this.baseURL,
        ...rest,
        middlewares: mergedMiddlewares,
      }).value;

      void request
        .create((params || {}) as any, {
          onSuccess: (chunks) => {
            resolve((chunks[0] as XMCPTool[]) || []);
          },
          onError: (error: Error) => {
            reject(error);
          },
          onUpdate: () => {},
        })
        .catch(reject);
    });
  }
}

function XMCPClient(baseURL: string, options?: XMCPClientOptions) {
  return new XMCPClientClass(baseURL, options);
}

export { XMCPClient };
export default XMCPClient;
