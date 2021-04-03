<template>
  <div class="app">
    <div class="app-container">
      <input-demo />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputDemo from './components/Input/demo.vue';
export default defineComponent({
  name: 'App',
  components: {
    InputDemo
  }
});
</script>
<style lang="scss">
  .app-container {
    width: 1000px;
    margin: 0 auto;
  }
</style>
