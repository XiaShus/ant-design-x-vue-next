import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import XMarkdown from '../index';
import { parseMarkdown } from '../parser';

describe('XMarkdown', () => {
  it('parses headings to html', () => {
    expect(parseMarkdown('# Hello\n\nThis is **bold**.')).toContain('<h1>Hello</h1>');
  });

  it('renders markdown content', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '# Hello\n\nThis is **bold**.',
      },
    });
    await nextTick();
    expect(wrapper.find('.x-markdown').exists()).toBe(true);
    expect(wrapper.text()).toContain('Hello');
    expect(wrapper.text()).toContain('bold');
    expect(wrapper.html().toLowerCase()).toContain('<h1');
    expect(wrapper.html().toLowerCase()).toContain('<strong');
  });

  it('returns null for empty content', () => {
    const wrapper = mount(XMarkdown, {
      props: { content: '' },
    });
    expect(wrapper.find('.x-markdown').exists()).toBe(false);
  });

  it('opens links in new tab when enabled', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '[Ant Design](https://ant.design)',
        openLinksInNewTab: true,
      },
    });
    await nextTick();
    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toContain('noopener');
  });

  it('shows streaming tail when hasNextChunk', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Streaming...',
        streaming: { hasNextChunk: true, tail: true },
      },
    });
    await nextTick();
    expect(wrapper.find('.xmd-tail').exists()).toBe(true);
    expect(wrapper.find('.xmd-tail').text()).toContain('|');
  });

  it('supports children prop and className', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        children: 'Hello **world**',
        className: 'custom-md',
      },
    });
    await nextTick();
    expect(wrapper.find('.custom-md').exists()).toBe(true);
    expect(wrapper.text()).toContain('world');
  });

  it('renders fenced code via CodeHighlighter', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '```js\nconsole.log(1)\n```',
      },
    });
    await nextTick();
    await new Promise((r) => setTimeout(r, 80));
    expect(wrapper.text()).toContain('console.log');
  });

  it('shows DebugPanel when debug is enabled', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '# Debug',
        debug: true,
      },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.querySelector('.x-markdown-debug-panel')).toBeTruthy();
    expect(document.querySelector('.x-markdown-debug-label')?.textContent).toContain('FPS');
    wrapper.unmount();
  });
});
