import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { AvoidValidation } from '../type-utility';

export type ThinkSemanticType = 'root' | 'status' | 'content';

export interface ThinkRef {
  nativeElement: HTMLElement;
}

export interface ThinkProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'title'> {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<ThinkSemanticType, string>>;
  styles?: Partial<Record<ThinkSemanticType, CSSProperties>>;
  title?: AvoidValidation<VNode | string | (() => VNode | string)>;
  icon?: AvoidValidation<VNode | (() => VNode)>;
  loading?: AvoidValidation<boolean | VNode | (() => VNode)>;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpand?: (expand: boolean) => void;
  blink?: boolean;
  /**
   * @desc 隐藏时是否销毁内容节点
   * @descEN Whether to destroy content node when hidden
   * @default true
   */
  destroyOnHidden?: boolean;
}

export type ThinkSlots = {
  default?(): any;
  title?(): any;
  icon?(): any;
  loading?(): any;
};
