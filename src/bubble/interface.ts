import type { AvatarProps, DividerProps } from 'ant-design-vue';
import type { AvoidValidation } from '../type-utility';
import type { CSSProperties, HTMLAttributes, VNode, VNodeChild } from 'vue';
import { AnyObject } from '../_util/type';
import type { MessageStatus } from '../use-x-chat/use-x-chat';

export interface EditableBubbleOption {
  editing?: boolean;
  okText?: VNodeChild;
  cancelText?: VNodeChild;
}

export type BubbleTypingEffect = 'typing' | 'fade-in';

export type FooterPlacement = 'outer-start' | 'outer-end' | 'inner-start' | 'inner-end';

export interface TypingOption {
  /**
   * 每次前进字符数；数组表示闭区间内随机步长
   * @default 1
   */
  step?: number | [number, number];
  /**
   * @default 50
   */
  interval?: number;
  /**
   * @default null
   */
  suffix?: VNode | string;
  /**
   * 打字动画效果：`typing` 光标逐字；`fade-in` 片段淡入
   * @default 'typing'
   */
  effect?: BubbleTypingEffect;
  /**
   * 内容增长时是否保留公共前缀（流式场景）
   * @default true
   */
  keepPrefix?: boolean;
}

export type SemanticType = 'avatar' | 'content' | 'header' | 'footer' | 'extra';

export type BubbleContentType = VNode | string | AnyObject | number;

export type InfoType = {
  key?: string | number;
  status?: MessageStatus;
  extraInfo?: AnyObject;
};

/** @deprecated Prefer `InfoType` */
export type SlotInfoType = InfoType;

export interface _AvatarProps extends AvatarProps {
  class: string;
  style: CSSProperties;
}

export interface BubbleProps<ContentType extends BubbleContentType = string> extends /* @vue-ignore */ Omit<HTMLAttributes, 'content'> {
  prefixCls?: string;
  rootClassName?: string;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  /**
   * Avatar — props object, VNode, or BubbleSlot `(content, info) => VNode`.
   * Zero-arg `() => VNode` remains supported.
   */
  avatar?: AvoidValidation<
    | Partial<_AvatarProps>
    | VNode
    | ((content: ContentType, info: InfoType) => VNode | string)
    | (() => VNode)
  >;
  placement?: 'start' | 'end';
  loading?: boolean;
  typing?: AvoidValidation<
    | TypingOption
    | boolean
    | ((content: ContentType, info: InfoType) => TypingOption | boolean)
  >;
  /**
   * 是否处于流式传输；为 true 时不触发 onTypingComplete
   * @default false
   */
  streaming?: boolean;
  content?: ContentType;
  /**
   * Custom content renderer (React 2.x API).
   */
  contentRender?: (content: ContentType, info: InfoType) => VNode | string;
  /**
   * @deprecated Prefer `contentRender`
   */
  messageRender?: (content: ContentType, info?: InfoType) => VNode | string;
  loadingRender?: () => VNode;
  /** Message status — used by list / contentRender info (not a DOM attr). */
  status?: MessageStatus;
  /** Extra metadata for contentRender info (not a DOM attr). */
  extraInfo?: AnyObject;
  variant?: 'filled' | 'borderless' | 'outlined' | 'shadow';
  shape?: 'round' | 'corner';
  _key?: number | string;
  /**
   * 打字过程回调（rendererContent 为当前已渲染片段，currentContent 为完整内容）
   */
  onTyping?: (rendererContent: string, currentContent: string) => void;
  onTypingComplete?: VoidFunction;
  header?: AvoidValidation<VNode | string | ((content: ContentType, info: InfoType) => VNode | string)>;
  footer?: AvoidValidation<VNode | string | ((content: ContentType, info: InfoType) => VNode | string)>;
  /**
   * Side UI beside the bubble body (timestamp / Actions). Distinct from `extraInfo` metadata.
   */
  extra?: AvoidValidation<VNode | string | ((content: ContentType, info: InfoType) => VNode | string)>;
  /**
   * footer 渲染位置
   * @default placement===start ? 'outer-start' : 'outer-end'
   */
  footerPlacement?: FooterPlacement;
  /**
   * 是否可编辑（仅 content 为 string）
   */
  editable?: boolean | EditableBubbleOption;
  onEditConfirm?: (content: string) => void;
  onEditCancel?: () => void;
}

export type SystemBubbleProps<ContentType extends BubbleContentType = string> = Pick<
  BubbleProps<ContentType>,
  'prefixCls' | 'content' | 'rootClassName' | 'variant' | 'shape' | 'styles' | 'classNames'
>;

export interface DividerBubbleProps<ContentType extends BubbleContentType = string> {
  prefixCls?: string;
  rootClassName?: string;
  styles?: BubbleProps<ContentType>['styles'];
  classNames?: BubbleProps<ContentType>['classNames'];
  content?: ContentType;
  dividerProps?: Omit<DividerProps, 'children'>;
}

export interface BubbleRef {
  nativeElement: HTMLElement;
}

export interface BubbleContextProps {
  onUpdate?: VoidFunction;
  key?: string | number;
  status?: MessageStatus;
  extraInfo?: AnyObject;
}

export interface BubbleListRef {
  nativeElement: HTMLDivElement;
  scrollTo: (info: {
    offset?: number;
    key?: string | number;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }) => void;
}

export type BubbleDataType = BubbleProps<any> & {
  key?: string | number;
  role?: string;
  status?: MessageStatus;
  extraInfo?: AnyObject;
};

export type RoleType = Partial<Omit<BubbleProps<any>, 'content'>>;

export type RolesType = Record<string, RoleType> | ((bubbleDataP: BubbleDataType, index: number) => RoleType);

/** Align React Bubble.List SemanticType. */
export type ListSemanticType =
  | SemanticType
  | 'root'
  | 'scroll'
  | 'bubble'
  | 'system'
  | 'divider';

export interface BubbleListProps extends /* @vue-ignore */ HTMLAttributes {
  prefixCls?: string;
  rootClassName?: string;
  items?: BubbleDataType[];
  autoScroll?: boolean;
  roles?: AvoidValidation<RolesType>;
  onScroll?: (e: Event) => void;
  classNames?: Partial<Record<ListSemanticType, string>>;
  styles?: Partial<Record<ListSemanticType, CSSProperties>>;
}
