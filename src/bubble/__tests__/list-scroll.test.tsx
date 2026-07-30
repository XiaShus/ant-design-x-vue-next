import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { Bubble } from '../index';
import type { BubbleListRef } from '../interface';

describe('Bubble.List scroll ref', () => {
  it('exposes nativeElement / scrollBoxNativeElement and scrollTo top', async () => {
    const wrapper = mount(Bubble.List, {
      props: {
        items: [
          { key: '1', content: 'One' },
          { key: '2', content: 'Two' },
          { key: '3', content: 'Three' },
        ],
        autoScroll: false,
        style: { height: '80px', overflow: 'hidden' },
      },
      attachTo: document.body,
    });
    await nextTick();

    const list = wrapper.vm as unknown as BubbleListRef;
    const root = list.nativeElement as unknown as HTMLDivElement;
    const scrollBox = list.scrollBoxNativeElement as unknown as HTMLDivElement;

    expect(root.classList.contains('ant-bubble-list')).toBe(true);
    expect(scrollBox.classList.contains('ant-bubble-list-scroll-box')).toBe(true);
    expect(root.contains(scrollBox)).toBe(true);

    Object.defineProperty(scrollBox, 'scrollHeight', { value: 400, configurable: true });
    Object.defineProperty(scrollBox, 'clientHeight', { value: 80, configurable: true });
    const scrollTo = vi.fn();
    scrollBox.scrollTo = scrollTo;

    list.scrollTo({ top: 'bottom', behavior: 'auto' });
    expect(scrollTo).toHaveBeenCalledWith({ top: 400, behavior: 'auto' });

    scrollTo.mockClear();
    list.scrollTo({ top: 'top', behavior: 'auto' });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    scrollTo.mockClear();
    list.scrollTo({ top: 120, behavior: 'smooth' });
    expect(scrollTo).toHaveBeenCalledWith({ top: 120, behavior: 'smooth' });

    scrollTo.mockClear();
    list.scrollTo({ offset: 64, behavior: 'auto' });
    expect(scrollTo).toHaveBeenCalledWith({ top: 64, behavior: 'auto' });

    wrapper.unmount();
  });
});
