<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue';
import { h, ref } from 'vue';
import { Sender } from 'ant-design-x-vue';

defineOptions({ name: 'AXSenderSwitchSetup' });

const value = ref(false);
const searchIcon = () => h(SearchOutlined);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; align-items: center; gap: 8px">
      Default:
      <Sender.Switch :icon="searchIcon()">
        Deep Search
      </Sender.Switch>
    </div>
    <div style="display: flex; align-items: center; gap: 8px">
      Controlled:
      <Sender.Switch
        :icon="searchIcon()"
        :value="value"
        @change="(v) => (value = v)"
      >
        Deep Search
      </Sender.Switch>
    </div>
  </div>
</template>
