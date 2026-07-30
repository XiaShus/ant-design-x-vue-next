import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { Key } from '../_util/type';
import type { AvoidValidation } from '../type-utility';

export type SourcesSemanticType = 'root' | 'title' | 'content';

export interface SourcesRef {
  nativeElement: HTMLElement;
}

export interface SourcesItem {
  key?: Key;
  title: AvoidValidation<VNode | string>;
  url?: string;
  icon?: AvoidValidation<VNode | string>;
  description?: AvoidValidation<VNode | string>;
}

export interface SourcesProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'title' | 'onClick'> {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<SourcesSemanticType, string>>;
  styles?: Partial<Record<SourcesSemanticType, CSSProperties>>;
  inline?: boolean;
  items?: SourcesItem[];
  title?: AvoidValidation<VNode | string | (() => VNode | string)>;
  expandIconPosition?: 'start' | 'end';
  onClick?: (item: SourcesItem) => void;
  popoverOverlayWidth?: number | string;
  activeKey?: Key;
  expanded?: boolean;
  onExpand?: (expand: boolean) => void;
  defaultExpanded?: boolean;
}

export type SourcesSlots = {
  default?(): any;
  title?(): any;
};
