<script setup lang="tsx">
import { Button, Flex, message } from 'ant-design-vue';
import { ref } from 'vue';
import { Sender } from 'ant-design-x-vue';
import type { SkillType, SlotConfigType } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSlotFillingDemo' });

const slotConfig: SlotConfigType[] = [
  { type: 'text', value: 'I want to travel to ' },
  {
    type: 'content',
    key: 'location',
    props: { defaultValue: 'Beijing', placeholder: '[location]' },
  },
  { type: 'text', value: ' by ' },
  {
    type: 'select',
    key: 'transportation',
    props: {
      defaultValue: 'airplane',
      options: ['airplane', 'high-speed rail', 'cruise ship'],
      placeholder: 'transportation',
    },
  },
  { type: 'text', value: ' with account ' },
  {
    type: 'input',
    key: 'account',
    props: { placeholder: 'account' },
  },
  { type: 'text', value: '.' },
];

const skillConfig: SkillType = {
  value: 'travelId',
  title: 'Travel Planner',
  toolTip: { title: 'Travel Skill' },
  closable: true,
};

const senderRef = ref<InstanceType<typeof Sender> | null>(null);
const output = ref('');
const skillValue = ref('');

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Flex wrap gap="small">
        <Button onClick={() => senderRef.value?.clear?.()}>Clear</Button>
        <Button
          onClick={() => {
            const val = senderRef.value?.getValue?.();
            output.value = val?.value ?? '';
            skillValue.value = val?.skill?.value ?? '';
          }}
        >
          Get Value
        </Button>
        <Button
          onClick={() => {
            senderRef.value?.insert?.([{ type: 'text', value: ' extra' }]);
          }}
        >
          Insert Text
        </Button>
      </Flex>
      <Sender
        ref={senderRef}
        skill={skillConfig}
        slotConfig={slotConfig}
        placeholder="Enter to send message"
        onSubmit={(value) => {
          output.value = value;
          message.success(`Send: ${value}`);
          senderRef.value?.clear?.();
        }}
        onChange={(value, _event, _slotConfig, skill) => {
          if (!skill) {
            skillValue.value = '';
          }
        }}
      />
      {skillValue.value ? <div>skill: {skillValue.value}</div> : null}
      {output.value ? <div>value: {output.value}</div> : null}
    </Flex>
  );
});
</script>
