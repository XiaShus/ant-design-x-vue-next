<script setup lang="tsx">
import { SearchOutlined } from '@ant-design/icons-vue';
import { Flex } from 'ant-design-vue';
import { ref } from 'vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSwitchDemo' });

const value = ref(false);

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Flex align="center" gap="small">
        Default: <Sender.Switch icon={<SearchOutlined />}>Deep Search</Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        Custom checked/unchecked content:
        <Sender.Switch
          checkedChildren={'Deep Search: on'}
          unCheckedChildren={'Deep Search: off'}
          icon={<SearchOutlined />}
        />
      </Flex>
      <Flex align="center" gap="small">
        Disabled:
        <Sender.Switch disabled icon={<SearchOutlined />}>
          Deep Search
        </Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        Loading:
        <Sender.Switch loading icon={<SearchOutlined />}>
          Deep Search
        </Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        DefaultValue:
        <Sender.Switch
          icon={<SearchOutlined />}
          defaultValue={true}
          onChange={(checked) => {
            console.log('Switch toggled', checked);
          }}
        >
          Deep Search
        </Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        Controlled mode:
        <Sender.Switch
          icon={<SearchOutlined />}
          value={value.value}
          onChange={(checked) => {
            value.value = checked;
          }}
        >
          Deep Search
        </Sender.Switch>
      </Flex>
    </Flex>
  );
});
</script>
