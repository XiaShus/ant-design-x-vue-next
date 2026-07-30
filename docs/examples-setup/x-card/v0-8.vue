<script setup lang="ts">
import { Button as AntButton } from 'ant-design-vue';
import { computed, defineComponent, h, ref } from 'vue';
import { Box, Card, registerCatalog, type A2UICommand_v0_8 } from 'ant-design-x-vue';

defineOptions({ name: 'AXXCardV08Setup' });

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
    return () =>
      h('div', [h('p', { style: { margin: '0 0 12px' } }, p.text), slots.default?.()]);
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
    return () =>
      h(
        AntButton,
        {
          type: 'primary',
          onClick: () => {
            const name =
              (p.action as any)?.name || (p.action as any)?.event?.name || 'click';
            (p.onAction as any)?.(name, {});
          },
        },
        () => p.text,
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

const onAction = (payload: { name: string; surfaceId: string; context: Record<string, any> }) => {
  actionLog.value = JSON.stringify(payload);
};
</script>

<template>
  <div>
    <Box
      :commands="commands"
      :components="comps"
      :on-action="onAction"
    >
      <Card id="main" />
    </Box>
    <pre
      v-if="actionLog"
      :style="{ marginTop: '12px', fontSize: '12px' }"
    >{{ actionLog }}</pre>
  </div>
</template>
