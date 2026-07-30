import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { Creation } from '../../conversations';
import { XProvider } from '../../x-provider';
import enUS from '../en_US';
import useLocale from '../useLocale';
import zhCN from '../zh_CN';

describe('X locale pack', () => {
  it('useLocale falls back to en_US without provider', () => {
    let captured = '';
    const Probe = defineComponent({
      setup() {
        const [locale] = useLocale('Conversations');
        captured = locale.value.create;
        return () => null;
      },
    });
    mount(Probe);
    expect(captured).toBe('New chat');
  });

  it('XProvider.locale overrides component strings', () => {
    const wrapper = mount(
      () =>
        h(
          XProvider,
          { locale: { ...zhCN } as any },
          {
            default: () => h(Creation),
          },
        ),
    );
    expect(wrapper.text()).toContain(zhCN.Conversations.create);
    expect(wrapper.text()).not.toContain(enUS.Conversations.create);
  });

  it('exports zh_CN / en_US packs', () => {
    expect(zhCN.locale).toBe('zh-cn');
    expect(enUS.locale).toBe('en');
    expect(zhCN.Actions.feedbackLike).toBe('喜欢');
    expect(enUS.Actions.feedbackLike).toBe('Like');
  });
});
