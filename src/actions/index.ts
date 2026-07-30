import type { App } from 'vue';
import Actions from './Actions.vue';
import ActionsAudio from './ActionsAudio.vue';
import ActionsCopy from './ActionsCopy.vue';
import ActionsFeedback from './ActionsFeedback.vue';
import ActionsItem from './ActionsItem.vue';

export type { ActionsProps, ActionItem, ItemType, SubItemType } from './interface';
export type {
  ActionsCopyProps,
  ActionsFeedbackProps,
  ActionsItemProps,
  ActionsAudioProps,
} from './preset-types';
export { FEEDBACK_VALUE, ACTIONS_ITEM_STATUS } from './constants';

type CompoundedActions = typeof Actions & {
  Copy: typeof ActionsCopy;
  Feedback: typeof ActionsFeedback;
  Item: typeof ActionsItem;
  Audio: typeof ActionsAudio;
};

const CompoundActions = Actions as CompoundedActions;
CompoundActions.Copy = ActionsCopy;
CompoundActions.Feedback = ActionsFeedback;
CompoundActions.Item = ActionsItem;
CompoundActions.Audio = ActionsAudio;

// @ts-ignore
CompoundActions.install = function (app: App) {
  app.component(Actions.name, Actions);
  app.component(ActionsCopy.name, ActionsCopy);
  app.component(ActionsFeedback.name, ActionsFeedback);
  app.component(ActionsItem.name, ActionsItem);
  app.component(ActionsAudio.name, ActionsAudio);
  return app;
};

export default CompoundActions;

export {
  CompoundActions as Actions,
  ActionsCopy,
  ActionsFeedback,
  ActionsItem,
  ActionsAudio,
};
