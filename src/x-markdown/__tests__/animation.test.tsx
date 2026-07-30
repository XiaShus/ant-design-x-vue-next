import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import AnimationText from '../AnimationText.vue';
import XMarkdown from '../index';

describe('AnimationText', () => {
  it('splits incremental chunks with fade class', async () => {
    const wrapper = mount(AnimationText, {
      props: { text: 'Hello' },
    });
    await nextTick();
    expect(wrapper.findAll('.x-markdown-animation-text')).toHaveLength(1);
    expect(wrapper.text()).toBe('Hello');

    await wrapper.setProps({ text: 'Hello world' });
    await nextTick();
    const spans = wrapper.findAll('.x-markdown-animation-text');
    expect(spans.length).toBe(2);
    expect(spans[1].element.textContent).toBe(' world');
    expect(spans[1].attributes('style') || spans[1].element.getAttribute('style')).toContain(
      'x-markdown-fade-in',
    );
  });

  it('resets chunks when text is not a continuation', async () => {
    const wrapper = mount(AnimationText, {
      props: { text: 'Hello' },
    });
    await wrapper.setProps({ text: 'Other' });
    await nextTick();
    expect(wrapper.findAll('.x-markdown-animation-text')).toHaveLength(1);
    expect(wrapper.text()).toBe('Other');
  });
});

describe('XMarkdown enableAnimation', () => {
  it('uses AnimationText for paragraph text when enabled', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Hello animation',
        streaming: { enableAnimation: true },
      },
    });
    await nextTick();
    expect(wrapper.find('.x-markdown-animation-text').exists()).toBe(true);
    expect(wrapper.text()).toContain('Hello animation');
  });
});
