import type { App } from 'vue';
import Suggestion from './Suggestion.vue';

export type {
  SuggestionProps,
  SuggestionSemanticType,
  SuggestionItem,
  SuggestionCascaderPassthrough,
  RenderChildrenProps,
} from './interface';

// @ts-ignore
Suggestion.install = function(app: App) {
  app.component(Suggestion.name, Suggestion);
  return app;
}

export default Suggestion;

export {
  Suggestion,
}
