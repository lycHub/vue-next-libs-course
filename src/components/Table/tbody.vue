<template>
  <tbody class="table-body" align="center">
  <tr :class="tableRowCls(index)" v-for="(row, index) of data" :key="row[rowKey]" @click="clickRow($event, index)">
    <cell
      v-for="(col, cIndex) of columns"
      :key="col.title || cIndex"
      :columns="columns"
      :table-style="tableStyle"
      :col-style-with-cls="colStyleWithCls"
      :data="row"
      :col-index="cIndex"
      :index="index" />
  </tr>
  </tbody>
</template>

<script lang="tsx">
  import {defineComponent, PropType} from 'vue';
  import {SelectMode, TableData} from "./types";
  import {commonProps, getClickType} from "./uses";
  import {WrapWithUndefined} from "../utils/types";
  import Cell from './cell.vue';

  export default defineComponent({
    name: 'ATableBody',
    components: { Cell },
    props: {
      ...commonProps,
      data: {
        type: Array as PropType<TableData[]>,
        default: () => []
      },
      rowKey: {
        type: String,
        default: 'id'
      },
      selectMode: String as PropType<WrapWithUndefined<SelectMode>>,
      selectIndexes: {
        type: Array as PropType<number[]>,
        default: () => []
      },
    },
    emits: ['rowClick'],
    setup(props, { emit }) {
      // 问题3：返回值类型？？？？？
      const tableRowCls = (index: number): string => {
        const selected = props.selectIndexes.findIndex(item => item === index) > -1;
        return `table-row ${ selected ? 'selected' : '' }`;
      };
      const clickRow = (event: MouseEvent, index: number) => {
        const clickType = getClickType(event);
        emit('rowClick', { index, clickType });
      }
      return { clickRow, tableRowCls };
    }
  })
</script>
