<script setup lang="tsx" generic="T = any">
import classnames from 'classnames';
import type { RenderChildrenProps, SuggestionItem, SuggestionProps } from './interface';
import { useXProviderContext } from '../x-provider';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useStyle from './style';
import { computed, type VNode, ref, useAttrs, watch } from 'vue';
import useState from '../_util/hooks/use-state';
import { Cascader, Flex, type CascaderProps } from 'ant-design-vue';
import useActive from './useActive';
import { useElementSize } from '@vueuse/core';

defineOptions({ name: 'AXSuggestion', inheritAttrs: false });

const {
  prefixCls: customizePrefixCls,
  className,
  rootClassName,
  style,
  children,
  open = false,
  onOpenChange,
  items,
  onSelect,
  block,
  styles = {},
  classNames = {},
  getPopupContainer,
  // Align React `...otherProps`: remaining Cascader-compatible fields.
  ...otherProps
} = defineProps<SuggestionProps<T>>();

const attrs = useAttrs();

const slots = defineSlots<{
  default?(props?: RenderChildrenProps<T>): VNode;
}>();

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('suggestion', customizePrefixCls));
const itemCls = `${prefixCls.value}-item`;

const isRTL = computed(() => direction.value === 'rtl');

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('suggestion');

// ============================ Refs =============================
const cascaderSlotRef = ref<HTMLElement>();

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const { width: slotActiveWidth } = useElementSize(cascaderSlotRef);

const mergedDropdownStyle = computed(() => {
  const popupStyle = {
    ...((contextConfig.value.styles as any)?.popup || {}),
    ...(styles.popup || {}),
  };
  if (block && slotActiveWidth.value) {
    return { ...popupStyle, width: `${slotActiveWidth.value}px` };
  }
  return Object.keys(popupStyle).length ? popupStyle : undefined;
});

const rootCls = computed(() =>
  classnames(
    rootClassName,
    className,
    (contextConfig.value.classNames as any)?.root,
    classNames.root,
    prefixCls.value,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-block`]: block,
    },
  ),
);

const contentCls = computed(() =>
  classnames(
    prefixCls.value,
    rootClassName,
    (contextConfig.value.classNames as any)?.content,
    classNames.content,
    `${prefixCls.value}-content`,
    hashId.value,
    cssVarCls,
  ),
);

const contentStyle = computed(() => ({
  ...((contextConfig.value.styles as any)?.content || {}),
  ...styles.content,
}));

const popupCls = computed(() =>
  classnames(
    rootCls.value,
    (contextConfig.value.classNames as any)?.popup,
    classNames.popup,
  ),
);

const rootStyle = computed(() => ({
  ...contextConfig.value.style,
  ...((contextConfig.value.styles as any)?.root || {}),
  ...styles.root,
  ...style,
}));

// =========================== Trigger ============================
const [mergedOpen, setOpen] = useState(open);

watch(
  () => open,
  (nextOpen) => {
    setOpen(nextOpen);
  },
);

const [info, setInfo] = useState<T | undefined>();

const triggerOpen = (nextOpen: boolean) => {
  setOpen(nextOpen);
  onOpenChange?.(nextOpen);
};

const onTrigger: RenderChildrenProps<T>['onTrigger'] = (nextInfo) => {
  if (nextInfo === false) {
    triggerOpen(false);
  } else {
    setInfo(nextInfo);
    triggerOpen(true);
  }
};

const onClose = () => {
  triggerOpen(false);
};

// ============================ Items =============================
const itemList = computed(() => {
  return typeof items === 'function' ? items(info.value) : items;
});

function resolveSelectedOptions(list: SuggestionItem[], valuePath: string[]): SuggestionItem[] {
  const selected: SuggestionItem[] = [];
  let current = list;
  for (const value of valuePath) {
    const found = current.find((item) => item.value === value);
    if (!found) break;
    selected.push(found);
    current = found.children || [];
  }
  return selected;
}

function mapSuggestionOptions(list: SuggestionItem[]): CascaderProps['options'] {
  return list.map((item) => ({
    value: item.value,
    icon: item.icon,
    extra: item.extra,
    label: (
      <Flex class={itemCls}>
        {item.icon ? <div class={`${itemCls}-icon`}>{item.icon}</div> : null}
        {item.label}
        {item.extra ? <div class={`${itemCls}-extra`}>{item.extra}</div> : null}
      </Flex>
    ),
    children: item.children?.length ? mapSuggestionOptions(item.children) : undefined,
  }));
}

const cascaderOptions = computed(() => mapSuggestionOptions(itemList.value || []));

// =========================== Cascader ===========================
const onInternalChange = (valuePath: string[]) => {
  const path = valuePath || [];
  if (onSelect) {
    onSelect(path[path.length - 1], resolveSelectedOptions(itemList.value || [], path));
  }
  triggerOpen(false);
};

// ============================= a11y =============================
const [activePath, onKeyDown] = useActive(itemList, mergedOpen, isRTL, onInternalChange, onClose);

// =========================== Children ===========================
const childNode = computed(() => {
  const renderProps: RenderChildrenProps<T> = {
    onTrigger,
    onKeyDown,
    open: mergedOpen.value,
  };
  if (slots.default) {
    return slots.default(renderProps);
  }
  return children?.(renderProps);
});

const cascaderPassthrough = computed(() => {
  const fromAttrs = attrs as Record<string, unknown>;
  const {
    class: _class,
    style: _style,
    open: _open,
    options: _options,
    value: _value,
    multiple: _multiple,
    onChange: _onChange,
    onDropdownVisibleChange: _onDropdownVisibleChange,
    onOpenChange: _onOpenChange,
    placement: _placement,
    getPopupContainer: _getPopupContainer,
    ...attrRest
  } = fromAttrs;
  return {
    ...attrRest,
    ...(otherProps as Record<string, unknown>),
  };
});

defineRender(() => {
  return wrapCSSVar(
    <Cascader
      {...cascaderPassthrough.value}
      options={cascaderOptions.value}
      open={mergedOpen.value}
      value={activePath.value}
      placement={isRTL.value ? 'topRight' : 'topLeft'}
      onDropdownVisibleChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      popupClassName={popupCls.value}
      onChange={onInternalChange as CascaderProps['onChange']}
      dropdownStyle={mergedDropdownStyle.value}
      getPopupContainer={getPopupContainer}
      class={rootCls.value}
      style={rootStyle.value}
    >
      {{
        default: () => (
          <div
            ref={cascaderSlotRef}
            class={contentCls.value}
            style={contentStyle.value}
          >
            {childNode.value}
          </div>
        ),
      }}
    </Cascader>,
  );
});
</script>
