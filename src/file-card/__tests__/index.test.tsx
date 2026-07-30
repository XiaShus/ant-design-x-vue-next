import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import FileCard from '../FileCard.vue';
import List from '../List.vue';

describe('FileCard', () => {
  it('renders file name and size', () => {
    const wrapper = mount(FileCard, {
      props: {
        name: 'report.pdf',
        byte: 1024,
      },
    });

    expect(wrapper.text()).toContain('report');
    expect(wrapper.text()).toContain('.pdf');
    expect(wrapper.text()).toContain('1 KB');
  });

  it('supports small size', () => {
    const wrapper = mount(FileCard, {
      props: {
        name: 'a.docx',
        size: 'small',
      },
    });

    expect(wrapper.find('.ant-file-card-file-small').exists()).toBe(true);
  });

  it('emits click with card info', async () => {
    const onClick = vi.fn();
    const wrapper = mount(FileCard, {
      props: {
        name: 'a.txt',
        byte: 2048,
        onClick,
      },
    });

    await wrapper.find('.ant-file-card-file').trigger('click');
    expect(onClick).toHaveBeenCalled();
    expect(onClick.mock.calls[0][0].name).toBe('a.txt');
  });

  it('uses language preset icons for java / js / py', () => {
    const java = mount(FileCard, { props: { name: 'Main.java' } });
    const js = mount(FileCard, { props: { name: 'app.js' } });
    const py = mount(FileCard, { props: { name: 'main.py' } });

    expect(java.find('[aria-label="java"]').exists()).toBe(true);
    expect(js.find('[aria-label="javascript"]').exists()).toBe(true);
    expect(py.find('[aria-label="python"]').exists()).toBe(true);

    const byPreset = mount(FileCard, {
      props: { name: 'unknown.bin', icon: 'python' },
    });
    expect(byPreset.find('[aria-label="python"]').exists()).toBe(true);
  });
});

describe('FileCard.List', () => {
  it('renders multiple cards', () => {
    const wrapper = mount(List, {
      props: {
        items: [
          { name: 'a.pdf', byte: 100 },
          { name: 'b.docx', byte: 200 },
        ],
      },
    });

    expect(wrapper.text()).toContain('a');
    expect(wrapper.text()).toContain('b');
  });
});
