import { describe, expect, it } from 'vitest';
import type { ConversationsProps, ConversationsRef } from '../index';

describe('ConversationsProps / ConversationsRef exports', () => {
  it('exports ConversationsProps from package entry', () => {
    const props = {
      activeKey: 'a',
      items: [],
    } as const satisfies ConversationsProps;
    expect(props.activeKey).toBe('a');
  });

  it('exports ConversationsRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('ul'),
    } satisfies ConversationsRef;
    expect(ref.nativeElement.tagName).toBe('UL');
  });
});
