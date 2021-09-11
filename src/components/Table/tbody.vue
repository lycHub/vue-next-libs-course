<template>
  <tbody class="table-body" align="center">
  <tr class="table-row" v-for="(row, index) of data" :key="row[rowKey]">
    <td
    :class="colStyleWidthCls[cIndex].cls"
     v-for="(col, cIndex) of columns"
     :key="tableRowKey(col, cIndex)"
     :style="colStyleWidthCls[cIndex].style">
      <span class="cell-text">{{ row[col['key']] }}</span>
    </td>
  </tr>
  </tbody>
</template>

<script lang="ts">
  import {defineComponent, PropType, ref} from "vue";
  import {ColStyleWithCls, ColumnOptions, TableData} from "./types";
  import {tableRowKey} from "./helper";

  export default defineComponent({
    name: "ATbody",
    props: {
      columns: {
        type: Array as PropType<ColumnOptions[]>,
        default: () => []
      },
      data: {
        type: Array as PropType<TableData[]>,
        default: () => []
      },
      rowKey: {
        type: String,
        required: true
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

