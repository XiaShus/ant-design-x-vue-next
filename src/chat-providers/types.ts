import type { AnyObject } from '../_util/type';

export interface XModelMessage extends AnyObject {
  role: string;
  content:
    | string
    | {
        text: string;
        type: string;
      };
}

export interface XModelParams extends AnyObject {
  model?: string;
  messages?: XModelMessage[];
  stream?: boolean;
  temperature?: number;
  [key: string]: any;
}
