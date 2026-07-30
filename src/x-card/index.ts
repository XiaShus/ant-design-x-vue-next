import type { App } from 'vue';
import Box from './Box.vue';
import Card from './Card.vue';

export type {
  A2UICommand_v0_9,
  ActionPayload,
  BoxProps,
  Catalog,
  CatalogComponent,
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
