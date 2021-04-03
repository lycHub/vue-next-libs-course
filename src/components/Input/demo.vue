<template>
  <div class="demo-box">
    <p>text: {{ text }}</p>
    <a-input v-model="text" placeholder="请输入xxx" />
  </div>
</template>

<script lang="tsx">
  import {defineComponent, ref} from 'vue';
  export default defineComponent({
    name: "InputDemo",
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
