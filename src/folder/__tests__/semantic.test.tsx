import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import Folder from '../Folder.vue';
import type { FolderTreeData } from '../interface';

const treeData: FolderTreeData[] = [
  {
    title: 'src',
    path: 'src',
    children: [
      {
        title: 'App.tsx',
        path: 'App.tsx',
        content: 'export default function App() {}',
      },
    ],
  },
];

describe('Folder classNames / styles', () => {
  it('applies semantic classNames and styles', async () => {
    const wrapper = mount(Folder, {
      props: {
        treeData,
        defaultSelectedFile: ['src', 'App.tsx'],
        directoryTitle: 'Files',
        previewTitle: 'Preview',
        classNames: {
          root: 'custom-folder-root',
          directoryTree: 'custom-directory-tree',
          directoryTitle: 'custom-directory-title',
          filePreview: 'custom-file-preview',
          previewTitle: 'custom-preview-title',
          previewRender: 'custom-preview-render',
        },
        styles: {
          root: { padding: '6px' },
          directoryTree: { width: '200px' },
        },
      },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toContain('export default function App() {}');

    expect(wrapper.classes()).toContain('custom-folder-root');
    expect((wrapper.element as HTMLElement).style.padding).toBe('6px');

    expect(wrapper.find('.custom-directory-tree').exists()).toBe(true);
    expect(wrapper.find('.custom-directory-title').exists()).toBe(true);
    expect(wrapper.find('.custom-file-preview').exists()).toBe(true);
    expect(wrapper.find('.custom-preview-title').exists()).toBe(true);
    expect(wrapper.find('.custom-preview-render').exists()).toBe(true);
  });
});
