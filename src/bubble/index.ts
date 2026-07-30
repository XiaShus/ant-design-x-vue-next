import type { App } from 'vue';
import BubbleComponent from './Bubble.vue';
import BubbleDivider from './BubbleDivider.vue';
import BubbleList from './BubbleList.vue';
import BubbleSystem from './BubbleSystem.vue';

export type {
  BubbleProps,
  BubbleRef,
  BubbleListProps,
  BubbleListRef,
  BubbleSemanticType,
  ListSemanticType,
  EditableBubbleOption,
  SystemBubbleProps,
  DividerBubbleProps,
  InfoType,
  BubbleDataType,
  BubbleItemType,
  RolesType,
  RoleType,
} from './interface';
// MessageStatus lives in use-x-chat — re-export would clash at package root

const Bubble = Object.assign(BubbleComponent, {
  List: BubbleList,
  System: BubbleSystem,
  Divider: BubbleDivider,
});

// @ts-ignore
Bubble.install = function (app: App) {
  app.component(Bubble.name, Bubble);
  app.component(BubbleList.name, BubbleList);
  app.component(BubbleSystem.name, BubbleSystem);
  app.component(BubbleDivider.name, BubbleDivider);
  return app;
};

export default Bubble;

export { Bubble, BubbleList, BubbleSystem, BubbleDivider };
