<script setup lang="tsx">
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { Dropdown, Input, Menu } from 'ant-design-vue';
import classnames from 'classnames';
import {
  computed,
  nextTick,
  onBeforeUpdate,
  onUpdated,
  ref,
  watch,
  type CSSProperties,
} from 'vue';
import Skill from './Skill.vue';
import type {
  InsertPosition,
  SkillType,
  SlotConfigType,
  SlotConfigWithValue,
  SlotTextAreaFocusOptions,
  SlotTextAreaRef,
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
const normalizedConfig = ref<SlotConfigType[]>([]);
const insertedSlots = ref<SlotConfigType[]>([]);
const runtimeKeys = ref<Set<string>>(new Set());
const slotValues = ref<Record<string, any>>({});
const textContents = ref<Record<string, string>>({});
const currentSkill = ref<SkillType | undefined>(props.skill);
const isCompositionRef = ref(false);
const editableDomMap = new Map<string, HTMLElement>();
let savedSelectionRange: Range | null = null;
let textKeySeq = 0;

const slotCls = computed(() => `${props.prefixCls}-slot`);
const slotInputCls = computed(() => `${props.prefixCls}-slot-input`);
const slotSelectCls = computed(() => `${props.prefixCls}-slot-select`);
const slotTagCls = computed(() => `${props.prefixCls}-slot-tag`);
const slotContentCls = computed(() => `${props.prefixCls}-slot-content`);
const inputCls = computed(() => `${props.prefixCls}-input`);

const isEditable = computed(() => !props.disabled && !props.readOnly);

const getTextKey = (item: SlotConfigType) => item.key || '';

const ensureSlotKeys = (slots: readonly SlotConfigType[], prefix: string): SlotConfigType[] =>
  slots.map((slot, index) => {
    if (slot.type === 'text' && !slot.key) {
      return { ...slot, key: `${prefix}_${index}` };
    }
    return slot;
  });

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

const buildTextContents = (config: readonly SlotConfigType[]): Record<string, string> =>
  config.reduce<Record<string, string>>((acc, node) => {
    if (node.type === 'text') {
      const key = getTextKey(node);
      if (key) {
        acc[key] = node.value ?? '';
      }
    }
    return acc;
  }, {});

const mergedSlots = computed(() => [...normalizedConfig.value, ...insertedSlots.value]);

const syncEditableDomFromState = () => {
  editableDomMap.forEach((el, mapKey) => {
    if (document.activeElement === el) {
      return;
    }
    const [type, key] = mapKey.split('::');
    const next =
      type === 'text'
        ? (textContents.value[key] ?? '')
        : String(slotValues.value[key] ?? '');
    if (el.textContent !== next) {
      el.textContent = next;
    }
  });
};

const registerEditableDom = (mapKey: string, el: HTMLElement | null) => {
  if (!el) {
    editableDomMap.delete(mapKey);
    return;
  }
  editableDomMap.set(mapKey, el);
  const [type, key] = mapKey.split('::');
  const next =
    type === 'text'
      ? (textContents.value[key] ?? '')
      : String(slotValues.value[key] ?? '');
  if (document.activeElement !== el && el.textContent !== next) {
    el.textContent = next;
  }
};

const syncStateFromEditableDom = () => {
  let changed = false;
  editableDomMap.forEach((el, mapKey) => {
    const [type, key] = mapKey.split('::');
    const text = el.textContent ?? '';
    if (type === 'text') {
      if (textContents.value[key] !== text) {
        textContents.value = { ...textContents.value, [key]: text };
        changed = true;
      }
      return;
    }
    if (slotValues.value[key] !== text) {
      slotValues.value = { ...slotValues.value, [key]: text };
      changed = true;
    }
  });
  return changed;
};

watch(
  () => props.slotConfig,
  (config) => {
    normalizedConfig.value = ensureSlotKeys(config ?? [], 'cfg');
    const nextValues = buildSlotValues(normalizedConfig.value);
    runtimeKeys.value.forEach((key) => {
      if (key in slotValues.value) {
        nextValues[key] = slotValues.value[key];
      }
    });
    slotValues.value = nextValues;

    const baseText = buildTextContents(normalizedConfig.value);
    const insertedText = buildTextContents(insertedSlots.value);
    textContents.value = {
      ...baseText,
      ...insertedText,
      ...Object.fromEntries(
        Object.entries(textContents.value).filter(([key]) => runtimeKeys.value.has(key)),
      ),
    };
    nextTick(syncEditableDomFromState);
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

watch([slotValues, textContents], () => {
  nextTick(syncEditableDomFromState);
});

onBeforeUpdate(() => {
  const root = containerRef.value;
  const selection = window.getSelection();
  if (
    root &&
    selection &&
    selection.rangeCount > 0 &&
    selection.anchorNode &&
    root.contains(selection.anchorNode)
  ) {
    try {
      savedSelectionRange = selection.getRangeAt(0).cloneRange();
    } catch {
      savedSelectionRange = null;
    }
  } else {
    savedSelectionRange = null;
  }
});

onUpdated(() => {
  syncEditableDomFromState();
  if (!savedSelectionRange) {
    return;
  }
  const selection = window.getSelection();
  const root = containerRef.value;
  if (!selection || !root) {
    savedSelectionRange = null;
    return;
  }
  try {
    selection.removeAllRanges();
    selection.addRange(savedSelectionRange);
  } catch {
    // Range may be stale after structural slot changes
  }
  savedSelectionRange = null;
});

const getSlotValue = (item: SlotConfigType): any => {
  if (item.type === 'text') {
    const key = getTextKey(item);
    const dom = key ? editableDomMap.get(`text::${key}`) : undefined;
    const stateVal = key ? textContents.value[key] : undefined;
    // Prefer hydrated state when DOM node exists but has not been filled yet
    if (dom && !(dom.textContent === '' && stateVal)) {
      return dom.textContent ?? '';
    }
    return stateVal ?? item.value ?? '';
  }
  if (item.type === 'tag') {
    return item.props?.value ?? item.props?.label ?? '';
  }
  if (item.type === 'content' && item.key) {
    const dom = editableDomMap.get(`content::${item.key}`);
    const stateVal = slotValues.value[item.key];
    if (dom && !(dom.textContent === '' && stateVal)) {
      return dom.textContent ?? '';
    }
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
  mergedSlots.value.map((item) => formatSlotValue(item, getSlotValue(item))).join('');

const buildSlotConfigWithValues = (): SlotConfigWithValue[] =>
  mergedSlots.value.map((item) => ({
    ...item,
    value: formatSlotValue(item, getSlotValue(item)),
  }));

const emitChange = (event?: ChangeEvent) => {
  const value = buildMessage();
  props.onChange?.(value, event, buildSlotConfigWithValues(), currentSkill.value);
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

const insertSlots = (
  slots: SlotConfigType[],
  position: InsertPosition = 'end',
  _replaceCharacters?: string,
  preventScroll?: boolean,
) => {
  const keyedSlots = ensureSlotKeys(slots, `ins_${++textKeySeq}`);
  const newValues = buildSlotValues(keyedSlots);
  const newTexts = buildTextContents(keyedSlots);
  keyedSlots.forEach((node) => {
    if (node.key) {
      runtimeKeys.value.add(node.key);
    }
  });

  if (position === 'start') {
    insertedSlots.value = [...keyedSlots, ...insertedSlots.value];
  } else {
    // 'cursor' falls back to end for this MVP (full cursor insert is React-parity gap)
    insertedSlots.value = [...insertedSlots.value, ...keyedSlots];
  }

  slotValues.value = { ...slotValues.value, ...newValues };
  textContents.value = { ...textContents.value, ...newTexts };
  nextTick(() => {
    syncEditableDomFromState();
    emitChange();
    if (!preventScroll) {
      containerRef.value?.scrollIntoView?.({ block: 'nearest' });
    }
  });
};

const insert: SlotTextAreaRef['insert'] = ((
  valueOrSlots: string | SlotConfigType[],
  position?: InsertPosition,
  replaceCharacters?: string,
  preventScroll?: boolean,
) => {
  if (typeof valueOrSlots === 'string') {
    insertSlots([{ type: 'text', value: valueOrSlots }], 'end', undefined, preventScroll);
    return;
  }
  insertSlots(valueOrSlots, position ?? 'end', replaceCharacters, preventScroll);
}) as SlotTextAreaRef['insert'];

const clear = () => {
  insertedSlots.value = [];
  runtimeKeys.value.clear();
  slotValues.value = buildSlotValues(normalizedConfig.value);
  textContents.value = buildTextContents(normalizedConfig.value);
  currentSkill.value = props.skill;
  nextTick(() => {
    syncEditableDomFromState();
    emitChange();
  });
};

const focus = (options?: SlotTextAreaFocusOptions) => {
  const el = containerRef.value;
  if (!el) {
    return;
  }

  const preventScroll = options?.preventScroll ?? false;
  const cursor = options?.cursor ?? 'end';
  el.focus({ preventScroll });

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();

  if (cursor === 'slot') {
    const key = options && 'key' in options ? options.key : undefined;
    const slotEl = key
      ? (el.querySelector(`[data-slot-key="${key}"]`) as HTMLElement | null)
      : null;
    if (slotEl) {
      range.selectNodeContents(slotEl);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
  }

  if (cursor === 'start') {
    range.selectNodeContents(el);
    range.collapse(true);
  } else if (cursor === 'all') {
    range.selectNodeContents(el);
  } else {
    range.selectNodeContents(el);
    range.collapse(false);
  }

  selection.removeAllRanges();
  selection.addRange(range);
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
  syncStateFromEditableDom();
  emitChange();
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

const onInternalInput = () => {
  if (isCompositionRef.value) {
    return;
  }
  syncStateFromEditableDom();
  emitChange();
};

const getCleanedText = (text: string) => text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

const appendPlainTextToActiveEditable = (text: string): boolean => {
  const selection = window.getSelection();
  const root = containerRef.value;
  if (!selection || selection.rangeCount === 0 || !root) {
    return false;
  }
  const anchor = selection.anchorNode;
  if (!anchor || !root.contains(anchor)) {
    return false;
  }
  const editableEl =
    (anchor.nodeType === Node.ELEMENT_NODE
      ? (anchor as HTMLElement)
      : anchor.parentElement)?.closest('[data-slot-type="text"], [data-slot-type="content"]') ||
    null;
  if (!editableEl || !root.contains(editableEl)) {
    return false;
  }
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  syncStateFromEditableDom();
  emitChange();
  return true;
};

const onInternalPaste = (e: ClipboardEvent) => {
  if (!isEditable.value) {
    return;
  }
  e.preventDefault();
  const text = e.clipboardData?.getData('text/plain');
  if (!text) {
    return;
  }
  const cleanedText = getCleanedText(text);
  let success = false;
  if (typeof document.execCommand === 'function') {
    try {
      success = document.execCommand('insertText', false, cleanedText);
    } catch {
      success = false;
    }
  }
  if (success) {
    syncStateFromEditableDom();
    emitChange();
    return;
  }
  if (appendPlainTextToActiveEditable(cleanedText)) {
    return;
  }
  // Last resort: append a text slot so pasted content is reflected in getValue
  insert([{ type: 'text', value: cleanedText }], 'end');
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
            contenteditable="false"
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

const renderSlot = (item: SlotConfigType) => {
  switch (item.type) {
    case 'text': {
      const key = getTextKey(item);
      return (
        <span
          key={key}
          ref={(el: any) => registerEditableDom(`text::${key}`, el)}
          class={slotCls.value}
          data-slot-key={key}
          data-slot-type="text"
        />
      );
    }
    case 'input':
      return (
        <span key={item.key} contenteditable="false" data-slot-key={item.key}>
          <Input
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
        </span>
      );
    case 'content':
      return (
        <span
          key={item.key}
          ref={(el: any) => registerEditableDom(`content::${item.key}`, el)}
          class={classnames(slotContentCls.value, slotCls.value)}
          data-slot-key={item.key}
          data-slot-type="content"
          data-placeholder={item.props?.placeholder}
        />
      );
    case 'select':
      return (
        <span key={item.key} contenteditable="false">
          {renderSelect(item)}
        </span>
      );
    case 'tag':
      return (
        <span
          key={item.key}
          class={classnames(slotTagCls.value, slotCls.value)}
          data-slot-key={item.key}
          contenteditable="false"
        >
          {item.props?.label}
        </span>
      );
    case 'custom':
      return (
        <span
          key={item.key}
          class={slotCls.value}
          data-slot-key={item.key}
          contenteditable="false"
        >
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
      role="textbox"
      class={classnames(inputCls.value, `${inputCls.value}-slot`, props.class)}
      style={props.style}
      tabindex={0}
      data-placeholder={showPlaceholder ? props.placeholder : undefined}
      contenteditable={isEditable.value ? 'true' : 'false'}
      spellcheck={false}
      onKeydown={onInternalKeyDown}
      onKeypress={onInternalKeyPress}
      onCompositionstart={onInternalCompositionStart}
      onCompositionend={onInternalCompositionEnd}
      onInput={onInternalInput}
      onPaste={onInternalPaste}
    >
      {currentSkill.value && (
        <span contenteditable="false">
          <Skill
            {...currentSkill.value}
            prefixCls={props.prefixCls}
            removeSkill={removeSkill}
          />
        </span>
      )}
      {mergedSlots.value.map((item) => renderSlot(item))}
    </div>
  );
});
</script>
