import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import XMarkdown from '../index';
import { StreamCacheTokenType } from '../interface';
import { getInitialCache, processStreamingText } from '../streamCache';
import { useStreaming } from '../composables/useStreaming';

describe('streamCache / processStreamingText', () => {
  it('holds incomplete link until closed', () => {
    const cache = getInitialCache();
    expect(processStreamingText(cache, 'See [Ant')).toBe('See ');
    expect(cache.token).toBe(StreamCacheTokenType.Link);
    expect(cache.pending).toBe('[Ant');

    const closed = processStreamingText(cache, 'See [Ant Design](https://ant.design)');
    expect(closed).toContain('[Ant Design](https://ant.design)');
    expect(cache.token).toBe(StreamCacheTokenType.Text);
  });

  it('holds incomplete emphasis', () => {
    const cache = getInitialCache();
    expect(processStreamingText(cache, 'Hello **wor')).toBe('Hello ');
    expect(cache.token).toBe(StreamCacheTokenType.Emphasis);

    expect(processStreamingText(cache, 'Hello **world**')).toContain('**world**');
  });

  it('commits fenced code immediately (no hold)', () => {
    const cache = getInitialCache();
    const out = processStreamingText(cache, '```js\nconsole.log(1)\n');
    expect(out).toContain('```js');
    expect(out).toContain('console.log(1)');
  });

  it('resets cache when input is not a continuation', () => {
    const cache = getInitialCache();
    processStreamingText(cache, 'Hello **');
    const out = processStreamingText(cache, 'Brand new');
    expect(out).toBe('Brand new');
  });

  it('emits incomplete placeholder when component is registered', () => {
    const cache = getInitialCache();
    const out = processStreamingText(cache, 'Go [here', {
      componentNames: ['incomplete-link'],
    });
    expect(out).toContain('<incomplete-link data-raw=');
    expect(out).toContain(encodeURIComponent('[here'));
  });
});

describe('useStreaming composable', () => {
  it('buffers while hasNextChunk and flushes when done', async () => {
    const Host = defineComponent({
      setup() {
        const content = ref('Hello [lin');
        const hasNext = ref(true);
        const output = useStreaming(content, () => ({
          streaming: { hasNextChunk: hasNext.value },
        }));
        return () =>
          h('div', [
            h('span', { class: 'out' }, output.value),
            h('button', {
              class: 'append',
              onClick: () => {
                content.value = 'Hello [link](https://a.com)';
              },
            }),
            h('button', {
              class: 'finish',
              onClick: () => {
                hasNext.value = false;
              },
            }),
          ]);
      },
    });

    const wrapper = mount(Host);
    await nextTick();
    // incomplete link held in cache → only committed prefix "Hello "
    expect(wrapper.find('.out').element.textContent).toBe('Hello ');
    expect(wrapper.find('.out').element.textContent).not.toContain('[');

    await wrapper.find('.append').trigger('click');
    await nextTick();
    expect(wrapper.find('.out').element.textContent).toContain('[link](https://a.com)');

    await wrapper.find('.finish').trigger('click');
    await nextTick();
    expect(wrapper.find('.out').element.textContent).toContain('[link](https://a.com)');
  });
});

describe('XMarkdown streaming integration', () => {
  it('does not render broken incomplete link markdown while streaming', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'See [Ant',
        streaming: { hasNextChunk: true, tail: true },
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('See');
    expect(wrapper.text()).not.toContain('[Ant');
    expect(wrapper.find('.xmd-tail').exists()).toBe(true);
  });

  it('renders full link after stream finishes', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'See [Ant Design](https://ant.design)',
        streaming: { hasNextChunk: true },
      },
    });
    await nextTick();
    expect(wrapper.find('a').exists()).toBe(true);

    await wrapper.setProps({
      streaming: { hasNextChunk: false },
    });
    await nextTick();
    expect(wrapper.find('a').attributes('href')).toBe('https://ant.design');
  });
});
