import type { MermaidConfig } from 'mermaid';
import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { ActionItem } from '../actions';
import type { CodeHighlighterHighlightProps } from '../code-highlighter';
import type { AvoidValidation } from '../type-utility';

export type MermaidSemanticType = 'root' | 'header' | 'graph' | 'code';

/** Align React `@ant-design/x` export name for Mermaid Semantic DOM keys. */
export type MermaidType = MermaidSemanticType;

export type MermaidRenderType = 'code' | 'image';

export type MermaidActionsConfig = {
  enableZoom?: boolean;
  enableDownload?: boolean;
  enableCopy?: boolean;
  customActions?: ActionItem[];
};

export interface MermaidProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'children'> {
  /**
   * @desc 图表代码内容（也可通过默认插槽传入）
   * @descEN Mermaid source (also available via default slot)
   */
  children?: string;
  /**
   * @desc 顶部内容；为 null 时不显示头部
   * @descEN Header content; no header when null
   */
  header?: AvoidValidation<null | VNode | string | (() => VNode | string | null)>;
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  highlightProps?: CodeHighlighterHighlightProps;
  config?: MermaidConfig;
  actions?: MermaidActionsConfig;
  classNames?: Partial<Record<MermaidSemanticType, string>>;
  styles?: Partial<Record<MermaidSemanticType, CSSProperties>>;
  onRenderTypeChange?: (value: MermaidRenderType) => void;
}

export type MermaidSlots = {
  default?(): any;
  header?(): any;
};

export type MermaidRef = {
  nativeElement: HTMLDivElement | null;
};
