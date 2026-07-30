import type { CSSProperties, VNodeChild } from 'vue';

export type CreationAlign = 'start' | 'center' | 'end';

export interface CreationProps {
  label?: VNodeChild | (() => VNodeChild);
  align?: CreationAlign;
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  icon?: VNodeChild | (() => VNodeChild);
  onClick?: (event?: MouseEvent) => void;
  /** Shortcut key icons shown next to the default label (from Conversations.shortcutKeys). */
  shortcutKeysIcon?: string[];
}
