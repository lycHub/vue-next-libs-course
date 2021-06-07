<template>
  <div class="app">
    <div class="app-container">
      <tree-demo />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TreeDemo from './components/Tree/demo.vue';
export default defineComponent({
  name: 'App',
  components: {
    TreeDemo
  }
});
</script>
<style lang="scss">
  .app-container {
    width: 1000px;
    margin: 0 auto;
  }
</style>
