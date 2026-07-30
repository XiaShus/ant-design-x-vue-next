import type { Config as DOMPurifyConfig } from 'dompurify';
import type { MarkedExtension } from 'marked';
import type { Component, CSSProperties, HTMLAttributes, VNode } from 'vue';

export type StreamStatus = 'loading' | 'done';

export type DefaultStyleTag =
  | 'p'
  | 'ul'
  | 'ol'
  | 'li'
  | 'pre'
  | 'code'
  | 'table'
  | 'th'
  | 'td'
  | 'img'
  | 'hr';

export type XMarkdownComponentProps = HTMLAttributes & {
  /**
   * @desc 流式状态
   * @descEN Streaming status
   */
  streamStatus?: StreamStatus;
  /**
   * @desc 代码块 info string（语言）
   * @descEN Fenced code language
   */
  lang?: string;
  /**
   * @desc 是否为块级 code
   * @descEN Whether it is a block code
   */
  block?: boolean;
};

export type XMarkdownComponents = Record<
  string,
  Component<XMarkdownComponentProps> | string
>;

export type StreamingOption = {
  /**
   * @desc 是否还有后续内容块
   * @descEN Whether more content chunks are expected
   * @default false
   */
  hasNextChunk?: boolean;
  /**
   * @desc 尾部光标；`true` 使用默认 `▍`，或传入自定义内容
   * @descEN Tail cursor; `true` for default `▍`, or custom content
   * @default false
   */
  tail?: boolean | { content?: string };
};

export interface XMarkdownProps {
  /**
   * @desc Markdown 内容
   * @descEN Markdown content
   */
  content?: string;
  /**
   * @desc Markdown 内容（content 别名，也可通过默认插槽传入）
   * @descEN Markdown content alias
   */
  children?: string;
  /**
   * @desc 自定义标签组件映射
   * @descEN Custom tag → component map
   */
  components?: XMarkdownComponents;
  /**
   * @desc 流式渲染配置
   * @descEN Streaming render options
   */
  streaming?: StreamingOption;
  /**
   * @desc Marked.js 扩展配置
   * @descEN Marked.js config
   */
  config?: MarkedExtension;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  /**
   * @desc 链接是否在新标签打开
   * @descEN Open links in a new tab
   */
  openLinksInNewTab?: boolean;
  /**
   * @desc DOMPurify 配置
   * @descEN DOMPurify config
   */
  dompurifyConfig?: DOMPurifyConfig;
  /**
   * @desc 转义 Markdown 中的原始 HTML（不信任模型输出时务必开启）
   * @descEN Escape raw HTML tokens in markdown (enable for untrusted LLM output)
   * @default false
   */
  escapeRawHtml?: boolean;
  /**
   * @desc 关闭内置默认样式（全部或指定标签）
   * @descEN Disable built-in default styles
   */
  disableDefaultStyles?: boolean | DefaultStyleTag[];
}

export type XMarkdownSlots = {
  default?(): any;
};
