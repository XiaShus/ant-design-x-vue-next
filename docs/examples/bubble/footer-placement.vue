<script setup lang="tsx">
import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Avatar, Flex } from 'ant-design-vue';
import { Actions, Bubble } from 'ant-design-x-vue';

defineOptions({ name: 'AXBubbleFooterPlacement' });

const actionItems = [
  { key: 'retry', icon: <RedoOutlined />, label: 'Retry' },
  { key: 'copy', icon: <CopyOutlined />, label: 'Copy' },
];

defineRender(() => {
  return (
    <Flex vertical gap="small">
      <Bubble
        content="outer footer"
        header="footer"
        avatar={<Avatar icon={<UserOutlined />} />}
        footer={() => <Actions items={actionItems} />}
      />
      <Bubble
        content="inner footer"
        placement="end"
        footerPlacement="inner-end"
        header="footer"
        avatar={<Avatar icon={<UserOutlined />} />}
        footer={() => <Actions items={actionItems} />}
      />
      <Bubble
        content="outer footer and align right"
        footerPlacement="outer-end"
        header="footer"
        avatar={<Avatar icon={<UserOutlined />} />}
        footer={() => <Actions items={actionItems} />}
      />
      <Bubble
        content="inner footer and align left"
        placement="end"
        footerPlacement="inner-start"
        header="footer"
        avatar={<Avatar icon={<UserOutlined />} />}
        footer={() => <Actions items={actionItems} />}
      />
    </Flex>
  );
});
</script>
