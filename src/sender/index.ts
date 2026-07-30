import type { App } from 'vue';
import SenderComponent from './Sender.vue';
import SenderHeader from './SenderHeader.vue';
import SenderSwitch from './SenderSwitch.vue';

export type { SenderProps } from './interface';
export type { SenderSwitchProps } from './switch-types';
export type {
  SkillType,
  SlotConfigType,
  InsertPosition,
  SlotTextAreaRef,
  SlotTextAreaFocusOptions,
  InputFocusOptions,
  SlotFocusOptions,
} from './slot-types';

const Sender = Object.assign(SenderComponent, {
  Header: SenderHeader,
  Switch: SenderSwitch,
});

// @ts-ignore
Sender.install = function (app: App) {
  app.component(Sender.name, Sender);
  app.component(SenderHeader.name, SenderHeader);
  app.component(SenderSwitch.name, SenderSwitch);
  return app;
};

export default Sender;

export { Sender, SenderHeader, SenderSwitch };
