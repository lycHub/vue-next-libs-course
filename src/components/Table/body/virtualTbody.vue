<template>
  <table class="ant-table" cellspacing="0" :style="tableStyle">
    <colgroup>
      <col v-for="item of cols" :width="item" />
    </colgroup>
    <tbody class="table-body" align="center"><slot /></tbody>
  </table>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {TableStyle} from "../types";

export default defineComponent({
  name: 'virtualTbody',
  props: {
    tableStyle: {
      type: Object as PropType<TableStyle>,
      default: () => ({})
    },
    cols: {
      type: Array as PropType<number[]>,
      default: () => []
    }
  },
});
</script>

<style scoped>

</style>