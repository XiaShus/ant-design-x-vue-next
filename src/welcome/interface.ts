import type { CSSProperties, VNode } from "vue";
import type { AvoidValidation } from '../type-utility'

/** Align React Welcome SemanticType. */
export type SemanticType = 'root' | 'title' | 'description' | 'icon' | 'extra';

export type WelcomeSemanticType = SemanticType;

export interface WelcomeRef {
  nativeElement: HTMLDivElement;
}

export interface WelcomeProps {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
  variant?: 'filled' | 'borderless';

  // Semantic
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;

  // Layout
  icon?: AvoidValidation<VNode | string | (() => VNode | string)>;
  title?: AvoidValidation<VNode | string | (() => VNode | string)>;
  description?: AvoidValidation<VNode | string | (() => VNode | string)>;
  extra?: AvoidValidation<VNode | string | (() => VNode | string)>;
}
