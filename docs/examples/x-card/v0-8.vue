<script setup lang="tsx">
import { Button as AntButton } from 'ant-design-vue';
import { computed, defineComponent, ref } from 'vue';
import { Box, Card, registerCatalog, type A2UICommand_v0_8 } from 'ant-design-x-vue';

defineOptions({ name: 'AXXCardV08' });

registerCatalog({
  $id: 'local://demo-v08',
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
        onClick={() => {
          const name =
            (p.action as any)?.name || (p.action as any)?.event?.name || 'click';
          (p.onAction as any)?.(name, {});
        }}
      >
        {p.text}
      </AntButton>
    );
  },
});

const actionLog = ref('');
const commands = ref<A2UICommand_v0_8[]>([
  {
    surfaceUpdate: {
      surfaceId: 'main',
      components: [
        {
          id: 'root',
          component: {
            Text: {
              text: { literalString: '这是 A2UI 动态卡片（v0.8）' },
              child: 'btn',
            },
          },
        },
        {
          id: 'btn',
          component: {
            Button: {
              text: { literalString: '提交' },
              action: {
                name: 'submit',
                context: [{ key: 'note', value: { literalString: 'from-v0.8' } }],
              },
            },
          },
        },
      ],
    },
  },
  {
    beginRendering: { surfaceId: 'main', root: 'root' },
  },
]);

const comps = computed(() => ({ Text, Button }));

defineRender(() => {
  return (
    <div>
      <Box
        commands={commands.value}
        components={comps.value}
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
