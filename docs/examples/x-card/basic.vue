<script setup lang="tsx">
import { Button as AntButton } from 'ant-design-vue';
import { computed, defineComponent, ref } from 'vue';
import { Box, Card, registerCatalog, type A2UICommand_v0_9 } from 'ant-design-x-vue';

defineOptions({ name: 'AXXCardBasic' });

registerCatalog({
  $id: 'local://demo',
  components: {
    Text: { type: 'object', properties: { text: {} } },
    Button: { type: 'object', properties: { text: {}, action: {} } },
  },
});

const Text = defineComponent({
  name: 'Text',
  props: { text: String },
  setup(p, { slots }) {
    return () => (
      <div>
        <p style={{ margin: '0 0 12px' }}>{p.text}</p>
        {slots.default?.()}
      </div>
    );
  },
});

const Button = defineComponent({
  name: 'Button',
  props: {
    text: String,
    action: Object,
    onAction: Function,
  },
  setup(p) {
    return () => (
      <AntButton
        type="primary"
        onClick={() => (p.onAction as any)?.((p.action as any)?.event?.name || 'click', {})}
      >
        {p.text}
      </AntButton>
    );
  },
});

const actionLog = ref('');
const commands = ref<A2UICommand_v0_9[]>([
  {
    version: 'v0.9',
    createSurface: { surfaceId: 'main', catalogId: 'local://demo' },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'main',
      components: [
        { id: 'root', component: 'Text', text: '这是 A2UI 动态卡片（v0.9）', children: ['btn'] },
        {
          id: 'btn',
          component: 'Button',
          text: '提交',
          action: { event: { name: 'submit' } },
        },
      ],
    },
  },
]);

const comps = computed(() => ({ Text, Button }));

defineRender(() => {
  return (
    <div>
      <Box
        commands={commands.value}
        components={comps.value}
        allowedCatalogIds={['local://demo']}
        onAction={(payload) => {
          actionLog.value = `action=${payload.name}, surface=${payload.surfaceId}`;
        }}
      >
        <Card id="main" />
      </Box>
      {actionLog.value ? <p style={{ marginTop: 12, color: '#666' }}>{actionLog.value}</p> : null}
    </div>
  );
});
</script>
