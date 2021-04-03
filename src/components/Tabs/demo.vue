<template>
  <div class="demo-box">
    <a-tabs>
      <a-tab-panel name="TabOne">Content 1</a-tab-panel>
      <a-tab-panel name="TabTwo">Content 2</a-tab-panel>
      <a-tab-panel name="TabThree">Content 3</a-tab-panel>
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
