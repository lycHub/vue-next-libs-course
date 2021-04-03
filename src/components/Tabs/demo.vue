<template>
  <div class="demo-box">
    <a-tabs>
      <a-tab-pane name="TabOne">Content 1</a-tab-pane>
      <a-tab-pane name="TabTwo">Content 2</a-tab-pane>
      <a-tab-pane name="TabThree">Content 3</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="tsx">
  import {defineComponent, ref} from 'vue';
  export default defineComponent({
    name: "TabsDemo",
    setup(props, {emit}) {
      const text = ref('');
      return {
        text
      }
    }
  });
</script>

<style scoped lang="scss">

</style>
