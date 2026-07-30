import type { App } from 'vue';
import SenderComponent from './Sender.vue';
import SenderHeader from './SenderHeader.vue';
import SenderSwitch from './SenderSwitch.vue';

export type {
  SenderProps,
  SenderRef,
  SenderSemanticType,
  SenderComponents,
  ActionsComponents,
  SenderHeaderProps,
  SuffixRender,
  ActionsRender,
  FooterRender,
  SubmitType,
} from './interface';
export type { SenderSwitchProps, SenderSwitchRef } from './switch-types';
export type {
  SkillType,
  SlotConfigType,
  SlotConfigBaseType,
  SlotConfigWithValue,
  SlotConfigTextType,
  SlotConfigContentType,
  SlotConfigInputType,
  SlotConfigSelectType,
  SlotConfigTagType,
  SlotConfigCustomType,
  InsertPosition,
  SlotTextAreaRef,
  SlotTextAreaFocusOptions,
  InputFocusOptions,
  SlotFocusOptions,
} from './slot-types';
export type { AllowSpeech, ControlledSpeechConfig } from './useSpeech';
/** Docs alias for `ControlledSpeechConfig` (align React speech config naming in demos). */
export type { ControlledSpeechConfig as SpeechConfig } from './useSpeech';

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
