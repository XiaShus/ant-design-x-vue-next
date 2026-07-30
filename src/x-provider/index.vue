<script setup lang="tsx">
import { computed } from 'vue';
import XProviderContextProvider from './context';
import type { XProviderProps } from './context';
import useXProviderContext from './hooks/use-x-provider-context';
import { ConfigProvider as AntdConfigProvider } from 'ant-design-vue';
import LocaleProvider from '../locale/LocaleProvider.vue';
import type { Locale as XLocale } from '../locale/types';

defineOptions({ name: 'AXProvider', inheritAttrs: false });

const {
  actions,
  attachments,
  bubble,
  conversations,
  prompts,
  sender,
  suggestion,
  thoughtChain,
  think,
  sources,
  fileCard,
  folder,
  codeHighlighter,
  mermaid,
  welcome,
  locale,
  ...antdConfProps
} = defineProps<XProviderProps>();

const slots = defineSlots<{
  default(props?: any): any
}>();

const xProviderProps = computed(() => ({
  actions,
  attachments,
  bubble,
  conversations,
  prompts,
  sender,
  suggestion,
  thoughtChain,
  think,
  sources,
  fileCard,
  folder,
  codeHighlighter,
  mermaid,
  welcome,
}));

const { theme: parentTheme } = useXProviderContext();

const mergedTheme = computed(() => ({
  ...(parentTheme?.value || {}),
  ...antdConfProps.theme,
}));

defineRender(() => {
  const children = slots.default?.();
  const content = locale ? (
    <LocaleProvider locale={locale as XLocale}>{children}</LocaleProvider>
  ) : (
    children
  );

  return (
    <XProviderContextProvider value={xProviderProps.value}>
      <AntdConfigProvider
        {...antdConfProps}
        locale={locale as any}
        theme={mergedTheme.value}
      >
        {content}
      </AntdConfigProvider>
    </XProviderContextProvider>
  )
});
</script>
