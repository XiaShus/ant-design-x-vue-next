<script setup lang="tsx">
import { Flex, Input } from 'ant-design-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import SenderHeaderContextProvider from './context';
import ActionButtonContextProvider from './components/ActionButton/context';
import ClearButton from './components/ClearButton.vue';
import LoadingButton from './components/LoadingButton.vue';
import SendButton from './components/SendButton.vue';
import SlotTextArea from './components/SlotTextArea.vue';
import SpeechButton from './components/SpeechButton/index.vue';
import useStyle from './style';
import useSpeech from './useSpeech';
import type { SenderComponents, SenderProps } from './interface';
import { computed, ref, watch, type VNode } from 'vue';
import getValue from '../_util/getValue';
import type { ChangeEvent, ClipboardEventHandler, MouseEventHandler } from "ant-design-vue/es/_util/EventInterface";;

function getComponent<T>(
  components: SenderComponents | undefined,
  path: string[],
  defaultComponent: typeof Input.TextArea,
): typeof Input.TextArea {
  return getValue(components, path) || defaultComponent;
}

/** Used for actions render needed components */
const sharedRenderComponents = {
  SendButton,
  ClearButton,
  LoadingButton,
  SpeechButton,
};

defineOptions({ name: 'AXSender' });

const props = withDefaults(defineProps<SenderProps>(), {
  submitType: 'enter',
  autoSize: () => ({ maxRows: 8 }),
  styles: () => ({}),
  classNames: () => ({}),
  disabled: undefined,
  sendDisabled: undefined,
  loading: undefined,
  actions: undefined,
  suffix: undefined,
});

const emit = defineEmits<{
  'update:value': [value: string];
}>();

const {
  prefixCls: customizePrefixCls,
  styles,
  classNames,
  className,
  rootClassName,
  style,
  defaultValue,
  value,
  placeholder,
  readOnly,
  submitType,
  onSubmit,
  sendDisabled,
  loading,
  components,
  onCancel,
  onChange,
  actions,
  suffix,
  onKeyPress,
  onKeyDown,
  disabled,
  allowSpeech,
  prefix,
  footer,
  header,
  onPaste,
  onPasteFile,
  autoSize,
  slotConfig,
  skill,
  ...rest
} = props;

const slots = defineSlots<{
  header?(): VNode;
  prefix?(): VNode;
  actions?(props: {
    ori: VNode,
    info: {
      components: {
        SendButton: typeof SendButton;
        ClearButton: typeof ClearButton;
        LoadingButton: typeof LoadingButton;
        SpeechButton: typeof SpeechButton;
      };
    }
  }): VNode;
  suffix?(props: {
    ori: VNode,
    info: {
      components: {
        SendButton: typeof SendButton;
        ClearButton: typeof ClearButton;
        LoadingButton: typeof LoadingButton;
        SpeechButton: typeof SpeechButton;
      };
    }
  }): VNode;
  footer?(props: {
    info: {
      components: {
        SendButton: typeof SendButton;
        ClearButton: typeof ClearButton;
        LoadingButton: typeof LoadingButton;
        SpeechButton: typeof SpeechButton;
      };
    }
  }): VNode;
}>();

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => {
  return getPrefixCls('sender', customizePrefixCls)
});

// ============================= Refs =============================
const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<InstanceType<typeof Input.TextArea> | null>(null);
const slotRef = ref<InstanceType<typeof SlotTextArea> | null>(null);

const isSlotMode = computed(() => !!(props.slotConfig?.length || props.skill));

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('sender');
const inputCls = computed(() => `${prefixCls.value}-input`);

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value);
const mergedCls = computed(() => {
  return classnames(
    prefixCls.value,
    contextConfig.value.className,
    className,
    rootClassName,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-disabled`]: disabled,
    },
  );
})

const actionBtnCls = computed(() => `${prefixCls.value}-actions-btn`);
const actionListCls = computed(() => `${prefixCls.value}-actions-list`);

// ============================ Value =============================
const innerValue = ref(value ?? defaultValue ?? '');
const setInnerValue = (v: string) => {
  innerValue.value = v;
}
watch(() => value, () => {
  setInnerValue(value);
});

const triggerValueChange: SenderProps['onChange'] = (nextValue, event, nextSlotConfig, nextSkill) => {
  setInnerValue(nextValue);

  emit('update:value', nextValue);
  if (onChange) {
    onChange(nextValue, event, nextSlotConfig, nextSkill);
  }
};

const onSlotChange: SenderProps['onChange'] = (nextValue, event, nextSlotConfig, nextSkill) => {
  triggerValueChange(nextValue, event, nextSlotConfig, nextSkill);
};

// ============================ Speech ============================
const { speechPermission, triggerSpeech, recording: speechRecording } = useSpeech((transcript) => {
  triggerValueChange(`${innerValue.value} ${transcript}`);
}, () => allowSpeech);

// ========================== Components ==========================
const InputTextArea = getComponent(components, ['input'], Input.TextArea);

const domProps = computed(() => pickAttrs(rest, {
  attr: true,
  aria: true,
  data: true,
}))

const inputProps = computed(() => {
  return {
    ...domProps.value,
    ref: inputRef,
  };
})

// ============================ Events ============================
const triggerSend = () => {
  if (isSlotMode.value && slotRef.value) {
    const slotValue = slotRef.value.getValue();
    const shouldSend = sendDisabled !== undefined
      ? !sendDisabled
      : !!(slotValue.value || props.slotConfig?.length);
    const isSend = shouldSend && !!onSubmit;
    if (isSend) {
      onSubmit(slotValue.value, slotValue.slotConfig, slotValue.skill);
    }
    return;
  }

  const shouldSend = sendDisabled !== undefined
    ? !sendDisabled
    : !!(innerValue.value && !loading);
  const isSend = shouldSend && !!onSubmit;
  if (isSend) {
    onSubmit(innerValue.value);
  }
};

const triggerClear = () => {
  if (isSlotMode.value && slotRef.value) {
    slotRef.value.clear();
    return;
  }
  triggerValueChange('');
};

const getSlotSendDisabled = () => {
  if (sendDisabled !== undefined) {
    return sendDisabled;
  }
  const slotValue = slotRef.value?.getValue?.();
  return !(slotValue?.value || props.slotConfig?.length);
};

const getSlotClearDisabled = () => {
  const slotValue = slotRef.value?.getValue?.();
  return !slotValue?.value && !props.slotConfig?.length && !props.skill;
};

// ============================ Submit ============================
const isCompositionRef = ref(false);

const onInternalCompositionStart = () => {
  isCompositionRef.value = true;
};

const onInternalCompositionEnd = () => {
  isCompositionRef.value = false;
};

const onInternalKeyPress: SenderProps['onKeyPress'] = (e) => {
  const canSubmit = e.key === 'Enter' && !isCompositionRef.value;

  // Check for `submitType` to submit
  switch (submitType) {
    case 'enter':
      if (canSubmit && !e.shiftKey) {
        e.preventDefault();
        triggerSend();
      }
      break;

    case 'shiftEnter':
      if (canSubmit && e.shiftKey) {
        e.preventDefault();
        triggerSend();
      }
      break;
  }

  if (onKeyPress) {
    onKeyPress(e);
  }
};

// ============================ Paste =============================
const onInternalPaste: ClipboardEventHandler = (e) => {
  // Get files
  const files = e.clipboardData?.files;
  if (files?.length && onPasteFile) {
    onPasteFile(files[0], files);
    e.preventDefault();
  }

  onPaste?.(e);
};

// ============================ Focus =============================
const onContentMouseDown: MouseEventHandler = (e) => {
  if (e.target !== containerRef.value?.querySelector(`.${inputCls.value}`)) {
    e.preventDefault();
  }

  if (isSlotMode.value) {
    slotRef.value?.focus({ cursor: 'end' });
    return;
  }

  // @ts-expect-error
  inputRef.value?.focus();
};

// ============================ Action ============================
const actionNode = computed(() => {
  let _actionNode: VNode | false = (
    <Flex class={`${actionListCls.value}-presets`}>
      {allowSpeech && (
        <SpeechButton
          {...(typeof allowSpeech === 'object' ? 
            { 
              audioIcon: allowSpeech.audioIcon, 
              audioDisabledIcon: allowSpeech.audioDisabledIcon, 
              audioRecordingIcon: allowSpeech.audioRecordingIcon 
            } : {}
          )}
        />
      )}
      {/* Loading or Send */}
      {loading ? <LoadingButton /> : <SendButton />}
    </Flex>
  );

  const info = {
    components: sharedRenderComponents,
  }

  // Custom suffix (React 2.x) takes precedence over legacy actions
  if (slots.suffix) {
    _actionNode = slots.suffix({ ori: _actionNode, info });
  } else if (suffix !== undefined) {
    if (typeof suffix === 'function') {
      _actionNode = suffix(_actionNode, info);
    } else {
      _actionNode = suffix;
    }
  } else if (slots.actions) {
    _actionNode = slots.actions({ ori: _actionNode, info });
  } else if (typeof actions === 'function') {
    _actionNode = actions(_actionNode, info);
  } else if (actions || actions === false) {
    _actionNode = actions;
  }
  return _actionNode;
});

// Custom actions context props
const actionsButtonContextProps = computed(() => ({
  prefixCls: actionBtnCls.value,
  onSend: triggerSend,
  onSendDisabled: isSlotMode.value ? getSlotSendDisabled() : (sendDisabled !== undefined ? sendDisabled : !innerValue.value),
  onClear: triggerClear,
  onClearDisabled: isSlotMode.value ? getSlotClearDisabled() : !innerValue.value,
  onCancel,
  onCancelDisabled: !loading,
  onSpeech: () => triggerSpeech(false),
  onSpeechDisabled: !speechPermission.value,
  speechRecording: speechRecording.value,
  disabled,
}));

// ============================ Footer ============================
const footerNode = computed(() => {
  let _footerNode: VNode = null;

  const info = {
    components: sharedRenderComponents,
  }

  if (slots.footer) {
    _footerNode = slots.footer({ info });
  } else if (typeof footer === 'function') {
    _footerNode = footer({
      components: sharedRenderComponents,
    });
  } else if (footer) {
    _footerNode = footer;
  }
  return _footerNode;
});

const headerComp = computed(() => {
  if (slots.header) {
    return slots.header();
  }
  return typeof header === 'function' ? header() : header;
});

const prefixComp = computed(() => {
  if (slots.prefix) {
    return slots.prefix();
  }
  return typeof prefix === 'function' ? prefix() : prefix;
});

defineRender(() => {
  return wrapCSSVar(
    <div ref={containerRef} class={mergedCls.value} style={{ ...contextConfig.value.style, ...style }}>
      {/* Header */}
      {headerComp.value && (
        <SenderHeaderContextProvider value={{ prefixCls: prefixCls.value }}>{headerComp.value}</SenderHeaderContextProvider>
      )}
      <ActionButtonContextProvider value={actionsButtonContextProps.value}>

        <div class={`${prefixCls.value}-content`} onMousedown={onContentMouseDown}>
          {/* Prefix */}
          {prefixComp.value && (
            <div
              class={classnames(
                `${prefixCls.value}-prefix`,
                contextConfig.value.classNames.prefix,
                classNames.prefix,
              )}
              style={{ ...contextConfig.value.styles.prefix, ...styles.prefix }}
            >
              {prefixComp.value}
            </div>
          )}

          {/* Input */}
          {isSlotMode.value ? (
            <SlotTextArea
              ref={slotRef}
              prefixCls={prefixCls.value}
              slotConfig={props.slotConfig}
              skill={props.skill}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder as string}
              submitType={submitType}
              style={{ ...contextConfig.value.styles.input, ...styles.input }}
              class={classnames(contextConfig.value.classNames.input, classNames.input)}
              onChange={onSlotChange}
              onKeyPress={onInternalKeyPress}
              onKeyDown={onKeyDown}
            />
          ) : (
            <InputTextArea
              {...inputProps.value}
              disabled={disabled}
              style={{ ...contextConfig.value.styles.input, ...styles.input }}
              class={classnames(inputCls.value, contextConfig.value.classNames.input, classNames.input)}
              autoSize={autoSize}
              value={innerValue.value}
              onChange={(event: Event) => {
                triggerValueChange(
                  (event.target as HTMLTextAreaElement).value,
                  event as ChangeEvent,
                );
                triggerSpeech(true);
              }}
              onPressEnter={onInternalKeyPress}
              onCompositionstart={onInternalCompositionStart}
              onCompositionend={onInternalCompositionEnd}
              onKeydown={onKeyDown}
              placeholder={placeholder}
              // @ts-expect-error
              onPaste={onInternalPaste}
              bordered={false}
              readOnly={readOnly}
            />
          )}

          {/* Action List (semantic: suffix; BC: actions) */}
          {actionNode.value && (<div
            class={classnames(
              actionListCls.value,
              contextConfig.value.classNames.suffix,
              contextConfig.value.classNames.actions,
              classNames.suffix,
              classNames.actions,
            )}
            style={{
              ...contextConfig.value.styles.actions,
              ...contextConfig.value.styles.suffix,
              ...styles.actions,
              ...styles.suffix,
            }}
          >
            {actionNode.value}
          </div>)}
        </div>
        {footerNode.value && (
          <div
            class={classnames(
              `${prefixCls.value}-footer`,
              contextConfig.value.classNames.footer,
              classNames.footer,
            )}
            style={{
              ...contextConfig.value.styles.footer,
              ...styles.footer,
            }}
          >
            {footerNode.value}
          </div>
        )}
      </ActionButtonContextProvider>
    </div>,
  );
});

defineExpose({
  nativeElement: containerRef,
  focus: (opt?: any) => {
    if (isSlotMode.value) {
      slotRef.value?.focus(opt);
      return;
    }
    // @ts-expect-error
    inputRef.value?.focus(opt);
  },
  blur: () => {
    if (isSlotMode.value) {
      slotRef.value?.blur();
      return;
    }
    // @ts-expect-error
    inputRef.value?.blur();
  },
  insert: (...args: Parameters<NonNullable<InstanceType<typeof SlotTextArea>['insert']>>) =>
    slotRef.value?.insert(...args),
  clear: () => {
    if (isSlotMode.value) {
      slotRef.value?.clear();
      return;
    }
    triggerClear();
  },
  getValue: () => slotRef.value?.getValue(),
});
</script>
