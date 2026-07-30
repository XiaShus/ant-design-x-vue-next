import { describe, expect, it } from 'vitest';
import type {
  AttachmentsSemanticType,
  PlaceholderConfig,
  PlaceholderType,
} from '../index';

describe('Attachments type exports', () => {
  it('exports AttachmentsSemanticType and PlaceholderType from package entry', () => {
    const list = 'list' satisfies AttachmentsSemanticType;
    const item = 'item' satisfies AttachmentsSemanticType;
    const placeholder = 'placeholder' satisfies AttachmentsSemanticType;
    const upload = 'upload' satisfies AttachmentsSemanticType;
    const config = { title: 'Drop files' } satisfies PlaceholderType;
    expect(list).toBe('list');
    expect(item).toBe('item');
    expect(placeholder).toBe('placeholder');
    expect(upload).toBe('upload');
    expect(config.title).toBe('Drop files');
  });

  it('exports PlaceholderConfig from package entry', () => {
    const config = {
      icon: undefined,
      title: 'Upload',
      description: 'Drop files here',
    } satisfies PlaceholderConfig;
    expect(config.title).toBe('Upload');
    expect(config.description).toBe('Drop files here');
  });
});
