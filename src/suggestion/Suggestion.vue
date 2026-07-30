<script setup lang="tsx" generic="T = any">
import classnames from 'classnames';
import type { RenderChildrenProps, SuggestionItem, SuggestionProps } from './interface';
import { useXProviderContext } from '../x-provider';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useStyle from './style';
import { computed, type VNode, ref, watch } from 'vue';
import useState from '../_util/hooks/use-state';
import { Cascader, Flex, type CascaderProps } from 'ant-design-vue';
import useActive from './useActive';
import { useElementSize } from '@vueuse/core';

defineOptions({ name: 'AXSuggestion' });

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
} = defineProps<SuggestionProps<T>>();

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

const dropdownStyle = computed(() => {
  if (!block) return undefined;
  if (!slotActiveWidth.value) return undefined;
  return { width: `${slotActiveWidth.value}px` };
});

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

defineRender(() => {
  return wrapCSSVar(
    <Cascader
      options={cascaderOptions.value}
      open={mergedOpen.value}
      value={activePath.value}
      placement={isRTL.value ? 'topRight' : 'topLeft'}
      onDropdownVisibleChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      popupClassName={classnames(rootClassName, prefixCls.value, hashId.value, cssVarCls, {
        [`${prefixCls.value}-block`]: block,
      })}
      onChange={onInternalChange as CascaderProps['onChange']}
      dropdownStyle={dropdownStyle.value}
    >
      {{
        default: () => (
          <div
            ref={cascaderSlotRef}
            class={classnames(
              prefixCls.value,
              contextConfig.value.className,
              rootClassName,
              className,
              `${prefixCls.value}-wrapper`,
              hashId.value,
              cssVarCls,
            )}
            style={{
              ...contextConfig.value.style,
              ...style,
            }}
          >
            {childNode.value}
          </div>
        ),
      }}
    </Cascader>,
  );
});
</script>
