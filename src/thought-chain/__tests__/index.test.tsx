import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import ThoughtChain from '../index';
import type { ThoughtChainItem } from '../interface';

const baseItems = (overrides: Partial<ThoughtChainItem> = {}): ThoughtChainItem[] => [
  {
    key: 'test1',
    title: 'Item 1',
    content: 'content test1',
    ...overrides,
  },
  {
    key: 'test2',
    title: 'Item 2',
    content: 'content test2',
    collapsible: true,
  },
];

describe('ThoughtChain Component', () => {
  it('renders items', () => {
    const wrapper = mount(ThoughtChain, {
      props: { items: baseItems() },
    });
    expect(wrapper.find('.ant-thought-chain').exists()).toBe(true);
    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('content test1');
  });

  it('applies line modifier classes', () => {
    const dashed = mount(ThoughtChain, {
      props: { items: baseItems(), line: 'dashed' },
    });
    expect(dashed.find('.ant-thought-chain-line-dashed').exists()).toBe(true);

    const dotted = mount(ThoughtChain, {
      props: { items: baseItems(), line: 'dotted' },
    });
    expect(dotted.find('.ant-thought-chain-line-dotted').exists()).toBe(true);

    const none = mount(ThoughtChain, {
      props: { items: baseItems(), line: false },
    });
    expect(none.find('.ant-thought-chain-line-false').exists()).toBe(true);

    const solid = mount(ThoughtChain, {
      props: { items: baseItems(), line: true },
    });
    expect(solid.find('.ant-thought-chain-line-false').exists()).toBe(false);
    expect(solid.find('.ant-thought-chain-line-dashed').exists()).toBe(false);
  });

  it('supports top-level expandedKeys / onExpand', async () => {
    const onExpand = vi.fn();
    const expandedKeys = ref<string[]>([]);
    const wrapper = mount(ThoughtChain, {
      props: {
        items: baseItems({ collapsible: true }),
        expandedKeys: expandedKeys.value,
        onExpand: (keys: string[]) => {
          expandedKeys.value = keys;
          onExpand(keys);
        },
      },
    });

    expect(wrapper.findAll('.ant-thought-chain-item-content')).toHaveLength(0);

    await wrapper.findAll('.ant-thought-chain-item-header')[0].trigger('click');
    expect(onExpand).toHaveBeenCalledWith(['test1']);

    await wrapper.setProps({ expandedKeys: expandedKeys.value });
    await nextTick();
    expect(wrapper.findAll('.ant-thought-chain-item-content')).toHaveLength(1);
  });

  it('supports defaultExpandedKeys uncontrolled expand', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: baseItems({ collapsible: true }),
        defaultExpandedKeys: ['test1'],
      },
    });

    expect(wrapper.findAll('.ant-thought-chain-item-content')).toHaveLength(1);
    expect(wrapper.text()).toContain('content test1');

    await wrapper.findAll('.ant-thought-chain-item-header')[0].trigger('click');
    await nextTick();
    expect(wrapper.findAll('.ant-thought-chain-item-content')).toHaveLength(0);
  });

  it('keeps collapsible object as compat shim', async () => {
    const onExpand = vi.fn();
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          { key: 'a', title: 'A', content: 'body a' },
          { key: 'b', title: 'B', content: 'body b' },
        ],
        collapsible: {
          expandedKeys: ['a'],
          onExpand,
        },
      },
    });

    expect(wrapper.findAll('.ant-thought-chain-item-content')).toHaveLength(1);
    expect(wrapper.text()).toContain('body a');

    await wrapper.findAll('.ant-thought-chain-item-header')[0].trigger('click');
    expect(onExpand).toHaveBeenCalledWith([]);
  });

  it('merges top-level expand props over collapsible object', async () => {
    const nestedOnExpand = vi.fn();
    const topOnExpand = vi.fn();
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [{ key: 'a', title: 'A', content: 'body', collapsible: true }],
        collapsible: {
          expandedKeys: [],
          onExpand: nestedOnExpand,
        },
        expandedKeys: ['a'],
        onExpand: topOnExpand,
      },
    });

    expect(wrapper.text()).toContain('body');
    await wrapper.find('.ant-thought-chain-item-header').trigger('click');
    expect(topOnExpand).toHaveBeenCalledWith([]);
    expect(nestedOnExpand).not.toHaveBeenCalled();
  });

  it('applies blink class on chain item title', () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [{ key: 'b', title: 'Blink', blink: true, content: 'x', collapsible: true }],
        defaultExpandedKeys: ['b'],
      },
    });
    expect(wrapper.find('.ant-thought-chain-motion-blink').exists()).toBe(true);
  });

  it('respects per-item collapsible without chain collapsible', async () => {
    const onExpand = vi.fn();
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          { key: 'c1', title: 'Collapsible', content: 'hidden', collapsible: true },
          { key: 'c2', title: 'Always', content: 'visible' },
        ],
        onExpand,
      },
    });

    // Non-collapsible content always mounted; collapsible starts collapsed (destroyed)
    expect(wrapper.text()).toContain('visible');
    expect(wrapper.text()).not.toContain('hidden');

    await wrapper.findAll('.ant-thought-chain-item-header')[0].trigger('click');
    expect(onExpand).toHaveBeenCalledWith(['c1']);
    await nextTick();
    expect(wrapper.text()).toContain('hidden');
  });

  it('removes content from DOM when destroyOnHidden is true and collapsed', () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          {
            key: 'destroy-test',
            title: 'Collapsible',
            content: 'Destroyable content',
            collapsible: true,
            destroyOnHidden: true,
          },
        ],
        expandedKeys: [],
      },
    });

    expect(wrapper.find('.ant-thought-chain-item-content').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Destroyable content');
  });

  it('keeps content in DOM when destroyOnHidden is false and collapsed', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          {
            key: 'keep-test',
            title: 'Collapsible',
            content: 'Kept content',
            collapsible: true,
            destroyOnHidden: false,
          },
        ],
        expandedKeys: ['keep-test'],
      },
    });

    expect(wrapper.find('.ant-thought-chain-item-content').exists()).toBe(true);

    await wrapper.setProps({ expandedKeys: [] });
    await nextTick();

    expect(wrapper.find('.ant-thought-chain-item-content').exists()).toBe(true);
  });

  it('chain collapsible=true enables collapse for all items', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [
          { key: '1', title: 'One', content: 'body1' },
          { key: '2', title: 'Two', content: 'body2' },
        ],
        collapsible: true,
      },
    });

    expect(wrapper.findAll('.ant-thought-chain-item-content')).toHaveLength(0);
    expect(wrapper.find('.ant-thought-chain-item-collapsible').exists()).toBe(true);

    await wrapper.findAll('.ant-thought-chain-item-header')[0].trigger('click');
    await nextTick();
    expect(wrapper.text()).toContain('body1');
  });
});
