<template>
  <tbody class="table-body" align="center">
  <tr :class="tableRowCls(index)" v-for="(row, index) of data" :key="row[rowKey]" @click="clickRow($event, index)">
    <td
    :class="colStyleWidthCls[cIndex].cls"
     v-for="(col, cIndex) of columns"
     :key="tableRowKey(col, cIndex)"
     :style="colStyleWidthCls[cIndex].style">
      <render-cell v-if="col.render" :render-func="col.render" :column="col" :index="index" :data="row" />
      <render-slot v-else-if="col.slot" :column="col" :data="row" :index="index" />
      <span class="cell-text" v-else>{{ row[col['key']] }}</span>
    </td>
  </tr>
  </tbody>
</template>

<script lang="ts">
  import {defineComponent, PropType, ref} from "vue";
  import {ColStyleWithCls, ColumnOptions, TableData} from "./types";
  import {tableRowKey} from "./helper";
  import { getClickType } from "../utils";
  import RenderCell from "./render";
  import RenderSlot from "./slot";

  export default defineComponent({
    name: "ATbody",
    components: { RenderCell, RenderSlot },
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
      selectIndexes: {
        type: Array as PropType<number[]>,
        default: () => []
      },
    },
    emits: ['rowClick'],
    setup(props, { emit }) {
      const tableRowCls = (index: number): string => {
        const selected = props.selectIndexes.findIndex(item => item === index) > -1;
        return `table-row ${ selected ? 'selected' : '' }`;
      };
      const clickRow = (event: MouseEvent, index: number) => {
        const clickType = getClickType(event);
        emit('rowClick', { index, clickType });
      }
      return {
        tableRowKey,
        clickRow,
        tableRowCls
      }
    }
  });
</script>

