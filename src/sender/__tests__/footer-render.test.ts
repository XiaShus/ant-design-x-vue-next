import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import type { FooterRender } from '../index';

describe('Sender FooterRender export', () => {
  it('exports FooterRender from package entry', () => {
    const render: FooterRender = ({ components }) =>
      h('div', { class: 'footer' }, [h(components.SendButton as any)]);
    expect(typeof render).toBe('function');
  });
});
