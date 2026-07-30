<script setup lang="ts">
import {
  EditOutlined,
  GlobalOutlined,
  SearchOutlined,
  SunOutlined,
} from '@ant-design/icons-vue';
import { Flex, Typography } from 'ant-design-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXThoughtChainSimpleSetup' });

const { Text } = Typography;

const onClick = () => {
  console.log('Item Click');
};
</script>

<template>
  <Flex vertical gap="middle">
    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">loading status:</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item variant="solid" status="loading" title="Tool Calling" />
        <ThoughtChain.Item variant="outlined" status="loading" title="Tool Calling" />
        <ThoughtChain.Item variant="text" status="loading" title="Tool Calling" />
      </Flex>
    </Flex>

    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">success status:</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item variant="solid" status="success" title="Tool Call Finished" />
        <ThoughtChain.Item variant="outlined" status="success" title="Tool Call Finished" />
        <ThoughtChain.Item variant="text" status="success" title="Tool Call Finished" />
      </Flex>
    </Flex>

    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">error status:</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item variant="solid" status="error" title="Tool Call Error" />
        <ThoughtChain.Item variant="outlined" status="error" title="Tool Call Error" />
        <ThoughtChain.Item variant="text" status="error" title="Tool Call Error" />
      </Flex>
    </Flex>

    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">abort status</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item variant="solid" status="abort" title="Agent Response Aborted" />
        <ThoughtChain.Item variant="outlined" status="abort" title="Agent Response Aborted" />
        <ThoughtChain.Item variant="text" status="abort" title="Agent Response Aborted" />
      </Flex>
    </Flex>

    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">custom icon:</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item variant="solid" :icon="h(SunOutlined)" title="Task Completed" />
        <ThoughtChain.Item variant="outlined" :icon="h(SunOutlined)" title="Task Completed" />
        <ThoughtChain.Item variant="text" :icon="h(SunOutlined)" title="Task Completed" />
      </Flex>
    </Flex>

    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">click:</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item
          variant="solid"
          :icon="h(GlobalOutlined)"
          title="Opening Webpage"
          description="https://x.ant.design/docs/playground/copilot"
          @click="onClick"
        />
        <ThoughtChain.Item
          variant="outlined"
          :icon="h(EditOutlined)"
          title="Creating"
          description="todo.md"
          @click="onClick"
        />
        <ThoughtChain.Item
          variant="text"
          :icon="h(SearchOutlined)"
          title="Searching"
          description="Route Information"
          @click="onClick"
        />
      </Flex>
    </Flex>

    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">blink:</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item blink variant="solid" :icon="h(SunOutlined)" title="Task Completed" />
        <ThoughtChain.Item blink variant="outlined" :icon="h(SunOutlined)" title="Task Completed" />
        <ThoughtChain.Item
          blink
          variant="text"
          :icon="h(SunOutlined)"
          title="Task Completed"
          description="Route Information"
        />
      </Flex>
    </Flex>

    <Flex gap="small" align="flex-start">
      <Text style="white-space: nowrap">disabled:</Text>
      <Flex wrap="wrap" align="center" gap="middle">
        <ThoughtChain.Item
          disabled
          variant="solid"
          :icon="h(SunOutlined)"
          title="Task Completed"
          @click="onClick"
        />
        <ThoughtChain.Item
          disabled
          variant="outlined"
          :icon="h(SunOutlined)"
          title="Task Completed"
          @click="onClick"
        />
        <ThoughtChain.Item
          disabled
          variant="text"
          :icon="h(SunOutlined)"
          title="Task Completed"
          description="Route Information"
          @click="onClick"
        />
      </Flex>
    </Flex>
  </Flex>
</template>
