<template>
  <tbody class="table-body" align="center">
  <tr class="table-row" v-for="(row, index) of data" :key="row[rowKey]">
    <td class="table-cell" v-for="(col, cIndex) of columns" :key="col.title || cIndex" :style="cellStyle(cIndex)">
      <render-cell v-if="col.render" :render-func="col.render" :column="col" :data="row" :index="index" />
<!--      <table-slot v-else-if="col.slot" :row="row" :column="col" :index="index" />-->
      <span v-else class="cell-text">{{ row[col['key']] }}</span>
    </td>
  </tr>
  </tbody>
</template>

<script lang="tsx">
import {defineComponent, ref, computed, PropType} from 'vue';
import RenderCell from './render';
import {CellStyle, ColumnOptions, TableData, TableStyle} from "./types";
import {sumBy} from "lodash-es";
import {commonProps, getCellStyle} from "./uses";

  export default defineComponent({
    name: 'ATable',
    components: { RenderCell },
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
        return getCellStyle(props.columns, props.tableStyle, index);
      }
      return { cellStyle };
    }
  })
</script>
