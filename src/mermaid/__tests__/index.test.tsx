import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Mermaid from '../index';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    parse: vi.fn().mockResolvedValue(true),
    render: vi.fn().mockResolvedValue({
      svg: '<svg><rect width="100" height="100" /></svg>',
    }),
  },
}));

vi.mock('../../code-highlighter', () => ({
  CodeHighlighter: {
    name: 'AXCodeHighlighter',
    props: ['lang', 'header', 'children', 'styles', 'highlightProps'],
    setup(props: any, { slots }: any) {
      return () => (
        <div data-testid="syntax-highlighter">
          {props.children || slots.default?.()}
        </div>
      );
    },
  },
}));

import mermaid from 'mermaid';

const mermaidContent = 'graph TD; A-->B;';

async function flush() {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 120));
  await nextTick();
}

describe('Mermaid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (mermaid.parse as any).mockResolvedValue(true);
    (mermaid.render as any).mockResolvedValue({
      svg: '<svg><rect width="100" height="100" /></svg>',
    });
  });

  it('should render correctly with valid mermaid code', async () => {
    const wrapper = mount(Mermaid, {
      props: { children: mermaidContent },
    });
    await flush();
    expect(mermaid.render).toHaveBeenCalled();
    expect(wrapper.find('.ant-mermaid').exists()).toBe(true);
  });

  it('should handle invalid mermaid syntax', async () => {
    (mermaid.parse as any).mockResolvedValue(false);
    const wrapper = mount(Mermaid, {
      props: { children: 'invalid syntax' },
    });
    await flush();
    expect(wrapper.find('.ant-mermaid').exists()).toBe(true);
  });

  it('should not render when children is empty', () => {
    const wrapper = mount(Mermaid, {
      props: { children: '' },
    });
    expect(wrapper.find('.ant-mermaid').exists()).toBe(false);
    expect(wrapper.text()).toBe('');
  });

  it('should switch between image and code view', async () => {
    const onRenderTypeChange = vi.fn();
    const wrapper = mount(Mermaid, {
      props: {
        children: mermaidContent,
        onRenderTypeChange,
      },
    });
    await flush();

    const segmented = wrapper.findComponent({ name: 'ASegmented' });
    if (segmented.exists()) {
      segmented.vm.$emit('change', 'code');
    } else {
      const codeOption = wrapper
        .findAll('.ant-segmented-item')
        .find((n) => n.text().includes('代码'));
      expect(codeOption).toBeTruthy();
      await codeOption!.trigger('click');
    }
    await flush();

    expect(wrapper.find('.ant-mermaid-code').exists()).toBe(true);
    expect(wrapper.text()).toContain(mermaidContent);
    expect(onRenderTypeChange).toHaveBeenCalledWith('code');
  });

  it('should hide header when header is null', async () => {
    const wrapper = mount(Mermaid, {
      props: {
        children: mermaidContent,
        header: null,
      },
    });
    await flush();
    expect(wrapper.find('.ant-mermaid-header').exists()).toBe(false);
  });

  it('should render custom header', async () => {
    const wrapper = mount(Mermaid, {
      props: {
        children: mermaidContent,
      },
      slots: {
        header: () => <div class="custom-header">Custom</div>,
      },
    });
    await flush();
    expect(wrapper.find('.custom-header').exists()).toBe(true);
    expect(wrapper.find('.custom-header').text()).toContain('Custom');
  });

  it('should apply custom classNames and styles', async () => {
    const wrapper = mount(Mermaid, {
      props: {
        children: mermaidContent,
        className: 'my-mermaid',
        classNames: { header: 'custom-header-cls', graph: 'custom-graph' },
        styles: { root: { backgroundColor: 'red' }, graph: { height: '200px' } },
      },
    });
    await flush();
    expect(wrapper.find('.my-mermaid').exists()).toBe(true);
    expect(wrapper.find('.custom-header-cls').exists()).toBe(true);
    expect(wrapper.find('.custom-graph').exists()).toBe(true);
    expect((wrapper.element as HTMLElement).style.backgroundColor).toBe('red');
  });

  it('should initialize mermaid with config', async () => {
    mount(Mermaid, {
      props: {
        children: mermaidContent,
        config: { theme: 'dark' },
      },
    });
    await flush();
    expect(mermaid.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
        startOnLoad: false,
        securityLevel: 'strict',
      }),
    );
  });

  it('should expose nativeElement', async () => {
    const wrapper = mount(Mermaid, {
      props: { children: mermaidContent },
    });
    await flush();
    expect((wrapper.vm as any).nativeElement).toBe(wrapper.element);
  });

  it('should respect actions enableZoom=false', async () => {
    const wrapper = mount(Mermaid, {
      props: {
        children: mermaidContent,
        actions: { enableZoom: false, enableDownload: true },
      },
    });
    await flush();
    expect(wrapper.text()).not.toContain('放大');
    expect(wrapper.find('.ant-actions').exists()).toBe(true);
  });
});
