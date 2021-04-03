<template>
  <div class="app">
    <div class="app-container">
      <tabs-demo />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabsDemo from './components/Tabs/demo.vue';
export default defineComponent({
  name: 'App',
  components: {
    TabsDemo
  }
});
</script>
<style lang="scss">
  .app-container {
    width: 1000px;
    margin: 0 auto;
  }
</style>
