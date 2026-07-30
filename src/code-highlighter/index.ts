import type { App } from 'vue';
import CodeHighlighter from './CodeHighlighter.vue';

export type {
  CodeHighlighterProps,
  CodeHighlighterRef,
  CodeHighlighterSemanticType,
  CodeHighlighterHighlightProps,
} from './interface';

// @ts-ignore
CodeHighlighter.install = function (app: App) {
  app.component(CodeHighlighter.name, CodeHighlighter);
  return app;
};

export default CodeHighlighter;

export { CodeHighlighter };
