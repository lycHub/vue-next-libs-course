<template>
  <thead class="table-head">
  <tr class="table-row">
    <th
    :class="colStyleWidthCls[index].cls"
    v-for="(col, index) of columns"
    :key="tableRowKey(col, index)"
    :style="colStyleWidthCls[index].style">
      <span class="cell-text">{{ col.title }}</span>
    </th>
  </tr>
  </thead>
</template>

<script lang="ts">
  import {defineComponent, PropType, ref} from "vue";
  import {ColStyleWithCls, ColumnOptions} from "./types";
  import {tableRowKey} from "./helper";

  export default defineComponent({
    name: "AThead",
    props: {
      columns: {
        type: Array as PropType<ColumnOptions[]>,
        default: () => []
      },
      colStyleWidthCls: {
        type: Object as PropType<Partial<ColStyleWithCls>[]>,
        default: () => []
      },
    },
    setup() {
      return {
        tableRowKey
      }
    }
  });
</script>

