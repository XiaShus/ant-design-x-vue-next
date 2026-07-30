import type { DropdownProps, MenuItemProps, MenuProps } from 'ant-design-vue';
import type { CSSProperties, HTMLAttributes, VNode, VNodeChild } from 'vue';

type DataAttributes = {
  [Key in `data-${string}`]: string | number;
};

export interface SubItemType extends Pick<MenuItemProps, 'danger'>, DataAttributes {
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string;
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string;
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon?: VNode;
  /**
   * @desc 是否禁用
   * @descEN Whether the action is disabled
   */
  disabled?: boolean;
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void;
  /**
   * @desc 自定义渲染操作项内容
   * @descEN Custom render action item content
   */
  actionRender?: ((item: ActionItem) => VNodeChild) | VNodeChild;
}

export interface ItemType extends DataAttributes {
  /**
   * @desc 自定义操作的唯一标识
   * @descEN Unique identifier for the custom action.
   */
  key: string;
  /**
   * @desc 自定义操作的显示标签
   * @descEN Display label for the custom action.
   */
  label?: string;
  /**
   * @desc 自定义操作的图标
   * @descEN Icon for the custom action.
   */
  icon?: VNode;
  /**
   * @desc 是否禁用
   * @descEN Whether the action is disabled
   */
  disabled?: boolean;
  /**
   * @desc 危险样式（对齐 React 顶层 ItemType.danger）
   * @descEN Danger style for top-level action items (React-aligned).
   */
  danger?: boolean;
  /**
   * @desc 子操作项
   * @descEN Child action items.
   */
  children?: ActionItem[];
  /**
   * @desc 子操作项（对齐 React `subItems`；与 `children` 同时传入时优先 `children`）
   * @descEN Nested items (React-aligned alias of `children`; `children` wins if both set).
   */
  subItems?: ActionItem[];
  /**
   * @desc 触发子菜单的操作方式
   * @descEN Action to trigger the sub-menu.
   */
  triggerSubMenuAction?: MenuProps['triggerSubMenuAction'];
  /**
   * @desc 点击自定义操作按钮时的回调函数
   * @descEN Callback function when the custom action button is clicked.
   */
  onItemClick?: (info?: ActionItem) => void;
  /**
   * @desc 自定义渲染操作项内容
   * @descEN Custom render action item content
   */
  actionRender?: ((item: ActionItem) => VNodeChild) | VNodeChild;
}

export type ActionItem = SubItemType | ItemType;

/** Align React Actions SemanticType. */
export type ActionsSemanticType = 'root' | 'item' | 'itemDropdown';

export interface ActionsRef {
  nativeElement: HTMLDivElement;
}

export interface ActionsProps extends Omit<HTMLAttributes, 'onClick'> {
  /**
   * @desc 包含多个操作项的列表
   * @descEN A list containing multiple action items.
   */
  items: ActionItem[];
  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<ActionsSemanticType, string>>;
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<ActionsSemanticType, CSSProperties>>;
  /**
   * @desc 子操作项是否占据一行
   * @descEN Whether the child action items occupy a line.
   * @default false
   */
  block?: boolean;
  /**
   * @desc Item 操作项被点击时的回调函数。
   * @descEN Callback function when an action item is clicked.
   */
  onClick?: (menuInfo: {
    item: ActionItem;
    key: string;
    keyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
  }) => void;
  /**
   * @desc 根节点样式
   * @descEN Style for the root node.
   */
  style?: CSSProperties;
  /**
   * @desc 变体
   * @descEN Variant. `border` is a deprecated alias of `filled`.
   * @default 'borderless'
   */
  variant?: 'borderless' | 'outlined' | 'filled' | 'border';
  /**
   * @desc 样式类名的前缀。
   * @descEN Prefix for style class names.
   */
  prefixCls?: string;
  /**
   * @desc 挂载时淡入动画。
   * @descEN Fade-in animation on mount.
   */
  fadeIn?: boolean;
  /**
   * @desc 挂载时从左淡入（与 fadeIn 同时设置时优先）。
   * @descEN Left-mask fade-in on mount (wins over fadeIn when both set).
   */
  fadeInLeft?: boolean;
  /**
   * @desc 透传给子菜单 Dropdown 的属性。
   * @descEN Props passed through to the submenu Dropdown.
   */
  dropdownProps?: DropdownProps;
}

