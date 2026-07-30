import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { AnyObject } from '../_util/type';
import GroupTitle from './GroupTitle.vue';
import type { ConfigProviderProps, DirectionType } from 'ant-design-vue/es/config-provider';
import type { MenuProps } from 'ant-design-vue';
import type { AvoidValidation } from '../type-utility';
import type { CreationProps } from './creation-types';
import type { ShortcutKeys } from '../_util/shortcut-keys';

export type { CreationProps, CreationAlign } from './creation-types';
export type { ShortcutKeys } from '../_util/shortcut-keys';
export { ShortcutKeyCode } from '../_util/shortcut-keys';

type GroupType = string;

/**
 * @desc 会话数据
 * @descEN Conversation data
 */
export interface Conversation extends AnyObject {
  /**
   * @desc 唯一标识
   * @descEN Unique identifier
   */
  key: string;

  /**
   * @desc 会话名称
   * @descEN Conversation name
   */
  label?: VNode | string;

  /**
   * @desc 会话时间戳
   * @descEN Conversation timestamp
   */
  timestamp?: number;

  /**
   * @desc 会话分组类型，与 {@link ConversationsProps.groupable} 联动
   * @descEN Conversation type
   */
  group?: GroupType;

  /**
   * @desc 会话图标
   * @descEN conversation icon
   */
  icon?: VNode;

  /**
   * @desc 是否禁用
   * @descEN Whether to disable
   */
  disabled?: boolean;

  /** Present only on divider items; conversation items must omit this. */
  type?: undefined;
}

/** Align React `ConversationItemType`. */
export type ConversationItemType = Conversation;

/**
 * @desc 分割线项（对齐 React）
 * @descEN Divider item type
 */
export interface DividerItemType {
  type: 'divider';
  key?: string;
  dashed?: boolean;
}

/**
 * Align React conversations `ItemType`.
 * Not re-exported from package root (conflicts with Actions `ItemType`).
 */
export type ItemType = ConversationItemType | DividerItemType;

/** Public alias for the conversations items union (avoids Actions.ItemType clash). */
export type ConversationsItems = ItemType;

export const isDividerItem = (item: ItemType): item is DividerItemType =>
  !!item && (item as DividerItemType).type === 'divider';

/** Align React Conversations SemanticType. */
export type ConversationsSemanticType = 'root' | 'creation' | 'group' | 'item';

/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends HTMLAttributes {
  /**
   * @desc 会话列表数据源（可含 divider）
   * @descEN Data source for the conversation list (may include dividers)
   */
  items?: ConversationsItems[];

  /**
   * @desc 当前选中的值
   * @descEN Currently selected value
   */
  activeKey?: Conversation['key'];

  /**
   * @desc 默认选中值
   * @descEN Default selected value
   */
  defaultActiveKey?: Conversation['key'];

  /**
   * @desc 选中变更回调（第二参为对应会话项，对齐 React）
   * @descEN Callback for selection change; second arg is the matched item
   */
  onActiveChange?: (value: Conversation['key'], item?: ConversationsItems) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?: ConversationsItemProps['menu'] | ((value: Conversation) => ConversationsItemProps['menu']);

  /**
   * @desc 是否支持分组, 开启后默认按 {@link Conversation.group} 字段分组
   * @descEN If grouping is supported, it defaults to the {@link Conversation.group} field
   */
  groupable?: AvoidValidation<boolean | Groupable>;

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<ConversationsSemanticType, CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<ConversationsSemanticType, string>>;

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

  /**
   * @desc 新建对话按钮配置；传入即显示
   * @descEN New chat button config
   */
  creation?: CreationProps;

  /**
   * @desc 快捷键：创建 新建对话；items 切换会话（数字键或方向键等）
   * @descEN Shortcut keys for creation / item activation
   */
  shortcutKeys?: {
    creation?: ShortcutKeys<number>;
    items?: ShortcutKeys<'number'> | ShortcutKeys<number>[];
  };
}

export interface ConversationsItemProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'onClick'> {
  info: Conversation;
  prefixCls?: string;
  direction?: DirectionType;
  menu?: MenuProps & {
    trigger?:
      | VNode
      | ((conversation: Conversation, info: { originNode: VNode }) => VNode);
      getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  };
  active?: boolean;
  onClick?: (info: Conversation) => void;
}

export type GroupSorter = Parameters<GroupType[]['sort']>[0];

export type GroupTitleRenderComponents = {
  components: {
    GroupTitle: typeof GroupTitle;
  };
};

export type GroupTitleRender =
  | ((group: GroupType, info: GroupTitleRenderComponents) => VNode)
  | undefined;

export type GroupCollapsible = boolean | ((group: string) => boolean);

export type GroupLabel =
  | VNode
  | string
  | ((
      group: string,
      info: { groupInfo: { name?: string; data: ConversationsItems[] } },
    ) => VNode | string)
  | undefined;

export interface Groupable {
  /**
   * @desc 分组排序函数
   * @descEN Group sorter
   */
  sort?: GroupSorter;
  /**
   * @desc 自定义分组标签渲染（历史 API）
   * @descEN Semantic custom rendering (legacy)
   */
  title?: GroupTitleRender;
  /**
   * @desc 分组标题（对齐 React `label`）
   * @descEN Group label (React-aligned)
   */
  label?: GroupLabel;
  /**
   * @desc 是否可折叠；可为按分组函数
   * @descEN Whether groups are collapsible
   */
  collapsible?: GroupCollapsible;
  /**
   * @desc 默认展开的分组 key
   * @descEN Default expanded group keys
   */
  defaultExpandedKeys?: string[];
  /**
   * @desc 受控展开分组 key
   * @descEN Controlled expanded group keys
   */
  expandedKeys?: string[];
  /**
   * @desc 展开/收起回调
   * @descEN Expand/collapse callback
   */
  onExpand?: (expandedKeys: string[]) => void;
}

export interface GroupTitleContextProps {
  prefixCls?: ConfigProviderProps['prefixCls'];
}
