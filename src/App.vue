<template>
  <div class="app-container">
    app
    <span class="text">text</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
  
  }
});
</script>
<style lang="scss">
  .text {
    color: $primary-color;
  }
</style>
