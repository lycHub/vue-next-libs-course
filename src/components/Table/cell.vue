<template>
  <td class="table-cell" :style="cellStyle(colIndex)">
    <render-cell v-if="column.render" :render-func="column.render" :column="column" :data="data" :index="index" />
    <render-slot v-else-if="column.slot" :column="column" :data="data" :index="index" />
    <span v-else class="cell-text">{{ data[column['key']] }}</span>
  </td>
</template>

<script lang="tsx">
import {computed, defineComponent, PropType} from 'vue';
import RenderCell from './render';
import RenderSlot from './slot';
import {CellStyle, TableData} from "./types";
import {commonProps, getCellStyle} from "./uses";

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
      const column = computed(() => props.columns[props.colIndex]);
      const cellStyle = (index: number): Partial<CellStyle> => {
        return getCellStyle(props.columns, props.tableStyle, props.scrollBoundary, index);
      }
      return { cellStyle, column };
    }
  })
</script>
