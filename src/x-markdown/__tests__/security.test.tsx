import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import XMarkdown from '../index';
import { parseMarkdown } from '../parser';
import { sanitizeMarkdownHtml } from '../sanitize';

describe('XMarkdown security', () => {
  it('sanitizes script tags from raw html in markdown by default via DOMPurify', async () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Hello <script>alert(1)</script><img src=x onerror=alert(1) />',
      },
    });
    await nextTick();
    const html = wrapper.html().toLowerCase();
    expect(wrapper.text()).toContain('Hello');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
  });

  it('escapeRawHtml escapes raw html tokens so they render as text', async () => {
    const html = parseMarkdown('<b>raw</b> and **md**', { escapeRawHtml: true });
    expect(html).toMatch(/&lt;b&gt;raw&lt;(?:&#x2F;|\/)b&gt;/);
    expect(html).toContain('<strong>md</strong>');

    const wrapper = mount(XMarkdown, {
      props: {
        content: '<img src=x onerror=alert(1)> safe **text**',
        escapeRawHtml: true,
      },
    });
    await nextTick();
    expect(wrapper.html().toLowerCase()).not.toContain('<img');
    expect(wrapper.text()).toContain('safe');
    expect(wrapper.text()).toContain('text');
  });

  it('never returns unsanitized html from sanitizeMarkdownHtml', () => {
    const dirty = '<p>ok</p><script>alert(1)</script>';
    const clean = sanitizeMarkdownHtml(dirty);
    expect(clean.toLowerCase()).not.toContain('<script');
    expect(clean.toLowerCase()).toContain('<p>');
  });

  it('preserves custom component tags via ADD_TAGS merge', () => {
    const dirty = '<my-card>hello</my-card><script>x</script>';
    const clean = sanitizeMarkdownHtml(dirty, { componentTags: ['my-card'] });
    expect(clean.toLowerCase()).toContain('my-card');
    expect(clean.toLowerCase()).not.toContain('<script');
  });

  it('keeps headings after sanitize (happy-dom patched path)', async () => {
    const wrapper = mount(XMarkdown, {
      props: { content: '# Title\n\nparagraph' },
    });
    await nextTick();
    expect(wrapper.html().toLowerCase()).toContain('<h1');
    expect(wrapper.text()).toContain('Title');
  });
});
