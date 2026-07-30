import XFetch from './x-fetch';
import XRequest, {
  getXRequestGlobalOptions,
  resetXRequestGlobalOptions,
  setXRequestGlobalOptions,
} from './x-request';
import {
  AbstractXRequestClass,
  ManualXRequestClass,
  createManualXRequest,
} from './manual-x-request';

export type { XFetchMiddlewares, XFetchOptions, XFetchType } from './x-fetch';
export type {
  XRequestBaseOptions,
  XRequestOptions,
  XRequestGlobalOptions,
  XRequestParams,
  XRequestCallbacks,
  XRequestFunction,
} from './x-request';
export type {
  ManualXRequestOptions,
  ManualXRequestCallbacks,
} from './manual-x-request';

export {
  XFetch,
  XRequest,
  setXRequestGlobalOptions,
  getXRequestGlobalOptions,
  resetXRequestGlobalOptions,
  AbstractXRequestClass,
  ManualXRequestClass,
  createManualXRequest,
};

export default XRequest;
