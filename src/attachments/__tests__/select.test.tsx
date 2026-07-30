import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import Attachments from '../Attachments.vue';
import type { AttachmentsRef } from '../interface';

describe('Attachments select / fileNativeElement', () => {
  it('exposes fileNativeElement and select opens picker', async () => {
    const wrapper = mount(Attachments, {
      props: {
        beforeUpload: () => false,
        accept: 'image/*',
      },
      attachTo: document.body,
    });
    await nextTick();

    const vm = wrapper.vm as unknown as AttachmentsRef;

    expect(vm.fileNativeElement).toBeTruthy();
    expect(vm.fileNativeElement?.tagName).toBe('INPUT');
    expect(vm.fileNativeElement?.type).toBe('file');

    const input = vm.fileNativeElement!;
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => {});

    vm.select({ accept: '.png,.jpg', multiple: true });
    expect(input.accept).toBe('.png,.jpg');
    expect(input.multiple).toBe(true);
    expect(clickSpy).toHaveBeenCalledTimes(1);

    vm.select();
    expect(input.accept).toBe('image/*');
    expect(input.multiple).toBe(false);
    expect(clickSpy).toHaveBeenCalledTimes(2);

    wrapper.unmount();
  });

  it('default slot acts as custom trigger (children mode)', async () => {
    const attRef = ref<AttachmentsRef | null>(null);
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Attachments,
              { ref: attRef, beforeUpload: () => false },
              {
                default: () => h('button', { class: 'custom-trigger', type: 'button' }, 'Pick'),
              },
            );
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();

    expect(wrapper.find('.custom-trigger').exists()).toBe(true);
    expect(wrapper.find('.ant-attachment').exists()).toBe(false);

    expect(attRef.value?.fileNativeElement).toBeTruthy();
    const clickSpy = vi.spyOn(attRef.value!.fileNativeElement!, 'click').mockImplementation(() => {});
    attRef.value!.select({ multiple: true });
    expect(attRef.value!.fileNativeElement!.multiple).toBe(true);
    expect(clickSpy).toHaveBeenCalled();

    wrapper.unmount();
  });

  it('upload assigns files on the shared file input', async () => {
    const wrapper = mount(Attachments, {
      props: {
        beforeUpload: () => false,
      },
      attachTo: document.body,
    });
    await nextTick();

    const vm = wrapper.vm as unknown as AttachmentsRef;
    const input = vm.fileNativeElement!;
    expect(input).toBeTruthy();

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    vm.upload(file);
    await nextTick();

    expect(input.files?.length).toBe(1);
    expect(input.files?.[0]?.name).toBe('hello.txt');
    wrapper.unmount();
  });
});
