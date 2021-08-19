<template>
  <td :class="cellCls" :style="cellStyle(colIndex)" @click="clickCell">
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
import {commonProps, getCellStyle, getClickType, getSelectedCellIndex, isInRangeOfCoordinates} from "./uses";
import {TableRootKey} from "./injection";

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
    setup(props, { emit }) {
      const tableSlots = inject(TableRootKey)!;
      const column = computed(() => props.columns[props.colIndex]);
      const cellStyle = (index: number): Partial<CellStyle> => {
        return getCellStyle(props.columns, props.tableStyle, props.scrollBoundary, index);
      }
      const selected = ref(false);
      const isStart = ref(false);
      watch(tableSlots.highCells, highCells => {
        console.log('wat tableSlots.highCells', highCells);
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
      return { cellStyle, column, clickCell, cellCls };
    }
  })
</script>
