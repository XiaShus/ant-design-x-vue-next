import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FileList from '../FileList/FileList.vue';

describe('Attachments items[].cardType', () => {
  it('maps cardType to FileListCard type (image preview)', () => {
    const wrapper = mount(FileList, {
      props: {
        prefixCls: 'ant-attachment',
        items: [
          {
            uid: '1',
            name: 'photo.bin',
            status: 'done',
            url: 'https://example.com/photo.bin',
            cardType: 'image',
          },
        ],
        onRemove: () => {},
        upload: {},
      },
    });

    expect(wrapper.find('.ant-attachment-list-card-type-preview').exists()).toBe(true);
  });

  it('keeps overview when cardType is file even for image extension', () => {
    const wrapper = mount(FileList, {
      props: {
        prefixCls: 'ant-attachment',
        items: [
          {
            uid: '2',
            name: 'photo.png',
            status: 'done',
            url: 'https://example.com/photo.png',
            cardType: 'file',
          },
        ],
        onRemove: () => {},
        upload: {},
      },
    });

    expect(wrapper.find('.ant-attachment-list-card-type-overview').exists()).toBe(true);
  });
});
