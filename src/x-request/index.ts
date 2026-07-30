import XFetch from './x-fetch';
import XRequest, {
  getXRequestGlobalOptions,
  resetXRequestGlobalOptions,
  setXRequestGlobalOptions,
} from './x-request';

export type { XFetchMiddlewares, XFetchOptions, XFetchType } from './x-fetch';
export type {
  XRequestBaseOptions,
  XRequestOptions,
  XRequestGlobalOptions,
  XRequestParams,
  XRequestCallbacks,
  XRequestFunction,
} from './x-request';

export {
  XFetch,
  XRequest,
  setXRequestGlobalOptions,
  getXRequestGlobalOptions,
  resetXRequestGlobalOptions,
};

export default XRequest;
