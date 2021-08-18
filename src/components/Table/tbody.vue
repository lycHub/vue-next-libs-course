<template>
  <tbody class="table-body" align="center">
  <tr :class="tableRowCls(index)" v-for="(row, index) of data" :key="row[rowKey]" @click="clickRow($event, index)">
    <td class="table-cell" v-for="(col, cIndex) of columns" :key="col.title || cIndex" :style="cellStyle(cIndex)">
      <render-cell v-if="col.render" :render-func="col.render" :column="col" :data="row" :index="index" />
      <render-slot v-else-if="col.slot" :column="col" :data="row" :index="index" />
      <span v-else class="cell-text">{{ row[col['key']] }}</span>
    </td>
  </tr>
  </tbody>
</template>

<script lang="tsx">
import {computed, defineComponent, PropType} from 'vue';
  import RenderCell from './render';
  import RenderSlot from './slot';
  import {CellStyle, SelectMode, TableData} from "./types";
  import {commonProps, getCellStyle, getClickType} from "./uses";
  import {WrapWithUndefined} from "../utils/types";

  export default defineComponent({
    name: 'ATable',
    components: { RenderCell, RenderSlot },
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
      const cellStyle = (index: number): Partial<CellStyle> => {
        return getCellStyle(props.columns, props.tableStyle, props.scrollBoundary, index);
      }
      const clickRow = (event: MouseEvent, index: number) => {
        const clickType = getClickType(event);
        // console.log('index', index, clickType);
        emit('rowClick', { index, clickType });
      }
      return { cellStyle, clickRow, tableRowCls };
    }
  })
</script>
