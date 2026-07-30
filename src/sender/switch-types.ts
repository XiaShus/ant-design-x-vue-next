import type { CSSProperties, VNodeChild } from 'vue';

type SemanticType = 'root' | 'content' | 'icon' | 'title';

export interface SenderSwitchProps {
  prefixCls?: string;
  rootClassName?: string;
  checkedChildren?: VNodeChild;
  unCheckedChildren?: VNodeChild;
  value?: boolean;
  defaultValue?: boolean;
  icon?: VNodeChild;
  loading?: boolean;
  disabled?: boolean;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
}
