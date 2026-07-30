import type { CascaderProps } from 'ant-design-vue';
import type { CSSProperties, VNode } from 'vue';

/** Align React Suggestion SemanticType. */
export type SuggestionSemanticType = 'root' | 'content' | 'popup';

export type SuggestionItem = {
  label: VNode | string;
  value: string;

  icon?: VNode;

  children?: SuggestionItem[];

  extra?: VNode | string;
};

export interface RenderChildrenProps<T> {
  onTrigger: (info?: T | false) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  open: boolean;
}

/** Cascader keys Suggestion owns / overrides (align React Omit list). */
type SuggestionOmittedCascaderKeys =
  | 'children'
  | 'onChange'
  | 'optionRender'
  | 'value'
  | 'options'
  | 'multiple'
  | 'showSearch'
  | 'defaultValue'
  | 'fieldNames'
  | 'onOpenChange'
  | 'onDropdownVisibleChange'
  | 'dropdownMatchSelectWidth'
  | 'popupMatchSelectWidth'
  | 'open'
  | 'rootClassName'
  | 'placement'
  | 'styles'
  | 'classNames';

/**
 * Align React Suggestion: Cascader props are forwarded via `...otherProps`
 * except controlled/internal keys listed above.
 */
export type SuggestionCascaderPassthrough = /* @vue-ignore */ Omit<
  CascaderProps,
  SuggestionOmittedCascaderKeys
>;

export interface SuggestionProps<T = any> extends SuggestionCascaderPassthrough {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  children?: (props: RenderChildrenProps<T>) => VNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: SuggestionItem[] | ((info?: T) => SuggestionItem[]);
  onSelect?: (value: string, selectedOptions: SuggestionItem[]) => void;
  block?: boolean;
  styles?: Partial<Record<SuggestionSemanticType, CSSProperties>>;
  classNames?: Partial<Record<SuggestionSemanticType, string>>;
  /**
   * Menu render parent node. Default renders to `body`.
   * Useful when the dropdown is clipped by overflow containers.
   */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}
