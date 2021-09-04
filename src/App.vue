<template>
  <div class="app">
    <div class="app-container">
      <table-demo />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TableDemo from './components/Table/demo.vue';
export default defineComponent({
  name: 'App',
  components: {
    TableDemo
  }
});
</script>
<style lang="scss">
  .app-container {
    width: 1000px;
    margin: 0 auto;
  }
</style>
