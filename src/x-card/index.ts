import type { App } from 'vue';
import Box from './Box.vue';
import Card from './Card.vue';

export type {
  A2UICommand,
  A2UICommand_v0_8,
  A2UICommand_v0_9,
  ActionPayload,
  BoxProps,
  Catalog,
  CatalogComponent,
  ComponentWrapper_v0_8,
  LiteralStringValue,
  PathValue,
  XAgentCommand_v0_8,
  XAgentCommand_v0_9,
} from './types';

export {
  registerCatalog,
  loadCatalog,
  validateComponent,
  clearCatalogCache,
} from './catalog';

export { Box, Card };

export const XCard = { Box, Card };

// @ts-ignore
Box.install = function (app: App) {
  app.component(Box.name, Box);
  return app;
};

// @ts-ignore
Card.install = function (app: App) {
  app.component(Card.name, Card);
  return app;
};

export default XCard;
