<template>
  <tbody class="table-body" align="center">
  <tr class="table-row" v-for="(row, index) of data" :key="row[rowKey]">
    <td class="table-cell" v-for="(col, cIndex) of columns" :key="tableRowKey(col, cIndex)">
      <span class="cell-text">{{ row[col['key']] }}</span>
    </td>
  </tr>
  </tbody>
</template>

<script lang="ts">
  import {defineComponent, PropType, ref} from "vue";
  import {ColumnOptions, TableData} from "./types";
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
    },
    setup() {
      return {
        tableRowKey
      }
    }
  });
</script>

