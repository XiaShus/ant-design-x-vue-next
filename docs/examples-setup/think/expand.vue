<script setup lang="ts">
import { Button } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXThinkExpandSetup' });

const value = ref(true);
</script>

<template>
  <div>
    <Button @click="value = !value">
      Change expand
    </Button>
  </div>
  <br>
  <Think
    title="deep thinking"
    :expanded="value"
    @expand="(next) => (value = next)"
  >
    This is deep thinking content.
  </Think>
</template>
