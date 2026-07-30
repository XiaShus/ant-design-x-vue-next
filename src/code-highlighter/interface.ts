import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { AvoidValidation } from '../type-utility';

export type CodeHighlighterSemanticType = 'root' | 'header' | 'headerTitle' | 'code';

export type CodeHighlighterHighlightProps = {
  className?: string;
  class?: string;
  style?: CSSProperties;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  [key: string]: unknown;
};

export interface CodeHighlighterProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, 'children'> {
  /**
   * @desc 代码语言类型
   * @descEN Code language type
   */
  lang?: string;
  /**
   * @desc 代码内容（也可通过默认插槽传入）
   * @descEN Code content (also available via default slot)
   */
  children?: string;
  /**
   * @desc 头部内容，为 false / null 时不显示头部
   * @descEN Header content; no header when false / null
   */
  header?: AvoidValidation<false | null | VNode | string | (() => VNode | string | false | null)>;
  /**
   * @desc 样式类名的前缀
   * @descEN Prefix for style classnames
   */
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  /**
   * @desc 语法高亮器的额外属性（透传到 pre）
   * @descEN Additional props for the highlighter (passed to pre)
   */
  highlightProps?: CodeHighlighterHighlightProps;
  classNames?: Partial<Record<CodeHighlighterSemanticType, string>>;
  styles?: Partial<Record<CodeHighlighterSemanticType, CSSProperties>>;
  /**
   * @desc 是否使用 Prism 轻量模式，根据 lang 按需加载语言支持以减少打包体积
   * @descEN Whether to use Prism light mode and load language support on demand
   * @default true
   */
  prismLightMode?: boolean;
}

export type CodeHighlighterRef = {
  nativeElement: HTMLDivElement | null;
};

export type CodeHighlighterSlots = {
  default?(): any;
  header?(): any;
};
