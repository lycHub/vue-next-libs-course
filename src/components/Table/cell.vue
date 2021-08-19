<template>
  <td :class="cellCls" :style="cellStyle(colIndex)" @click="clickCell">
    <render-cell v-if="column.render" :render-func="column.render" :column="column" :data="data" :index="index" />
    <render-slot v-else-if="column.slot" :column="column" :data="data" :index="index" />
    <span v-else class="cell-text">{{ data[column['key']] }}</span>
  </td>
</template>

<script lang="tsx">
import {computed, defineComponent, inject, PropType} from 'vue';
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

      const cellCls = computed(() => {
        const selectedCellCoordinates = tableSlots.selectedCellCoordinates.value;
        let base = 'table-cell';
        const targetIndex = getSelectedCellIndex(selectedCellCoordinates, props.index, props.colIndex);
        if (targetIndex > -1) {
          return `${base} ${ targetIndex > -1 ? 'selected' : '' }`;
        } else {
          const startCell = selectedCellCoordinates.find(item => item.isStart);
          const endCell = selectedCellCoordinates.find(item => item.isEnd);
          if (startCell && endCell) {
            // console.log('startCell, endCell', startCell, endCell);
            const selected = isInRangeOfCoordinates([startCell, endCell], { x: props.index, y: props.colIndex });
            if (selected) {
              return `${base} selected`;
            }
          }
          return base;
        }
      });
      const clickCell = (event: MouseEvent) => {
        tableSlots.handleTableCellClick({ x: props.index, y: props.colIndex }, event);
      }
      return { cellStyle, column, clickCell, cellCls };
    }
  })
</script>
