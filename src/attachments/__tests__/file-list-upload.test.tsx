import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Attachments from '../Attachments.vue';

const sampleItems = [
  { uid: '1', name: 'a.png', status: 'done' as const },
  { uid: '2', name: 'b.png', status: 'done' as const },
];

describe('Attachments FileList upload slot / maxCount', () => {
  it('hides FileList upload trigger when maxCount is reached', async () => {
    const wrapper = mount(Attachments, {
      props: {
        items: sampleItems,
        maxCount: 2,
        beforeUpload: () => false,
      },
      attachTo: document.body,
    });
    await nextTick();

    const uploadBtn = wrapper.find('.ant-attachment-list-upload-btn');
    expect(uploadBtn.exists()).toBe(true);
    // SilentUploader keeps input mounted but hides via display:none on wrapper
    let hideRoot: HTMLElement | null = uploadBtn.element.parentElement;
    while (hideRoot && hideRoot.style.display !== 'none') {
      hideRoot = hideRoot.parentElement;
    }
    expect(hideRoot?.style.display).toBe('none');

    wrapper.unmount();
  });

  it('shows FileList upload trigger when under maxCount', async () => {
    const wrapper = mount(Attachments, {
      props: {
        items: [sampleItems[0]],
        maxCount: 2,
        beforeUpload: () => false,
      },
      attachTo: document.body,
    });
    await nextTick();

    const uploadBtn = wrapper.find('.ant-attachment-list-upload-btn');
    expect(uploadBtn.exists()).toBe(true);
    let hideRoot: HTMLElement | null = uploadBtn.element.parentElement;
    while (hideRoot && hideRoot.style.display !== 'none' && hideRoot !== document.body) {
      hideRoot = hideRoot.parentElement;
    }
    expect(hideRoot?.style.display === 'none').toBe(false);

    wrapper.unmount();
  });

  it('supports #upload slot as FileList custom trigger', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Attachments,
              {
                items: [sampleItems[0]],
                beforeUpload: () => false,
              },
              {
                upload: () => h('button', { class: 'custom-list-upload', type: 'button' }, 'Add more'),
              },
            );
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();

    expect(wrapper.find('.custom-list-upload').exists()).toBe(true);
    expect(wrapper.find('.ant-attachment-list-upload-btn').exists()).toBe(false);

    wrapper.unmount();
  });
});
