<template>
  <div class="app">
    <div class="app-container">
      <form-demo />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormDemo from './components/Form/demo.vue';
export default defineComponent({
  name: 'App',
  components: {
    FormDemo
  }
});
</script>
<style lang="scss">
  .app-container {
    width: 1000px;
    margin: 0 auto;
  }
</style>
