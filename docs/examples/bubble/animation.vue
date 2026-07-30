<script setup lang="tsx">
import { UserOutlined } from '@ant-design/icons-vue';
import { Button, Flex, Switch, Typography } from 'ant-design-vue';
import { Bubble } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'BubbleAnimation' });

const keepPrefix = ref(true);
const content = ref('Ant Design X — streaming prefix kept by default.');

const typing = computed(() => ({
  step: 2,
  interval: 40,
  keepPrefix: keepPrefix.value,
}));

const replaceContent = () => {
  content.value =
    content.value.startsWith('Ant Design X')
      ? 'Completely different answer — retypes from start when keepPrefix is off.'
      : 'Ant Design X — streaming prefix kept by default.';
};

const appendStream = () => {
  if (!content.value.startsWith('Ant Design X')) {
    content.value = 'Ant Design X';
  }
  content.value += ' more tokens…';
};

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Flex gap="middle" align="center" wrap="wrap">
        <Typography.Text>keepPrefix:</Typography.Text>
        <Switch
          checked={keepPrefix.value}
          checkedChildren="true"
          unCheckedChildren="false"
          onChange={(checked) => {
            keepPrefix.value = !!checked;
          }}
        />
        <Button onClick={appendStream}>Append (stream)</Button>
        <Button onClick={replaceContent}>Replace content</Button>
      </Flex>
      <Bubble
        content={content.value}
        typing={typing.value}
        avatar={{ icon: <UserOutlined /> }}
      />
    </Flex>
  );
});
</script>
