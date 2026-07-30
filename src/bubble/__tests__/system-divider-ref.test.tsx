import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import Bubble from '../index';
import type { BubbleListRef } from '../interface';

describe('Bubble.System / Bubble.Divider nativeElement', () => {
  it('exposes nativeElement on System and Divider compounds', async () => {
    const system = mount(Bubble.System, {
      props: { content: 'system message' },
    });
    const divider = mount(Bubble.Divider, {
      props: { content: 'divider' },
    });
    await nextTick();

    expect((system.vm as any).nativeElement).toBeInstanceOf(HTMLElement);
    expect((system.vm as any).nativeElement.className).toContain('ant-bubble-system');
    expect((divider.vm as any).nativeElement).toBeInstanceOf(HTMLElement);
    expect((divider.vm as any).nativeElement.className).toContain('ant-bubble-divider');
  });

  it('allows List scrollTo by key for system role', async () => {
    const listRef = ref<BubbleListRef>();
    mount(
      defineComponent({
        setup() {
          return () =>
            h(Bubble.List, {
              ref: listRef,
              items: [
                { key: 'sys', role: 'system', content: 'hello system' },
                { key: 'u1', role: 'user', content: 'hi' },
              ],
              style: { height: '200px', overflow: 'auto' },
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    await nextTick();

    expect(() => {
      listRef.value?.scrollTo({ key: 'sys', behavior: 'auto' });
    }).not.toThrow();
  });
});
