import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Box, Card, registerCatalog, clearCatalogCache } from '../index';

const Text = defineComponent({
  name: 'Text',
  props: { text: String },
  setup(p, { slots }) {
    return () =>
      h('div', [h('span', { class: 'demo-text' }, p.text), slots.default?.()]);
  },
});

const Button = defineComponent({
  name: 'Button',
  props: {
    text: String,
    action: Object,
    onAction: Function,
  },
  setup(p) {
    return () =>
      h(
        'button',
        {
          class: 'demo-btn',
          onClick: () => (p.onAction as any)?.(p.action?.event?.name || 'click', {}),
        },
        p.text,
      );
  },
});

describe('XCard A2UI v0.9', () => {
  it('renders components from updateComponents commands', async () => {
    clearCatalogCache();
    registerCatalog({
      $id: 'local://demo',
      components: {
        Text: { type: 'object', properties: { text: {} } },
        Button: { type: 'object', properties: { text: {}, action: {} } },
      },
    });

    const commands = ref([
      {
        version: 'v0.9' as const,
        createSurface: { surfaceId: 's1', catalogId: 'local://demo' },
      },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 's1',
          components: [
            { id: 'root', component: 'Text', text: 'Hello A2UI' },
          ],
        },
      },
    ]);

    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Box,
            {
              commands: commands.value,
              components: { Text, Button },
            },
            () => h(Card, { id: 's1' }),
          );
      },
    });

    const wrapper = mount(Host);
    await nextTick();
    await nextTick();
    expect(wrapper.find('.demo-text').text()).toBe('Hello A2UI');
  });

  it('fires onAction from Button', async () => {
    clearCatalogCache();
    registerCatalog({ $id: 'local://demo', components: { Button: { type: 'object' } } });

    const onAction = vi.fn();
    const commands = [
      {
        version: 'v0.9' as const,
        createSurface: { surfaceId: 's1', catalogId: 'local://demo' },
      },
      {
        version: 'v0.9' as const,
        updateComponents: {
          surfaceId: 's1',
          components: [
            {
              id: 'root',
              component: 'Button',
              text: 'Go',
              action: { event: { name: 'submit' } },
            },
          ],
        },
      },
    ];

    const wrapper = mount(Box, {
      props: {
        commands,
        components: { Button },
        onAction,
      },
      slots: {
        default: () => h(Card, { id: 's1' }),
      },
    });

    await nextTick();
    await nextTick();
    await wrapper.find('.demo-btn').trigger('click');
    expect(onAction).toHaveBeenCalled();
    expect(onAction.mock.calls[0][0].name).toBe('submit');
    expect(onAction.mock.calls[0][0].surfaceId).toBe('s1');
  });

  it('rejects non-allowlisted remote catalog ids', async () => {
    clearCatalogCache();
    const { loadCatalog } = await import('../catalog');
    await expect(
      loadCatalog('https://evil.example/catalog.json', ['local://ok']),
    ).rejects.toThrow(/allowedCatalogIds/);
  });
});
