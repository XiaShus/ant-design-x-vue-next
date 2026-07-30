import type { App } from 'vue';
import XMarkdown from './XMarkdown.vue';

export type {
  XMarkdownProps,
  XMarkdownComponents,
  XMarkdownComponentProps,
  StreamingOption,
  StreamStatus,
  DefaultStyleTag,
} from './interface';

// @ts-ignore
XMarkdown.install = function (app: App) {
  app.component(XMarkdown.name, XMarkdown);
  return app;
};

export default XMarkdown;

export { XMarkdown };
export { parseMarkdown } from './parser';
export { sanitizeMarkdownHtml } from './sanitize';
export { escapeHtml } from './escapeHtml';
