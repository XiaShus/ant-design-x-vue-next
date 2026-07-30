import type { Config as DOMPurifyConfig } from 'dompurify';
import type { MarkedExtension } from 'marked';
import type { Component, CSSProperties, HTMLAttributes } from 'vue';

export type StreamStatus = 'loading' | 'done';

export interface AnimationConfig {
  /**
   * @desc 淡入动画时长（毫秒）
   * @descEN Fade-in animation duration in milliseconds
   * @default 200
   */
  fadeDuration?: number;
  /**
   * @desc 动画缓动函数
   * @descEN Animation easing function
   * @default 'ease-in-out'
   */
  easing?: string;
}

export enum StreamCacheTokenType {
  Text = 'text',
  Link = 'link',
  Image = 'image',
  Html = 'html',
  Emphasis = 'emphasis',
  List = 'list',
  Table = 'table',
  InlineCode = 'inline-code',
}

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
   * @desc 是否还有后续内容块；为 true 时启用增量 token 缓存
   * @descEN Whether more content chunks are expected; enables incremental token cache when true
   * @default false
   */
  hasNextChunk?: boolean;
  /**
   * @desc 尾部光标；`true` 使用默认 `|`，或传入自定义内容
   * @descEN Tail cursor; `true` for default `|`, or custom content
   * @default false
   */
  tail?: boolean | { content?: string };
  /**
   * @desc 未完成 Markdown 语法映射到自定义加载组件名
   * @descEN Map incomplete markdown tokens to custom loading component names
   */
  incompleteMarkdownComponentMap?: Partial<
    Record<Exclude<StreamCacheTokenType, StreamCacheTokenType.Text>, string>
  >;
  /**
   * @desc 为块级文本启用淡入动画
   * @descEN Enable fade-in animation for block text nodes
   * @default false
   */
  enableAnimation?: boolean;
  /**
   * @desc 文字出现动画配置
   * @descEN Text appearance animation config
   */
  animationConfig?: AnimationConfig;
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
  /**
   * @desc 显示性能调试浮层（FPS / Memory / 录制）
   * @descEN Show performance debug overlay (FPS / Memory / record)
   * @default false
   */
  debug?: boolean;
}

export type XMarkdownSlots = {
  default?(): any;
};
