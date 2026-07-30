import type { App } from 'vue';
import Mermaid from './Mermaid.vue';

export type {
  MermaidProps,
  MermaidRef,
  MermaidSemanticType,
  MermaidType,
  MermaidRenderType,
  MermaidActionsConfig,
} from './interface';
/** Re-export mermaid package config type used by `MermaidProps.config`. */
export type { MermaidConfig } from 'mermaid';

// @ts-ignore
Mermaid.install = function (app: App) {
  app.component(Mermaid.name, Mermaid);
  return app;
};

export default Mermaid;

export { Mermaid };
