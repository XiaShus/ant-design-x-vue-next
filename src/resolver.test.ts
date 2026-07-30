import { describe, expect, it } from 'vitest';
import { AntDesignXVueResolver } from '../resolver/index';

describe('AntDesignXVueResolver', () => {
  const resolve = AntDesignXVueResolver();

  it('maps AXProvider to XProvider export', () => {
    expect(resolve('AXProvider')).toEqual({
      name: 'XProvider',
      from: 'ant-design-x-vue-next',
      as: 'AXProvider',
    });
  });

  it('resolves AXBubble by export name Bubble', () => {
    expect(resolve('AXBubble')).toEqual({
      name: 'Bubble',
      from: 'ant-design-x-vue-next',
      as: 'AXBubble',
    });
  });

  it('ignores non-prefixed names', () => {
    expect(resolve('Bubble')).toBeUndefined();
  });
});
