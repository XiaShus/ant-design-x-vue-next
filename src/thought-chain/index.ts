import type { App } from 'vue';
import ThoughtChainComponent from './ThoughtChain.vue';
import ThoughtChainItemComponent from './ThoughtChainItem.vue';

export type {
  ThoughtChainProps,
  ThoughtChainItem,
  ThoughtChainItemType,
  ThoughtChainLine,
  ThoughtChainSemanticType,
  ThoughtChainRef,
} from './interface';
export type { Collapsible, CollapsibleOptions } from './hooks/useCollapsible';
export type {
  ThoughtChainItemProps,
  ThoughtChainItemRef,
  ThoughtChainItemVariant,
  ThoughtChainItemStatus,
  ThoughtChainItemSemanticType,
} from './item-types';

type CompoundedThoughtChain = typeof ThoughtChainComponent & {
  Item: typeof ThoughtChainItemComponent;
};

const ThoughtChain = ThoughtChainComponent as CompoundedThoughtChain;
ThoughtChain.Item = ThoughtChainItemComponent;

// @ts-ignore
ThoughtChain.install = function (app: App) {
  app.component(ThoughtChain.name!, ThoughtChain);
  app.component(ThoughtChainItemComponent.name!, ThoughtChainItemComponent);
  return app;
};

export default ThoughtChain;

export { ThoughtChain, ThoughtChainItemComponent };
