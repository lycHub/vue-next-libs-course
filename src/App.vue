<template>
  <div class="app">
    <div class="app-container">
      <table-demo />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TableDemo from './components/Table/demos/index.vue';
</script>
<style lang="scss">
  .app-container {
    width: 1000px;
    margin: 30px auto;
  }
</style>
