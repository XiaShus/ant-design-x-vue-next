import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { Collapsible } from './hooks/useCollapsible';
import type { ConfigProviderProps, TooltipProps } from 'ant-design-vue';

export enum THOUGHT_CHAIN_ITEM_STATUS {
  /**
   * @desc 加载中
   * @descEN Loading
   */
  LOADING = 'loading',
  /**
   * @desc 成功状态
   * @descEN Success
   */
  SUCCESS = 'success',
  /**
   * @desc 错误状态
   * @descEN Error
   */
  ERROR = 'error',
  /**
   * @desc 中止状态
   * @descEN Abort
   */
  ABORT = 'abort',
  /**
   * @deprecated Use `loading` instead. Kept for compatibility.
   * @desc 等待状态（已废弃，等同 loading）
   */
  PENDING = 'pending',
}

export interface TooltipConfig {
  /**
   * @desc Title tooltip 配置
   * @descEN Title tooltip configuration
   */
  titleConfig?: TooltipProps;

  /**
   * @desc Description tooltip 配置
   * @descEN Description tooltip configuration
   */
  descriptionConfig?: TooltipProps;
}

export type ThoughtChainLine = boolean | 'solid' | 'dashed' | 'dotted';

export interface ThoughtChainItem {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: VNode | string | number;

  /**
   * @desc 思维节点标题
   * @descEN Thought chain item title
   */
  title?: VNode | string;

  /**
   * @desc 思维节点描述
   * @descEN Thought chain item description
   */
  description?: VNode | string;

  /**
   * @desc 思维节点额外内容
   * @descEN Thought chain item extra content
   */
  extra?: VNode | string;

  /**
   * @desc 思维节点内容
   * @descEN Thought chain item content
   */
  content?: VNode | string;

  /**
   * @desc 思维节点脚注
   * @descEN Thought chain item footer
   */
  footer?: VNode | string;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;

  /**
   * @desc 是否可折叠
   * @descEN Whether collapsible
   */
  collapsible?: boolean;

  /**
   * @desc 闪烁
   * @descEN blink
   */
  blink?: boolean;

  /**
   * @desc 隐藏时是否销毁内容节点
   * @descEN Whether to destroy content node when hidden
   * @default true
   */
  destroyOnHidden?: boolean;

  tooltip?: boolean | TooltipConfig;
}

/** Align React ThoughtChain SemanticType. */
export type SemanticType =
  | 'root'
  | 'item'
  | 'itemHeader'
  | 'itemIcon'
  | 'itemContent'
  | 'itemFooter';

export type ThoughtChainSemanticType = SemanticType;

export interface ThoughtChainProps extends Omit<HTMLAttributes, 'title'> {
  /**
   * @desc 思维节点集合
   * @descEN chain items
   */
  items?: ThoughtChainItem[];

  /**
   * @desc 是否可折叠（兼容旧 API；亦可使用顶层 expandedKeys / onExpand）
   * @descEN Whether collapsible (compat shim; prefer top-level expand props)
   */
  collapsible?: Collapsible;

  /**
   * @desc 初始化展开的节点
   * @descEN default expanded keys
   */
  defaultExpandedKeys?: string[];

  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: string[];

  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: (expandedKeys: string[]) => void;

  /**
   * @desc 线条样式，为 `false` 时不展示线条
   * @descEN Line style; no line when `false`
   * @default true
   */
  line?: ThoughtChainLine;

  /**
   * @desc 组件大小
   * @descEN Component size
   */
  size?: ConfigProviderProps['componentSize'];

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 自定义根类名
   * @descEN Custom class name
   */
  rootClassName?: string;
}

export interface ThoughtChainNodeContextProps {
  prefixCls?: string;
  // collapseMotion?: CSSMotionProps;
  /** Chain-level force collapse for all items (Vue `collapsible` compat) */
  enableCollapse?: boolean;
  expandedKeys?: string[];
  direction?: ConfigProviderProps['direction'];
  styles?: ThoughtChainProps['styles'];
  classNames?: ThoughtChainProps['classNames'];
  line?: ThoughtChainLine;
}

export interface ThoughtChainNodeProps extends Omit<HTMLAttributes, 'onClick'> {
  info?: ThoughtChainItem;
  nextStatus?: ThoughtChainItem['status'];
  onClick?: (key: string) => void;
  line?: ThoughtChainLine;
}
