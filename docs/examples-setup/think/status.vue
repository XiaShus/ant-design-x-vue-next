<script setup lang="ts">
import { BulbOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { h, ref } from 'vue';

defineOptions({ name: 'AXThinkStatusSetup' });

const title = ref('Complete thinking');
const loading = ref(false);

const handleClick = () => {
  loading.value = true;
  title.value = 'deep thinking';

  setTimeout(() => {
    loading.value = false;
    title.value = 'Complete thinking';
  }, 2000);
};

const customLoading = () =>
  loading.value
    ? h(SyncOutlined, { style: { fontSize: '12px', animation: 'spin 1s linear infinite' } })
    : false;
</script>

<template>
  <div>
    <Button @click="handleClick">
      Run
    </Button>
  </div>
  <br>
  <Think
    :title="title"
    blink
    :loading="loading"
  >
    This is deep thinking content.
  </Think>
  <br>
  <Think
    :title="title"
    :loading="customLoading()"
    :icon="h(BulbOutlined)"
  >
    Customize status icon.
  </Think>
  <style>
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  </style>
</template>
