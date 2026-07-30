import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { Creation } from '../../conversations';
import RecordingIcon from '../../sender/components/SpeechButton/RecordingIcon.vue';
import StopLoading from '../../sender/StopLoading.vue';
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
    expect(zhCN.Sender.stopLoading).toBe('停止请求');
    expect(enUS.Sender.speechRecording).toBe('Speech recording');
  });

  it('Sender StopLoading / RecordingIcon use locale titles', () => {
    const enStop = mount(StopLoading, { props: { className: 'stop' } });
    expect(enStop.find('title').text()).toBe(enUS.Sender.stopLoading);

    const zhStop = mount(
      () =>
        h(XProvider, { locale: { ...zhCN } as any }, {
          default: () => h(StopLoading, { className: 'stop' }),
        }),
    );
    expect(zhStop.find('title').text()).toBe(zhCN.Sender.stopLoading);

    const enRec = mount(RecordingIcon, { props: { className: 'rec' } });
    expect(enRec.find('title').text()).toBe(enUS.Sender.speechRecording);

    const zhRec = mount(
      () =>
        h(XProvider, { locale: { ...zhCN } as any }, {
          default: () => h(RecordingIcon, { className: 'rec' }),
        }),
    );
    expect(zhRec.find('title').text()).toBe(zhCN.Sender.speechRecording);
  });
});
