import type { CSSProperties, VNodeChild } from 'vue';
import type {
  ACTIONS_ITEM_STATUS,
  ActionsAudioSemanticType,
  ActionsCopySemanticType,
  ActionsFeedbackSemanticType,
  ActionsItemSemanticType,
  FEEDBACK_VALUE,
} from './constants';

export interface ActionsCopyProps {
  text?: string;
  icon?: VNodeChild | [VNodeChild, VNodeChild];
  prefixCls?: string;
  rootClassName?: string;
  classNames?: Partial<Record<ActionsCopySemanticType, string>>;
  styles?: Partial<Record<ActionsCopySemanticType, CSSProperties>>;
}

export interface ActionsFeedbackProps {
  value?: `${FEEDBACK_VALUE}`;
  prefixCls?: string;
  rootClassName?: string;
  classNames?: Partial<Record<ActionsFeedbackSemanticType, string>>;
  styles?: Partial<Record<ActionsFeedbackSemanticType, CSSProperties>>;
}

export interface ActionsItemProps {
  status?: `${ACTIONS_ITEM_STATUS}`;
  defaultIcon?: VNodeChild;
  label?: string;
  runningIcon?: VNodeChild;
  prefixCls?: string;
  rootClassName?: string;
  classNames?: Partial<Record<ActionsItemSemanticType, string>>;
  styles?: Partial<Record<ActionsItemSemanticType, CSSProperties>>;
}

export interface ActionsAudioProps {
  status?: `${ACTIONS_ITEM_STATUS}`;
  prefixCls?: string;
  rootClassName?: string;
  classNames?: Partial<Record<ActionsAudioSemanticType, string>>;
  styles?: Partial<Record<ActionsAudioSemanticType, CSSProperties>>;
}
