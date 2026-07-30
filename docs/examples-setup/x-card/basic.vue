<script setup lang="ts">
import { Button as AntButton } from 'ant-design-vue';
import { defineComponent, h, ref } from 'vue';
import { Box, Card, registerCatalog, type A2UICommand_v0_9 } from 'ant-design-x-vue';

defineOptions({ name: 'AXXCardBasicSetup' });

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
          onClick: () => (p.onAction as any)?.((p.action as any)?.event?.name || 'click', {}),
        },
        () => p.text,
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

const components = { Text, Button };

const onAction = (payload: { name: string; surfaceId: string }) => {
  actionLog.value = `action=${payload.name}, surface=${payload.surfaceId}`;
};
</script>

<template>
  <div>
    <Box
      :commands="commands"
      :components="components"
      :allowed-catalog-ids="['local://demo']"
      :on-action="onAction"
    >
      <Card id="main" />
    </Box>
    <p v-if="actionLog" style="margin-top: 12px; color: #666">{{ actionLog }}</p>
  </div>
</template>
