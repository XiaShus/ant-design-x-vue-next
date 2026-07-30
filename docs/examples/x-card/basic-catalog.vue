<script setup lang="tsx">
import { ref } from 'vue';
import {
  Box,
  Card,
  registerBasicCatalog,
  type A2UICommand_v0_9,
} from 'ant-design-x-vue';

defineOptions({ name: 'AXXCardBasicCatalog' });

const { catalogId, components } = registerBasicCatalog();
const actionLog = ref('');

const commands = ref<A2UICommand_v0_9[]>([
  {
    version: 'v0.9',
    createSurface: { surfaceId: 'main', catalogId },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'main',
      path: '/form',
      value: { name: 'Ada' },
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'main',
      components: [
        {
          id: 'root',
          component: 'Card',
          children: ['col'],
        },
        {
          id: 'col',
          component: 'Column',
          children: ['title', 'field', 'row'],
        },
        { id: 'title', component: 'Text', text: '内置 Basic Catalog' },
        {
          id: 'field',
          component: 'TextField',
          label: '姓名',
          value: { path: '/form/name' },
          placeholder: '请输入',
        },
        {
          id: 'row',
          component: 'Row',
          children: ['submit'],
        },
        {
          id: 'submit',
          component: 'Button',
          text: '提交',
          action: {
            event: {
              name: 'submit',
              context: { name: { path: '/form/name' } },
            },
          },
        },
      ],
    },
  },
]);

defineRender(() => {
  return (
    <div>
      <Box
        commands={commands.value}
        components={components}
        allowedCatalogIds={[catalogId]}
        onAction={(payload) => {
          actionLog.value = JSON.stringify(payload);
        }}
      >
        <Card id="main" />
      </Box>
      {actionLog.value ? (
        <pre style={{ marginTop: 12, fontSize: 12 }}>{actionLog.value}</pre>
      ) : null}
    </div>
  );
});
</script>
