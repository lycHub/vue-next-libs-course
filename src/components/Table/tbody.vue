<template>
  <tbody class="table-body" align="center">
  <tr class="table-row" v-for="(row, index) of data" :key="row[rowKey]">
    <td class="table-cell" v-for="(col, cIndex) of columns" :key="col.title || cIndex" :style="cellStyle(cIndex)">
      <render-cell v-if="col.render" :render-func="col.render" :column="col" :data="row" :index="index" />
      <render-slot v-else-if="col.slot" :column="col" :data="row" :index="index" />
      <span v-else class="cell-text">{{ row[col['key']] }}</span>
    </td>
  </tr>
  </tbody>
</template>

<script lang="tsx">
  import {defineComponent, PropType} from 'vue';
  import RenderCell from './render';
  import RenderSlot from './slot';
  import {CellStyle, TableData} from "./types";
  import {commonProps, getCellStyle} from "./uses";

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
      }
    },
    setup(props, { emit }) {
      const cellStyle = (index: number): Partial<CellStyle> => {
        return getCellStyle(props.columns, props.tableStyle, props.scrollBoundary, index);
      }
      return { cellStyle };
    }
  })
</script>
