<template>
  <thead class="table-head">
  <tr class="table-row">
    <th
    :class="colStyleWidthCls[index].cls"
    v-for="(col, index) of columns"
    :key="tableRowKey(col, index)"
    :style="colStyleWidthCls[index].style">
      <render-cell v-if="col.renderHeader" :render-func="col.renderHeader" :column="col" :index="index" />
      <span class="cell-text" v-else>{{ col.title }}</span>
    </th>
  </tr>
  </thead>
</template>

<script lang="ts">
  import {defineComponent, PropType, ref} from "vue";
  import {ColStyleWithCls, ColumnOptions} from "./types";
  import {tableRowKey} from "./helper";
  import RenderCell from './render';

  export default defineComponent({
    name: "AThead",
    components: { RenderCell },
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

