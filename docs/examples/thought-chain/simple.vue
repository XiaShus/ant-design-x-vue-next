<script setup lang="tsx">
import {
  EditOutlined,
  GlobalOutlined,
  SearchOutlined,
  SunOutlined,
} from '@ant-design/icons-vue';
import { Flex, Typography } from 'ant-design-vue';
import { ThoughtChain } from 'ant-design-x-vue';

defineOptions({ name: 'AXThoughtChainSimple' });

const { Text } = Typography;

const onClick = () => {
  console.log('Item Click');
};

defineRender(() => {
  return (
    <Flex vertical gap="middle">
      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>loading status:</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item variant="solid" status="loading" title="Tool Calling" />
          <ThoughtChain.Item variant="outlined" status="loading" title="Tool Calling" />
          <ThoughtChain.Item variant="text" status="loading" title="Tool Calling" />
        </Flex>
      </Flex>

      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>success status:</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item variant="solid" status="success" title="Tool Call Finished" />
          <ThoughtChain.Item variant="outlined" status="success" title="Tool Call Finished" />
          <ThoughtChain.Item variant="text" status="success" title="Tool Call Finished" />
        </Flex>
      </Flex>

      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>error status:</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item variant="solid" status="error" title="Tool Call Error" />
          <ThoughtChain.Item variant="outlined" status="error" title="Tool Call Error" />
          <ThoughtChain.Item variant="text" status="error" title="Tool Call Error" />
        </Flex>
      </Flex>

      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>abort status</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item variant="solid" status="abort" title="Agent Response Aborted" />
          <ThoughtChain.Item variant="outlined" status="abort" title="Agent Response Aborted" />
          <ThoughtChain.Item variant="text" status="abort" title="Agent Response Aborted" />
        </Flex>
      </Flex>

      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>custom icon:</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item variant="solid" icon={<SunOutlined />} title="Task Completed" />
          <ThoughtChain.Item variant="outlined" icon={<SunOutlined />} title="Task Completed" />
          <ThoughtChain.Item variant="text" icon={<SunOutlined />} title="Task Completed" />
        </Flex>
      </Flex>

      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>click:</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item
            variant="solid"
            onClick={onClick}
            icon={<GlobalOutlined />}
            title="Opening Webpage"
            description="https://x.ant.design/docs/playground/copilot"
          />
          <ThoughtChain.Item
            variant="outlined"
            onClick={onClick}
            icon={<EditOutlined />}
            title="Creating"
            description="todo.md"
          />
          <ThoughtChain.Item
            variant="text"
            onClick={onClick}
            icon={<SearchOutlined />}
            title="Searching"
            description="Route Information"
          />
          <ThoughtChain.Item
            variant="solid"
            status="error"
            onClick={onClick}
            icon={<GlobalOutlined />}
            title="Opening Webpage"
            description="https://x.ant.design/docs/playground/copilot"
          />
        </Flex>
      </Flex>

      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>blink:</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item blink variant="solid" icon={<SunOutlined />} title="Task Completed" />
          <ThoughtChain.Item
            blink
            variant="outlined"
            icon={<SunOutlined />}
            title="Task Completed"
          />
          <ThoughtChain.Item
            blink
            variant="text"
            icon={<SunOutlined />}
            title="Task Completed"
            description="Route Information"
          />
        </Flex>
      </Flex>

      <Flex gap="small" align="flex-start">
        <Text style={{ whiteSpace: 'nowrap' }}>disabled:</Text>
        <Flex wrap="wrap" align="center" gap="middle">
          <ThoughtChain.Item
            disabled
            onClick={onClick}
            variant="solid"
            icon={<SunOutlined />}
            title="Task Completed"
          />
          <ThoughtChain.Item
            disabled
            onClick={onClick}
            variant="outlined"
            icon={<SunOutlined />}
            title="Task Completed"
          />
          <ThoughtChain.Item
            disabled
            onClick={onClick}
            variant="text"
            icon={<SunOutlined />}
            title="Task Completed"
            description="Route Information"
          />
          <ThoughtChain.Item
            disabled
            variant="solid"
            status="error"
            onClick={onClick}
            icon={<GlobalOutlined />}
            title="Opening Webpage"
            description="playground/copilot"
          />
        </Flex>
      </Flex>
    </Flex>
  );
});
</script>
