import type { ComputedRef, InjectionKey } from 'vue';
import type { Locale } from './types';

export type LocaleContextProps = Locale & { exist?: boolean };

export const LocaleContextKey: InjectionKey<ComputedRef<LocaleContextProps>> =
  Symbol('AXLocaleContext');
