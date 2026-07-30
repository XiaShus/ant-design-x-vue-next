import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
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
      {
        title: 'utils',
        path: 'utils',
        children: [
          {
            title: 'index.ts',
            path: 'index.ts',
            content: 'export const a = 1;',
          },
        ],
      },
    ],
  },
  {
    title: 'README.md',
    path: 'README.md',
    content: '# Hello',
    children: [],
  },
];

describe('Folder', () => {
  it('renders root class', () => {
    const wrapper = mount(Folder, {
      props: { treeData },
    });
    expect(wrapper.find('.ant-folder').exists()).toBe(true);
  });

  it('shows content for defaultSelectedFile', async () => {
    const wrapper = mount(Folder, {
      props: {
        treeData,
        defaultSelectedFile: ['src', 'App.tsx'],
      },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toContain('export default function App() {}');
  });

  it('folder click does not change selection', async () => {
    const onFolderClick = vi.fn();
    const onSelectedFileChange = vi.fn();
    const wrapper = mount(Folder, {
      props: {
        treeData,
        defaultSelectedFile: ['src', 'App.tsx'],
        onFolderClick,
        onSelectedFileChange,
      },
    });
    await nextTick();

    const folderTitle = wrapper
      .findAll('.ant-tree-node-content-wrapper')
      .find((n) => n.text().includes('utils'));
    expect(folderTitle).toBeTruthy();
    await folderTitle!.trigger('click');
    await nextTick();

    expect(onFolderClick).toHaveBeenCalled();
    expect(onSelectedFileChange).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('export default function App() {}');
  });

  it('file click triggers selection callbacks', async () => {
    const onSelectedFileChange = vi.fn();
    const onFileClick = vi.fn();
    const wrapper = mount(Folder, {
      props: {
        treeData,
        onSelectedFileChange,
        onFileClick,
      },
    });
    await nextTick();

    const fileTitle = wrapper
      .findAll('.ant-tree-node-content-wrapper')
      .find((n) => n.text().includes('README.md'));
    expect(fileTitle).toBeTruthy();
    await fileTitle!.trigger('click');
    await nextTick();
    await nextTick();

    expect(onSelectedFileChange).toHaveBeenCalled();
    expect(onSelectedFileChange.mock.calls[0][0].path).toEqual(['README.md']);
    expect(onFileClick).toHaveBeenCalled();
    expect(wrapper.text()).toContain('# Hello');
  });

  it('exposes tree helpers', () => {
    const wrapper = mount(Folder, {
      props: { treeData },
    });
    const exposed = wrapper.vm as any;

    expect(exposed.getNode(['src', 'App.tsx'])?.title).toBe('App.tsx');

    const updated = exposed.updateNode(['src', 'App.tsx'], { content: 'new' });
    expect(getNodeFrom(updated, ['src', 'App.tsx'])?.content).toBe('new');
    expect(treeData[0].children?.[0].content).toBe('export default function App() {}');

    const deleted = exposed.deleteNode(['src', 'App.tsx']);
    expect(getNodeFrom(deleted, ['src', 'App.tsx'])).toBeUndefined();

    const added = exposed.addNode(['src'], {
      title: 'new.ts',
      path: 'new.ts',
      content: 'x',
      children: [],
    });
    expect(getNodeFrom(added, ['src', 'new.ts'])?.title).toBe('new.ts');
  });

  it('loads content via fileContentService', async () => {
    const loadFileContent = vi.fn(async () => 'from-service');
    const wrapper = mount(Folder, {
      props: {
        treeData,
        defaultSelectedFile: ['src', 'App.tsx'],
        fileContentService: { loadFileContent },
      },
    });
    await nextTick();
    await Promise.resolve();
    await nextTick();

    expect(loadFileContent).toHaveBeenCalledWith('src/App.tsx');
    expect(wrapper.text()).toContain('from-service');
  });

  it('hides icons when directoryIcons is false', async () => {
    const wrapper = mount(Folder, {
      props: {
        treeData,
        directoryIcons: false,
        defaultExpandAll: true,
      },
    });
    await nextTick();
    expect(wrapper.find('.anticon-folder').exists()).toBe(false);
    expect(wrapper.find('.anticon-file').exists()).toBe(false);
  });
});

function getNodeFrom(nodes: FolderTreeData[], path: string[]): FolderTreeData | undefined {
  let current: FolderTreeData[] | undefined = nodes;
  let found: FolderTreeData | undefined;
  for (const segment of path) {
    found = current?.find((n) => n.path === segment);
    if (!found) return undefined;
    current = found.children;
  }
  return found;
}
