import { describe, expect, it } from 'vitest';
import type { Attachment, AttachmentsProps, AttachmentsRef } from '../index';

describe('AttachmentsProps / AttachmentsRef / Attachment exports', () => {
  it('exports Attachment from package entry', () => {
    const item = {
      uid: '-1',
      name: 'a.pdf',
      cardType: 'file',
    } as const satisfies Attachment;
    expect(item.name).toBe('a.pdf');
  });

  it('exports AttachmentsProps from package entry', () => {
    const props = {
      items: [],
      disabled: false,
    } as const satisfies AttachmentsProps;
    expect(props.disabled).toBe(false);
  });

  it('exports AttachmentsRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
      fileNativeElement: null,
      upload: () => {},
      select: () => {},
    } satisfies AttachmentsRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
