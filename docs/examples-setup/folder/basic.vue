<script setup lang="ts">
import { Folder, type FolderTreeData } from 'ant-design-x-vue';

defineOptions({ name: 'AXFolderBasicSetup' });

const appVueContent = [
  '<' + 'script setup lang="ts">',
  "import { ref } from 'vue';",
  'const count = ref(0);',
  '</' + 'script>',
  '',
  '<template>',
  '  <button @click="count++">{{ count }}</button>',
  '</template>',
  '',
].join('\n');

const treeData: FolderTreeData[] = [
  {
    title: 'src',
    path: 'src',
    children: [
      {
        title: 'App.vue',
        path: 'App.vue',
        content: appVueContent,
      },
      {
        title: 'utils',
        path: 'utils',
        children: [
          {
            title: 'index.ts',
            path: 'index.ts',
            content: 'export const sum = (a: number, b: number) => a + b;\n',
          },
        ],
      },
    ],
  },
  {
    title: 'README.md',
    path: 'README.md',
    content: '# Ant Design X Vue Next\n\nFolder demo.\n',
    children: [],
  },
];
</script>

<template>
  <div style="height: 420px; border: 1px solid #f0f0f0; border-radius: 8px">
    <Folder :tree-data="treeData" :default-selected-file="['src', 'App.vue']" />
  </div>
</template>
