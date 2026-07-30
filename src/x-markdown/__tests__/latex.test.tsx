import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import XMarkdown from '../index';
import { Latex } from '../plugins';
import { parseMarkdown } from '../parser';

describe('XMarkdown Latex plugin', () => {
  it('renders inline math via $...$', () => {
    const html = parseMarkdown('Einstein: $E=mc^2$', {
      markedConfig: { extensions: Latex() },
    });
    expect(html).toContain('katex');
    expect(html).toContain('inline-katex');
    expect(html).not.toContain('$E=mc^2$');
  });

  it('renders block math via $$...$$', () => {
    const html = parseMarkdown('$$\na^2 + b^2 = c^2\n$$', {
      markedConfig: { extensions: Latex() },
    });
    expect(html).toContain('katex');
    expect(html).toContain('block-katex');
  });

  it('renders through XMarkdown component', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Formula $E=mc^2$ inline.',
        config: { extensions: Latex() },
      },
    });
    await nextTick();
    expect(wrapper.find('.katex').exists()).toBe(true);
    expect(wrapper.text()).toContain('Formula');
    expect(wrapper.text()).toContain('inline');
  });

  it('does not throw on invalid latex when throwOnError is false', () => {
    expect(() =>
      parseMarkdown('$\\unknowncommand{x}$', {
        markedConfig: { extensions: Latex() },
      }),
    ).not.toThrow();
  });
});
