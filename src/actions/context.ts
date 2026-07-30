import { computed, defineComponent, inject, provide, type ComputedRef, type InjectionKey, type PropType } from 'vue';
import type { ActionsProps } from './interface';

export type ActionsContextValue = {
  prefixCls?: string;
  classNames?: ActionsProps['classNames'];
  styles?: ActionsProps['styles'];
};

const ActionsContextKey: InjectionKey<ComputedRef<ActionsContextValue>> = Symbol('ActionsContext');

export const useActionsContextInject = () =>
  inject(
    ActionsContextKey,
    computed(() => ({}) as ActionsContextValue),
  );

export const ActionsContextProvider = defineComponent({
  name: 'AXActionsContextProvider',
  props: {
    value: {
      type: Object as PropType<ActionsContextValue>,
      required: true,
    },
  },
  setup(props, { slots }) {
    provide(
      ActionsContextKey,
      computed(() => props.value),
    );
    return () => slots.default?.();
  },
});
