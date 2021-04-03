<template>
  <div class="demo-box">
    <a-tabs v-model="currentTabName">
      <a-tab-pane name="TabOne">
        <template #title="name">
          <b style="color: #5fff3f;">custom1-{{ name }}</b>
        </template>
        Content 1
      </a-tab-pane>
      <a-tab-pane name="TabTwo">Content 2</a-tab-pane>
      <a-tab-pane name="TabThree">
        <template #title="name">
          <b style="color: #ff3d23;">custom3-{{ name }}</b>
        </template>
        Content 3
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="tsx">
  import {defineComponent, ref} from 'vue';
  export default defineComponent({
    name: "TabsDemo",
    setup(props, {emit}) {
      const currentTabName = ref('');
      return {
        currentTabName
      }
    }
  });
</script>

<style scoped lang="scss">

</style>
