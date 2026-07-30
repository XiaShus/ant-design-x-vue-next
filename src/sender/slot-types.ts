import type { InputProps, TooltipProps } from 'ant-design-vue';
import type { VNodeChild } from 'vue';

export type InsertPosition = 'start' | 'end' | 'cursor';

export interface SlotConfigBaseType {
  type: 'text' | 'input' | 'select' | 'tag' | 'custom' | 'content' | 'skill';
  formatResult?: (value: any) => string;
}

export interface SlotConfigTextType extends SlotConfigBaseType {
  type: 'text';
  value?: string;
  editable?: boolean;
  placeholder?: string;
  key?: string;
}

export interface SlotConfigContentType extends SlotConfigBaseType {
  type: 'content';
  key: string;
  props?: {
    defaultValue?: any;
    placeholder?: string;
  };
}

export interface SlotConfigInputType extends SlotConfigBaseType {
  type: 'input';
  key: string;
  props?: {
    defaultValue?: InputProps['defaultValue'];
    placeholder?: string;
  };
}

export interface SlotConfigSelectType extends SlotConfigBaseType {
  type: 'select';
  key: string;
  props?: {
    defaultValue?: string;
    options: string[];
    placeholder?: string;
  };
}

export interface SlotConfigTagType extends SlotConfigBaseType {
  type: 'tag';
  key: string;
  props?: {
    label: VNodeChild;
    value?: string;
  };
}

export interface SlotConfigCustomType extends SlotConfigBaseType {
  type: 'custom';
  key: string;
  props?: {
    defaultValue?: any;
    [key: string]: any;
  };
  customRender?: (
    value: any,
    onChange: (value: any) => void,
    props: {
      disabled?: boolean;
      readOnly?: boolean;
    },
    item: SlotConfigType,
  ) => VNodeChild;
}

export type SlotConfigType =
  | SlotConfigTextType
  | SlotConfigInputType
  | SlotConfigSelectType
  | SlotConfigTagType
  | SlotConfigCustomType
  | SlotConfigContentType;

export interface SkillType {
  title?: VNodeChild;
  value: string;
  toolTip?: TooltipProps;
  closable?:
    | boolean
    | {
        closeIcon?: VNodeChild;
        onClose?: (event: MouseEvent) => void;
        disabled?: boolean;
      };
}

export interface InputFocusOptions extends FocusOptions {
  cursor?: 'start' | 'end' | 'all';
}

export interface SlotFocusOptions extends FocusOptions {
  cursor?: 'slot';
  key?: string;
}

export type SlotTextAreaFocusOptions = InputFocusOptions | SlotFocusOptions;

export interface SlotTextAreaRef {
  focus: (options?: SlotTextAreaFocusOptions) => void;
  blur: () => void;
  nativeElement: HTMLDivElement;
  /**
   * Insert plain text (as a text slot) or structured slots.
   * Aligns with React Sender.insert overloads.
   */
  insert: {
    (value: string): void;
    (
      slotConfig: SlotConfigType[],
      position?: InsertPosition,
      replaceCharacters?: string,
      preventScroll?: boolean,
    ): void;
  };
  clear: () => void;
  getValue: () => {
    value: string;
    slotConfig: SlotConfigType[];
    skill?: SkillType;
  };
}

export type SlotConfigWithValue = SlotConfigType & { value?: string };
