<template>
  <td
    ref="rootHtml"
    :class="cellCls"
    :style="cellStyle(colIndex)"
    @click="clickCell"
    @mousedown="mousedownCell"
    @mouseenter="mouseenterCell">
    <render-cell v-if="column.render" :render-func="column.render" :column="column" :data="data" :index="index" />
    <render-slot v-else-if="column.slot" :column="column" :data="data" :index="index" />
    <span v-else class="cell-text">{{ data[column['key']] }}</span>
  </td>
</template>

<script lang="tsx">
import {computed, defineComponent, inject, PropType, ref, watch} from 'vue';
import RenderCell from './render';
import RenderSlot from './slot';
import {CellStyle, TableData} from "./types";
import {
  commonProps,
  getCellStyle,
  getSelectedCellIndex,
  isInRangeOfCoordinates
} from "./uses";
import {TableRootKey} from "./injection";
import {WrapWithUndefined} from "../utils/types";

  export default defineComponent({
    name: 'ATableCell',
    components: { RenderCell, RenderSlot },
    props: {
      ...commonProps,
      data: {
        type: Object as PropType<TableData>,
        default: () => ({})
      },
      colIndex: {
        type: Number,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
    },
    setup(props) {
      const tableSlots = inject(TableRootKey)!;
      const column = computed(() => props.columns[props.colIndex]);
      const cellStyle = (index: number): Partial<CellStyle> => {
        return getCellStyle(props.columns, props.tableStyle, props.scrollBoundary, index);
      }
      const selected = ref(false);
      const isStart = ref(false);
      watch(tableSlots.highCells, highCells => {
        // console.log('wat tableSlots.highCells', highCells);
        const targetIndex = getSelectedCellIndex(highCells, props.index, props.colIndex);
        const startCell = highCells.find(item => item.isStart);
        const endCell = highCells.find(item => item.isEnd);
        // console.log('一直触发？？', startCell, endCell);
        selected.value = targetIndex > -1;
        isStart.value = !!(startCell && getSelectedCellIndex([startCell], props.index, props.colIndex) > -1);
        if (!selected.value && startCell && endCell) {
          // console.log(props.index, props.colIndex);
          const selected = isInRangeOfCoordinates([startCell, endCell], { x: props.index, y: props.colIndex });
          if (selected) {
            tableSlots.addCellCoordinatesInRange({ x: props.index, y: props.colIndex, inRange: true });
          }
        }
      });

      const rootHtml = ref<WrapWithUndefined<HTMLTableDataCellElement>>();

      const cellCls = computed(() => {
        let result = 'table-cell';
        if (selected.value) {
          result += ' selected';
        }
        if (isStart.value) {
          result += ' is-start';
        }
        return result;
      });
      const clickCell = (event: MouseEvent) => {
        tableSlots.handleTableCellClick({ x: props.index, y: props.colIndex }, event);
      }
      const mousedownCell = () => {
        if (tableSlots.selectMode === 'cell') {
          isStart.value = true;
          tableSlots.handleCellMousedown({ x: props.index, y: props.colIndex });
        }
      }
      const mouseenterCell = () => {
        if (tableSlots.selectMode === 'cell') {
          tableSlots.handleCellMouseenter({ x: props.index, y: props.colIndex });
        }
      }
      return { cellStyle, column, clickCell, mousedownCell, mouseenterCell, cellCls, rootHtml };
    }
  })
</script>
