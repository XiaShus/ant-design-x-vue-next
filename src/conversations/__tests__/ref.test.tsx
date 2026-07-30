import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Conversations from '../Conversations.vue';
import type { ConversationsRef } from '../interface';

describe('Conversations ref', () => {
  it('exposes nativeElement root', async () => {
    const wrapper = mount(Conversations, {
      props: {
        items: [{ key: '1', label: 'Chat 1' }],
      },
    });
    await nextTick();

    const api = wrapper.vm as unknown as ConversationsRef;
    const el = api.nativeElement as unknown as HTMLUListElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains('ant-conversations')).toBe(true);
    expect(el.tagName.toLowerCase()).toBe('ul');

    wrapper.unmount();
  });
});
