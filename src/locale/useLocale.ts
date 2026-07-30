import { computed, inject, type ComputedRef } from 'vue';
import type { LocaleContextProps } from './context';
import { LocaleContextKey } from './context';
import defaultLocaleData from './en_US';
import type { Locale, xLocale } from './types';

export type LocaleComponentName = Exclude<keyof xLocale, 'locale'>;

function useLocale<C extends LocaleComponentName = LocaleComponentName>(
  componentName: C,
  defaultLocale?: Locale[C] | (() => Locale[C]),
): [ComputedRef<NonNullable<Locale[C]>>, ComputedRef<string>] {
  const injected = inject<ComputedRef<LocaleContextProps> | undefined>(
    LocaleContextKey,
    undefined,
  );

  const getLocale = computed<NonNullable<Locale[C]>>(() => {
    const fullLocale = injected?.value;
    const locale =
      defaultLocale || defaultLocaleData?.[componentName as LocaleComponentName];
    const localeFromContext = fullLocale?.[componentName] ?? {};
    return {
      ...(typeof locale === 'function' ? locale() : locale),
      ...(localeFromContext || {}),
    } as NonNullable<Locale[C]>;
  });

  const getLocaleCode = computed<string>(() => {
    const fullLocale = injected?.value;
    const localeCode = fullLocale?.locale;
    if (fullLocale?.exist && !localeCode) {
      return defaultLocaleData.locale;
    }
    return localeCode || defaultLocaleData.locale;
  });

  return [getLocale, getLocaleCode];
}

export default useLocale;
