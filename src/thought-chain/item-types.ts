import type { CSSProperties, HTMLAttributes, VNode } from 'vue';

export type ThoughtChainItemVariant = 'solid' | 'outlined' | 'text';

export type ThoughtChainItemStatus = 'loading' | 'success' | 'error' | 'abort';

export type ThoughtChainItemSemanticType = 'root' | 'icon' | 'title' | 'description';

export interface ThoughtChainItemProps
  extends Omit<HTMLAttributes, 'title' | 'key'> {
  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: VNode | string;

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
   * @desc 根节点样式类
   * @descEN Root node style class
   */
  rootClassName?: string;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: ThoughtChainItemStatus;

  /**
   * @desc 思维节点变体
   * @descEN Thought chain item variant
   */
  variant?: ThoughtChainItemVariant;

  /**
   * @desc 闪烁
   * @descEN blink
   */
  blink?: boolean;

  /**
   * @desc 自定义样式类名
   * @descEN Custom CSS class name
   */
  className?: string;

  /**
   * @desc 语义化样式类名配置
   * @descEN Semantic class names configuration
   */
  classNames?: Partial<Record<ThoughtChainItemSemanticType, string>>;

  /**
   * @desc 自定义内联样式
   * @descEN Custom inline styles
   */
  style?: CSSProperties;

  /**
   * @desc 语义化样式配置
   * @descEN Semantic styles configuration
   */
  styles?: Partial<Record<ThoughtChainItemSemanticType, CSSProperties>>;

  /**
   * @desc 是否禁用
   * @descEN Whether disabled
   */
  disabled?: boolean;

  /**
   * @desc 点击回调
   * @descEN Click handler
   */
  onClick?: (e: MouseEvent) => void;
}
