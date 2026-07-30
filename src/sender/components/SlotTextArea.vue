<script setup lang="tsx">
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { Dropdown, Input, Menu } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, ref, watch, type CSSProperties } from 'vue';
import Skill from './Skill.vue';
import type {
  InsertPosition,
  SkillType,
  SlotConfigType,
  SlotConfigWithValue,
} from '../slot-types';
import type { ChangeEvent, KeyboardEventHandler } from '../interface';

defineOptions({ name: 'AXSenderSlotTextArea' });

const SUPPORTED_INPUT_TYPES = new Set(['input', 'select', 'custom', 'content']);

const props = defineProps<{
  prefixCls: string;
  slotConfig?: readonly SlotConfigType[];
  skill?: SkillType;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  class?: string;
  submitType?: 'enter' | 'shiftEnter' | false;
  onChange?: (
    value: string,
    event?: ChangeEvent,
    slotConfig?: SlotConfigType[],
    skill?: SkillType,
  ) => void;
  onKeyPress?: KeyboardEventHandler;
  onKeyDown?: KeyboardEventHandler;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const insertedSlots = ref<SlotConfigType[]>([]);
const runtimeKeys = ref<Set<string>>(new Set());
const slotValues = ref<Record<string, any>>({});
const currentSkill = ref<SkillType | undefined>(props.skill);
const isCompositionRef = ref(false);

const slotCls = computed(() => `${props.prefixCls}-slot`);
const slotInputCls = computed(() => `${props.prefixCls}-slot-input`);
const slotSelectCls = computed(() => `${props.prefixCls}-slot-select`);
const slotTagCls = computed(() => `${props.prefixCls}-slot-tag`);
const slotContentCls = computed(() => `${props.prefixCls}-slot-content`);
const inputCls = computed(() => `${props.prefixCls}-input`);

const buildSlotValues = (config: readonly SlotConfigType[]): Record<string, any> =>
  config.reduce<Record<string, any>>((acc, node) => {
    const key = node.key;
    if (!key) {
      return acc;
    }
    const nodeProps = (node as any).props || {};
    const defaultValue = SUPPORTED_INPUT_TYPES.has(node.type)
      ? nodeProps.defaultValue
      : (nodeProps.value ?? nodeProps.label);
    acc[key] = defaultValue ?? '';
    return acc;
  }, {});

const mergedSlots = computed(() => [...(props.slotConfig ?? []), ...insertedSlots.value]);

watch(
  () => props.slotConfig,
  (config) => {
    if (!config) {
      return;
    }
    const nextValues = buildSlotValues(config);
    runtimeKeys.value.forEach((key) => {
      if (key in slotValues.value) {
        nextValues[key] = slotValues.value[key];
      }
    });
    slotValues.value = nextValues;
  },
  { immediate: true, deep: true },
);

watch(
  () => props.skill,
  (skill) => {
    currentSkill.value = skill;
  },
  { immediate: true },
);

const getSlotValue = (item: SlotConfigType): any => {
  if (item.type === 'text') {
    return item.value ?? '';
  }
  if (item.type === 'tag') {
    return item.props?.value ?? item.props?.label ?? '';
  }
  if (item.key) {
    return slotValues.value[item.key] ?? '';
  }
  return '';
};

const formatSlotValue = (item: SlotConfigType, rawValue: any): string => {
  const formatted = item.formatResult?.(rawValue);
  if (formatted !== undefined) {
    return formatted;
  }
  if (rawValue === null || rawValue === undefined) {
    return '';
  }
  if (typeof rawValue === 'object') {
    return String(rawValue);
  }
  return String(rawValue);
};

const buildMessage = (): string =>
  mergedSlots.value
    .map((item) => formatSlotValue(item, getSlotValue(item)))
    .join('');

const buildSlotConfigWithValues = (): SlotConfigWithValue[] =>
  mergedSlots.value.map((item) => ({
    ...item,
    value: formatSlotValue(item, getSlotValue(item)),
  }));

const emitChange = () => {
  const value = buildMessage();
  props.onChange?.(value, undefined, buildSlotConfigWithValues(), currentSkill.value);
};

const setSlotValue = (key: string, value: any) => {
  slotValues.value = { ...slotValues.value, [key]: value };
  emitChange();
};

const getValue = () => ({
  value: buildMessage(),
  slotConfig: buildSlotConfigWithValues(),
  skill: currentSkill.value,
});

const insert = (slots: SlotConfigType[], position: InsertPosition = 'end') => {
  const newValues = buildSlotValues(slots);
  slots.forEach((node) => {
    if (node.key) {
      runtimeKeys.value.add(node.key);
    }
  });

  if (position === 'start') {
    insertedSlots.value = [...slots, ...insertedSlots.value];
  } else {
    insertedSlots.value = [...insertedSlots.value, ...slots];
  }

  slotValues.value = { ...slotValues.value, ...newValues };
  emitChange();
};

const clear = () => {
  insertedSlots.value = [];
  runtimeKeys.value.clear();
  slotValues.value = buildSlotValues(props.slotConfig ?? []);
  currentSkill.value = props.skill;
  emitChange();
};

const focus = () => {
  containerRef.value?.focus();
};

const blur = () => {
  containerRef.value?.blur();
};

const removeSkill = () => {
  currentSkill.value = undefined;
  emitChange();
};

const onInternalCompositionStart = () => {
  isCompositionRef.value = true;
};

const onInternalCompositionEnd = () => {
  isCompositionRef.value = false;
};

const onInternalKeyDown: KeyboardEventHandler = (e) => {
  const canSubmit = e.key === 'Enter' && !isCompositionRef.value;
  const submitType = props.submitType ?? 'enter';

  switch (submitType) {
    case 'enter':
      if (canSubmit && !e.shiftKey) {
        e.preventDefault();
      }
      break;
    case 'shiftEnter':
      if (canSubmit && e.shiftKey) {
        e.preventDefault();
      }
      break;
  }

  props.onKeyDown?.(e);
};

const onInternalKeyPress: KeyboardEventHandler = (e) => {
  props.onKeyPress?.(e);
};

const renderSelect = (item: SlotConfigType & { type: 'select' }) => {
  const key = item.key;
  const options = item.props?.options ?? [];
  const currentValue = slotValues.value[key] ?? item.props?.defaultValue ?? '';
  const isPlaceholder = !currentValue;

  const menu = (
    <Menu
      onClick={({ key: optionKey }) => {
        if (!props.disabled && !props.readOnly) {
          setSlotValue(key, optionKey);
        }
      }}
      items={options.map((option) => ({
        key: option,
        label: option,
      }))}
    />
  );

  return (
    <Dropdown trigger={['click']} disabled={props.disabled || props.readOnly}>
      {{
        overlay: () => menu,
        default: () => (
          <span
            class={classnames(slotSelectCls.value, slotCls.value, {
              placeholder: isPlaceholder,
            })}
            data-slot-key={key}
          >
            <span
              class={`${slotSelectCls.value}-value`}
              data-placeholder={item.props?.placeholder}
            >
              {currentValue || ''}
            </span>
            <span class={`${slotSelectCls.value}-arrow`}>
              <CaretDownOutlined />
            </span>
          </span>
        ),
      }}
    </Dropdown>
  );
};

const renderSlot = (item: SlotConfigType, index: number) => {
  switch (item.type) {
    case 'text':
      return (
        <span key={item.key ?? `text-${index}`} class={slotCls.value}>
          {item.value}
        </span>
      );
    case 'input':
      return (
        <Input
          key={item.key}
          bordered={false}
          disabled={props.disabled}
          readonly={props.readOnly}
          class={classnames(slotInputCls.value, slotCls.value)}
          placeholder={item.props?.placeholder}
          value={slotValues.value[item.key] ?? ''}
          onUpdate:value={(val: string) => setSlotValue(item.key, val)}
          onCompositionstart={onInternalCompositionStart}
          onCompositionend={onInternalCompositionEnd}
        />
      );
    case 'content':
      return (
        <Input
          key={item.key}
          bordered={false}
          disabled={props.disabled}
          readonly={props.readOnly}
          class={classnames(slotContentCls.value, slotCls.value)}
          placeholder={item.props?.placeholder}
          value={slotValues.value[item.key] ?? ''}
          onUpdate:value={(val: string) => setSlotValue(item.key, val)}
          onCompositionstart={onInternalCompositionStart}
          onCompositionend={onInternalCompositionEnd}
        />
      );
    case 'select':
      return renderSelect(item);
    case 'tag':
      return (
        <span
          key={item.key}
          class={classnames(slotTagCls.value, slotCls.value)}
          data-slot-key={item.key}
        >
          {item.props?.label}
        </span>
      );
    case 'custom':
      return (
        <span key={item.key} class={slotCls.value} data-slot-key={item.key}>
          {item.customRender?.(
            slotValues.value[item.key],
            (val) => setSlotValue(item.key, val),
            { disabled: props.disabled, readOnly: props.readOnly },
            item,
          )}
        </span>
      );
    default:
      return null;
  }
};

defineExpose({
  getValue,
  insert,
  clear,
  focus,
  blur,
  nativeElement: containerRef,
});

defineRender(() => {
  const showPlaceholder = !mergedSlots.value.length && !currentSkill.value && props.placeholder;

  return (
    <div
      ref={containerRef}
      class={classnames(inputCls.value, `${inputCls.value}-slot`, props.class)}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        ...props.style,
      }}
      tabindex={0}
      data-placeholder={showPlaceholder ? props.placeholder : undefined}
      onKeydown={onInternalKeyDown}
      onKeypress={onInternalKeyPress}
    >
      {currentSkill.value && (
        <Skill
          {...currentSkill.value}
          prefixCls={props.prefixCls}
          removeSkill={removeSkill}
        />
      )}
      {mergedSlots.value.map((item, index) => renderSlot(item, index))}
    </div>
  );
});
</script>
