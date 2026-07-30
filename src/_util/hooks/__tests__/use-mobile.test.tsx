import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useMobile } from '../use-mobile';

describe('useMobile', () => {
  it('is exported and defaults to false before matchMedia', async () => {
    let value: boolean | undefined;
    const Probe = defineComponent({
      setup() {
        const isMobile = useMobile();
        value = isMobile.value;
        return () => null;
      },
    });
    mount(Probe);
    expect(value).toBe(false);
    await nextTick();
  });

  it('updates when matchMedia matches', async () => {
    const listeners: Array<() => void> = [];
    const mql = {
      matches: true,
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mql),
    );

    let current = false;
    const Probe = defineComponent({
      setup() {
        const isMobile = useMobile();
        current = isMobile.value;
        return () => {
          current = isMobile.value;
          return null;
        };
      },
    });
    const wrapper = mount(Probe);
    await nextTick();
    expect(current).toBe(true);
    wrapper.unmount();
    vi.unstubAllGlobals();
  });
});
