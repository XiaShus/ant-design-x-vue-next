import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import ThoughtChain from '../index';

describe('ThoughtChain.Item', () => {
  it('exposes ThoughtChain.Item compound', () => {
    expect(ThoughtChain.Item).toBeTruthy();
  });

  it('renders with minimal props', () => {
    const wrapper = mount(ThoughtChain.Item);
    expect(wrapper.classes().some((c) => c.includes('thought-chain-item'))).toBe(true);
  });

  it('renders title and description', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: {
        title: 'Test Title',
        description: 'Test Description',
      },
    });
    expect(wrapper.text()).toContain('Test Title');
    expect(wrapper.text()).toContain('Test Description');
    expect(wrapper.find('.ant-thought-chain-item-title-with-description').exists()).toBe(true);
  });

  it('renders icon when provided', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: {
        title: 'Test',
        icon: h('span', { 'data-testid': 'custom-icon' }, '🔍'),
      },
    });
    expect(wrapper.find('[data-testid="custom-icon"]').exists()).toBe(true);
  });

  it('does not render status icon without icon or status', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Test' },
    });
    expect(wrapper.find('.ant-thought-chain-status').exists()).toBe(false);
  });

  it.each(['loading', 'success', 'error', 'abort'] as const)(
    'renders %s status',
    (status) => {
      const wrapper = mount(ThoughtChain.Item, {
        props: { title: 'Test', status },
      });
      expect(wrapper.find(`.ant-thought-chain-status-${status}`).exists()).toBe(true);
    },
  );

  it('applies error class for error status', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Error', status: 'error' },
    });
    expect(wrapper.classes().some((c) => c.includes('item-error'))).toBe(true);
  });

  it.each(['solid', 'outlined', 'text'] as const)('applies %s variant', (variant) => {
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Test', variant },
    });
    expect(wrapper.classes().some((c) => c.includes(`item-${variant}`))).toBe(true);
  });

  it('defaults to solid variant', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Test' },
    });
    expect(wrapper.classes().some((c) => c.includes('item-solid'))).toBe(true);
  });

  it('applies blink class when blink is true', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Blink', blink: true },
    });
    expect(wrapper.find('.ant-thought-chain-motion-blink').exists()).toBe(true);
  });

  it('applies semantic classNames', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: {
        title: 'Test',
        description: 'Desc',
        status: 'success',
        classNames: {
          root: 'custom-root',
          icon: 'custom-icon',
          title: 'custom-title',
          description: 'custom-description',
        },
      },
    });
    expect(wrapper.find('.custom-root').exists()).toBe(true);
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
    expect(wrapper.find('.custom-title').exists()).toBe(true);
    expect(wrapper.find('.custom-description').exists()).toBe(true);
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Clickable', onClick: handleClick },
    });
    expect(wrapper.classes().some((c) => c.includes('item-click'))).toBe(true);
    await wrapper.trigger('click');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click when disabled', async () => {
    const handleClick = vi.fn();
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Disabled', disabled: true, onClick: handleClick },
    });
    expect(wrapper.classes().some((c) => c.includes('item-disabled'))).toBe(true);
    await wrapper.trigger('click');
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('uses custom prefixCls', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: { prefixCls: 'custom-prefix', title: 'Test' },
    });
    expect(wrapper.classes().some((c) => c.includes('custom-prefix-item'))).toBe(true);
  });

  it('passes through data / aria attributes', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: {
        title: 'Test',
        'data-testid': 'custom-testid',
        'aria-label': 'test-label',
      } as any,
      attrs: {
        'data-testid': 'custom-testid',
        'aria-label': 'test-label',
      },
    });
    expect(wrapper.attributes('data-testid')).toBe('custom-testid');
    expect(wrapper.attributes('aria-label')).toBe('test-label');
  });

  it('exposes nativeElement root', () => {
    const wrapper = mount(ThoughtChain.Item, {
      props: { title: 'Test' },
    });
    const api = wrapper.vm as unknown as { nativeElement: HTMLElement };
    expect(api.nativeElement).toBeInstanceOf(HTMLDivElement);
    expect(api.nativeElement.className).toContain('ant-thought-chain-item');
  });
});
