<template>
  <tbody class="table-body" align="center">
  <tr :class="tableRowCls(index)" v-for="(row, index) of data" :key="row[rowKey]" @click="clickRow($event, index)">
    <cell
      v-for="(col, cIndex) of columns"
      :key="col.title || cIndex"
      :columns="columns"
      :col-style-with-cls="colStyleWithCls"
      :data="row"
      :col-index="cIndex"
      :index="index" />
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
  import Cell from './cell.vue';

  export default defineComponent({
    name: "ATbody",
    components: { RenderCell, RenderSlot, Cell },
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
      colStyleWithCls: {
        type: Array as PropType<Partial<ColStyleWithCls>[]>,
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

