import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import { Box, Card, clearCatalogCache, registerBasicCatalog } from '../index';

describe('XCard basic catalog', () => {
  it('registerBasicCatalog renders Text / Button / Column', async () => {
    clearCatalogCache();
    const { catalogId, components } = registerBasicCatalog();
    const onAction = vi.fn();

    const commands = [
      {
        version: 'v0.9' as const,
        createSurface: { surfaceId: 's1', catalogId },
      },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 's1',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['title', 'btn'],
            },
            { id: 'title', component: 'Text', text: 'Basic Catalog' },
            {
              id: 'btn',
              component: 'Button',
              text: 'OK',
              action: { event: { name: 'ok' } },
            },
          ],
        },
      },
    ];

    const wrapper = mount(Box, {
      props: {
        commands,
        components,
        onAction,
      },
      slots: {
        default: () => h(Card, { id: 's1' }),
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.text()).toContain('Basic Catalog');
    await wrapper.find('.ant-x-card-basic-button').trigger('click');
    expect(onAction).toHaveBeenCalled();
    expect(onAction.mock.calls[0][0].name).toBe('ok');
  });
});
