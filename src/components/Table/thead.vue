<template>
  <thead class="table-head">
  <tr class="table-row">
    <th class="table-cell" v-for="(col, index) of columns" :key="tableRowKey(col, index)">
      <span class="cell-text">{{ col.title }}</span>
    </th>
  </tr>
  </thead>
</template>

<script lang="ts">
  import {defineComponent, PropType, ref} from "vue";
  import {ColumnOptions} from "./types";
  import {tableRowKey} from "./helper";

  export default defineComponent({
    name: "AThead",
    props: {
      columns: {
        type: Array as PropType<ColumnOptions[]>,
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

