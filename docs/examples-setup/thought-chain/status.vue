<script setup lang="ts">
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons-vue';
import { Button, Card } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainItem } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXThoughtChainStatusSetup' });

function getStatusIcon(status: ThoughtChainItem['status']) {
  switch (status) {
    case 'success':
      return h(CheckCircleOutlined);
    case 'error':
      return h(CloseCircleOutlined);
    case 'abort':
      return h(MinusCircleOutlined);
    case 'loading':
    case 'pending':
      return h(LoadingOutlined);
    default:
      return undefined;
  }
}

const mockServerResponseData: ThoughtChainItem[] = [
  {
    title: 'Thought Chain Item - 1',
    status: 'success',
    description: 'status: success',
    icon: getStatusIcon('success'),
  },
  {
    title: 'Thought Chain Item - 2',
    status: 'error',
    description: 'status: error',
    icon: getStatusIcon('error'),
  },
];

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
};

function addChainItem() {
  mockServerResponseData.push({
    title: `Thought Chain Item - ${mockServerResponseData.length + 1}`,
    status: 'loading',
    icon: getStatusIcon('loading'),
    description: 'status: loading',
  });
}

async function updateChainItem(status: ThoughtChainItem['status']) {
  await delay(800);
  mockServerResponseData[mockServerResponseData.length - 1].status = status;
  mockServerResponseData[mockServerResponseData.length - 1].icon = getStatusIcon(status);
  mockServerResponseData[mockServerResponseData.length - 1].description = `status: ${status}`;
}

const items = ref<ThoughtChainItem[]>(mockServerResponseData);
const loading = ref(false);

const mockStatusChange = async () => {
  await updateChainItem('error');
  items.value = [...mockServerResponseData];
  await updateChainItem('abort');
  items.value = [...mockServerResponseData];
  await updateChainItem('loading');
  items.value = [...mockServerResponseData];
  await updateChainItem('success');
  items.value = [...mockServerResponseData];
};

const onClick = async () => {
  loading.value = true;
  addChainItem();
  items.value = [...mockServerResponseData];
  await mockStatusChange();
  loading.value = false;
};
</script>

<template>
  <Card style="width: 500px">
    <Button :loading="loading" style="margin-bottom: 16px" @click="onClick">
      {{ loading ? 'Running' : 'Run Next' }}
    </Button>
    <ThoughtChain :items="items" />
  </Card>
</template>
