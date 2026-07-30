import {
  configProviderKey,
  defaultConfigProvider,
} from 'ant-design-vue/es/config-provider/context.js';
import { mount } from '@vue/test-utils';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, nextTick } from 'vue';
import CodeHighlighter from '../index';

const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

async function flushHighlight() {
  await nextTick();
  // language dynamic import
  await new Promise((resolve) => setTimeout(resolve, 50));
  await nextTick();
}

describe('CodeHighlighter', () => {
  beforeEach(() => {
    consoleWarnSpy.mockClear();
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  it('render normal code', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
      },
    });
    await flushHighlight();
    expect(wrapper.find('pre').exists()).toBe(true);
    expect(wrapper.find('code').exists()).toBe(true);
    expect(wrapper.text()).toContain('console.log("javascript");');
  });

  it('render normal code with header', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
      },
    });
    await flushHighlight();
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(true);
    expect(wrapper.find('.ant-codeHighlighter-header').text()).toContain('javascript');
  });

  it('render normal code with header false', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
        header: () => false,
      },
    });
    await flushHighlight();
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(false);
  });

  it('render normal code with custom header class', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
        classNames: { header: 'customHeader' },
      },
    });
    await flushHighlight();
    expect(wrapper.find('.customHeader').exists()).toBe(true);
  });

  it('render normal code with custom headerTitle class/style', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
        classNames: { headerTitle: 'customHeaderTitle' },
        styles: { headerTitle: { color: 'red' } },
      },
    });
    await flushHighlight();
    const title = wrapper.find('.customHeaderTitle');
    expect(title.exists()).toBe(true);
    expect(title.text()).toContain('javascript');
    expect((title.element as HTMLElement).style.color).toBe('red');
  });

  it('render normal code with custom header/code style', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
        styles: { header: { padding: '10px' }, code: { padding: '20px' } },
      },
    });
    await flushHighlight();
    expect((wrapper.find('.ant-codeHighlighter-header').element as HTMLElement).style.padding).toBe(
      '10px',
    );
    expect((wrapper.find('.ant-codeHighlighter-code').element as HTMLElement).style.padding).toBe(
      '20px',
    );
  });

  it('render normal code with custom code class', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
        classNames: { code: 'customCodeClass' },
      },
    });
    await flushHighlight();
    expect(wrapper.find('.customCodeClass').exists()).toBe(true);
  });

  it('render normal code with custom header', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
      },
      slots: {
        header: () => <div class="myCustomClass">custom header</div>,
      },
    });
    await flushHighlight();
    expect(wrapper.find('.myCustomClass').exists()).toBe(true);
    expect(wrapper.find('.myCustomClass').text()).toContain('custom header');
  });

  it('render normal code with no header', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("javascript");',
        header: null,
      },
    });
    await flushHighlight();
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(false);
  });

  it('render normal code with no children', () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: '',
      },
    });
    expect(wrapper.find('.ant-codeHighlighter').exists()).toBe(false);
    expect(wrapper.text()).toBe('');
  });

  it('should handle undefined lang', () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: '',
        children: 'plain text',
      },
    });
    expect(wrapper.find('code').exists()).toBe(true);
    expect(wrapper.text()).toContain('plain text');
    expect(wrapper.find('.ant-codeHighlighter').exists()).toBe(false);
  });

  it('should apply custom styles and className', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("test");',
        className: 'myCustomClass',
        styles: { root: { backgroundColor: 'red' } },
      },
    });
    await flushHighlight();
    expect(wrapper.find('.myCustomClass').exists()).toBe(true);
    expect((wrapper.element as HTMLElement).style.backgroundColor).toBe('red');
  });

  it('should expose nativeElement', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("test");',
      },
    });
    await flushHighlight();
    expect((wrapper.vm as any).nativeElement).toBe(wrapper.element);
  });

  it('should handle trailing newline', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("test");\n',
      },
    });
    await flushHighlight();
    expect(wrapper.text()).toContain('console.log');
    expect(wrapper.text()).not.toMatch(/\n$/);
  });

  it('should pass highlightProps to pre', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("test");',
        highlightProps: { 'data-testid': 'hl-pre', showLineNumbers: true },
      },
    });
    await flushHighlight();
    expect(wrapper.find('pre[data-testid="hl-pre"]').exists()).toBe(true);
  });

  it('should apply custom prefixCls', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("test");',
        prefixCls: 'custom',
      },
    });
    await flushHighlight();
    expect(wrapper.find('.custom').exists()).toBe(true);
    expect(wrapper.find('.custom-code').exists()).toBe(true);
  });

  it('should spread data attrs to container', async () => {
    const wrapper = mount(CodeHighlighter, {
      props: {
        lang: 'javascript',
        children: 'console.log("test");',
        'data-testid': 'code-highlighter-test',
      } as any,
    });
    await flushHighlight();
    expect(wrapper.find('[data-testid="code-highlighter-test"]').exists()).toBe(true);
  });

  describe('prismLightMode', () => {
    it('should render with prismLightMode enabled/disabled', async () => {
      const light = mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log("test");',
          prismLightMode: true,
        },
      });
      await flushHighlight();
      expect(light.text()).toContain('console.log("test");');

      const full = mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log("full");',
          prismLightMode: false,
        },
      });
      await flushHighlight();
      expect(full.text()).toContain('console.log("full");');
    });
  });

  describe('RTL support', () => {
    it('should apply RTL class when direction is rtl', async () => {
      const wrapper = mount(CodeHighlighter, {
        props: {
          lang: 'javascript',
          children: 'console.log("test");',
        },
        global: {
          provide: {
            [configProviderKey as symbol]: {
              ...defaultConfigProvider,
              direction: computed(() => 'rtl'),
            },
          },
        },
      });
      await flushHighlight();
      expect(wrapper.find('.ant-codeHighlighter-rtl').exists()).toBe(true);
    });
  });

  describe('language loading error handling', () => {
    it('should handle language import failure gracefully', async () => {
      const wrapper = mount(CodeHighlighter, {
        props: {
          lang: 'nonexistent-lang-xyz',
          children: 'const x = 42;',
        },
      });
      await flushHighlight();
      expect(wrapper.text()).toContain('const x = 42;');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[CodeHighlighter] Failed to load language: nonexistent-lang-xyz',
        expect.any(Error),
      );
    });
  });
});
