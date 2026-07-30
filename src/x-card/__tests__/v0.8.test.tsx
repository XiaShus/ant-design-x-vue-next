import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { Box, Card, clearCatalogCache, registerCatalog } from '../index';
import {
  applyDataModelUpdateV08,
  extractDataUpdatesV08,
  isLiteralStringObject,
  resolvePropsV08,
} from '../Card.v0.8';

const Text = defineComponent({
  name: 'A2UIDemoTextV08',
  props: { text: String },
  setup(p, { slots }) {
    return () =>
      h('div', [h('span', { class: 'demo-text' }, p.text), slots.default?.()]);
  },
});

const Button = defineComponent({
  name: 'A2UIDemoButtonV08',
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
          onClick: () => {
            const name =
              (p.action as any)?.name || (p.action as any)?.event?.name || 'click';
            (p.onAction as any)?.(name, {});
          },
        },
        p.text,
      );
  },
});

describe('XCard A2UI v0.8 helpers', () => {
  it('resolves literalString and path props', () => {
    expect(isLiteralStringObject({ literalString: 'hi' })).toBe(true);
    const props = resolvePropsV08(
      { text: '/user/name', title: 'static' },
      { user: { name: 'Ada' } },
    );
    expect(props.text).toBe('Ada');
    expect(props.title).toBe('static');
  });

  it('applies dataModelUpdate contents', () => {
    const next = applyDataModelUpdateV08(
      {},
      [
        { key: 'products', valueString: '[]' },
        { key: 'res', valueMap: [{ key: 'time', valueString: 'now' }] },
      ],
    );
    expect(next.products).toBe('[]');
    expect(next.res).toEqual({ time: 'now' });
  });

  it('extracts data updates from action.context array', () => {
    const updates = extractDataUpdatesV08(
      {
        name: 'submit',
        context: [{ key: 'guests', value: { path: '/form/guests' } }],
      },
      { guests: 3 },
    );
    expect(updates).toEqual([{ path: '/form/guests', value: 3 }]);
  });
});

describe('XCard A2UI v0.8 rendering', () => {
  it('renders after surfaceUpdate + beginRendering', async () => {
    clearCatalogCache();
    registerCatalog({
      $id: 'local://v08',
      components: {
        Text: { type: 'object', properties: { text: {} } },
        Button: { type: 'object' },
      },
    });

    const commands = [
      {
        surfaceUpdate: {
          surfaceId: 's1',
          components: [
            {
              id: 'root',
              component: {
                Text: {
                  text: { literalString: 'Hello v0.8' },
                  child: 'btn',
                },
              },
            },
            {
              id: 'btn',
              component: {
                Button: {
                  text: { literalString: 'Go' },
                  action: { name: 'submit' },
                },
              },
            },
          ],
        },
      },
      {
        beginRendering: { surfaceId: 's1', root: 'root' },
      },
    ];

    const onAction = vi.fn();
    const wrapper = mount(Box, {
      props: {
        commands,
        components: { Text, Button },
        onAction,
      },
      slots: {
        default: () => h(Card, { id: 's1' }),
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.find('.demo-text').text()).toBe('Hello v0.8');

    await wrapper.find('.demo-btn').trigger('click');
    expect(onAction).toHaveBeenCalled();
    expect(onAction.mock.calls[0][0].name).toBe('submit');
    expect(onAction.mock.calls[0][0].surfaceId).toBe('s1');
  });

  it('binds dataModelUpdate into text path', async () => {
    clearCatalogCache();
    registerCatalog({ $id: 'local://v08', components: { Text: { type: 'object' } } });

    const commands = [
      {
        surfaceUpdate: {
          surfaceId: 's1',
          components: [
            {
              id: 'root',
              component: {
                Text: { text: { path: '/user/name' } },
              },
            },
          ],
        },
      },
      {
        dataModelUpdate: {
          surfaceId: 's1',
          contents: [
            {
              key: 'user',
              valueMap: [{ key: 'name', valueString: 'Bob' }],
            },
          ],
        },
      },
      { beginRendering: { surfaceId: 's1', root: 'root' } },
    ];

    const wrapper = mount(Box, {
      props: {
        commands,
        components: { Text },
      },
      slots: {
        default: () => h(Card, { id: 's1' }),
      },
    });

    await nextTick();
    await nextTick();
    expect(wrapper.find('.demo-text').text()).toBe('Bob');
  });
});
