import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FileListCard from '../FileList/FileListCard.vue';

describe('Attachments FileListCard language icons', () => {
  it('uses language preset icons for java / js / py', () => {
    const java = mount(FileListCard, {
      props: { item: { uid: '1', name: 'Main.java' } as any },
    });
    const js = mount(FileListCard, {
      props: { item: { uid: '2', name: 'app.js' } as any },
    });
    const py = mount(FileListCard, {
      props: { item: { uid: '3', name: 'main.py' } as any },
    });

    expect(java.find('[aria-label="java"]').exists()).toBe(true);
    expect(js.find('[aria-label="javascript"]').exists()).toBe(true);
    expect(py.find('[aria-label="python"]').exists()).toBe(true);

    const byPreset = mount(FileListCard, {
      props: {
        item: { uid: '4', name: 'unknown.bin' } as any,
        icon: 'python',
      },
    });
    expect(byPreset.find('[aria-label="python"]').exists()).toBe(true);
  });
});
