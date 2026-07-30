import { Button as AntButton, Checkbox, Divider, Flex, Image, Input, Typography } from 'ant-design-vue';
import { defineComponent, type PropType, type VNodeChild } from 'vue';

type ActionHandler = (name: string, context: Record<string, any>) => void;
type DataChangeHandler = (path: string, value: any) => void;

function resolveActionName(action: any): string {
  return action?.name || action?.event?.name || 'click';
}

/** A2UI Text */
export const A2UIText = defineComponent({
  name: 'A2UIText',
  props: {
    text: { type: String, default: '' },
    variant: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () => (
      <div
        class="ant-x-card-basic-text"
        style={{ marginBottom: slots.default ? 8 : 0 }}
      >
        <Typography.Paragraph>{props.text}</Typography.Paragraph>
        {slots.default?.()}
      </div>
    );
  },
});

/** A2UI Button */
export const A2UIButton = defineComponent({
  name: 'A2UIButton',
  props: {
    text: { type: String, default: '' },
    variant: { type: String as PropType<'primary' | 'default' | 'dashed' | 'link' | 'text'>, default: 'primary' },
    action: { type: Object, default: undefined },
    onAction: { type: Function as PropType<ActionHandler>, default: undefined },
  },
  setup(props, { slots }) {
    return () => (
      <AntButton
        class="ant-x-card-basic-button"
        type={(props.variant as any) || 'primary'}
        onClick={() => props.onAction?.(resolveActionName(props.action), {})}
      >
        {slots.default?.() || props.text}
      </AntButton>
    );
  },
});

/** A2UI TextField */
export const A2UITextField = defineComponent({
  name: 'A2UITextField',
  props: {
    label: { type: String, default: '' },
    value: { type: [String, Number], default: undefined },
    placeholder: { type: String, default: undefined },
    variant: { type: String, default: undefined },
    onDataChange: { type: Function as PropType<DataChangeHandler>, default: undefined },
    /** Injected by XCard.Card when value was a JSON pointer */
    valuePath: { type: String, default: undefined },
  },
  setup(props) {
    return () => {
      const isArea = props.variant === 'longText' || props.variant === 'textarea';
      const Comp = isArea ? Input.TextArea : Input;
      return (
        <div class="ant-x-card-basic-textfield" style={{ marginBottom: 12 }}>
          {props.label ? (
            <div style={{ marginBottom: 4, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{props.label}</div>
          ) : null}
          <Comp
            value={props.value as any}
            placeholder={props.placeholder}
            onUpdate:value={(v: string) => {
              if (props.onDataChange && props.valuePath) {
                props.onDataChange(props.valuePath, v);
              }
            }}
          />
        </div>
      );
    };
  },
});

/** A2UI CheckBox */
export const A2UICheckBox = defineComponent({
  name: 'A2UICheckBox',
  props: {
    label: { type: String, default: '' },
    value: { type: Boolean, default: false },
    onDataChange: { type: Function as PropType<DataChangeHandler>, default: undefined },
    valuePath: { type: String, default: undefined },
  },
  setup(props) {
    return () => (
      <Checkbox
        class="ant-x-card-basic-checkbox"
        checked={!!props.value}
        onUpdate:checked={(v: boolean) => {
          if (props.onDataChange && props.valuePath) props.onDataChange(props.valuePath, v);
        }}
      >
        {props.label}
      </Checkbox>
    );
  },
});

/** A2UI Column */
export const A2UIColumn = defineComponent({
  name: 'A2UIColumn',
  props: {
    justify: { type: String, default: undefined },
    align: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () => (
      <Flex
        class="ant-x-card-basic-column"
        vertical
        gap="small"
        justify={props.justify as any}
        align={props.align as any}
      >
        {slots.default?.() as VNodeChild}
      </Flex>
    );
  },
});

/** A2UI Row */
export const A2UIRow = defineComponent({
  name: 'A2UIRow',
  props: {
    justify: { type: String, default: undefined },
    align: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () => (
      <Flex
        class="ant-x-card-basic-row"
        gap="small"
        justify={props.justify as any}
        align={props.align as any}
        wrap="wrap"
      >
        {slots.default?.() as VNodeChild}
      </Flex>
    );
  },
});

/** A2UI Divider */
export const A2UIDivider = defineComponent({
  name: 'A2UIDivider',
  props: {
    axis: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  setup(props) {
    return () => (
      <Divider
        class="ant-x-card-basic-divider"
        type={props.axis === 'vertical' ? 'vertical' : 'horizontal'}
        style={{ margin: '8px 0' }}
      />
    );
  },
});

/** A2UI Image */
export const A2UIImage = defineComponent({
  name: 'A2UIImage',
  props: {
    url: { type: String, default: '' },
    description: { type: String, default: undefined },
    fit: { type: String, default: 'cover' },
  },
  setup(props) {
    return () => (
      <Image
        class="ant-x-card-basic-image"
        src={props.url}
        wrapperStyle={{ maxWidth: '100%', objectFit: props.fit as any }}
        {...(props.description ? { title: props.description } : {})}
      />
    );
  },
});

/** A2UI Card (visual container) */
export const A2UICard = defineComponent({
  name: 'A2UICard',
  setup(_, { slots }) {
    return () => (
      <div
        class="ant-x-card-basic-card"
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          padding: 12,
          background: '#fff',
        }}
      >
        {slots.default?.()}
      </div>
    );
  },
});
