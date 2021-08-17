<template>
  <tbody class="table-body" align="center">
  <tr class="table-row" v-for="(row, index) of data" :key="row[rowKey]">
    <td class="table-cell" v-for="(col, cIndex) of columns" :key="col.title || cIndex" :style="cellStyle(col, cIndex)">
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

  export default defineComponent({
    name: 'ATable',
    components: { RenderCell },
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
        default: 'id'
      },
      tableStyle: {
        type: Object as PropType<TableStyle>,
        default: () => ({})
      }
    },
    setup(props, { emit }) {
      const firstFixedIndex = computed(() => props.columns.findIndex(item => item.fixed));
      const setBoxShadow = (colIndex: number): string => {
        // return !this.scrollBoundary[1] && colIndex === this.firstFixedIndex ? '-2px 0 6px -2px rgba(0,0,0,.2)' : 'none';
        return 'none';
      }

      const cellStyle = (col: ColumnOptions, colIndex: number): Partial<CellStyle> => {
        const result: Partial<CellStyle> = {};
        if (col.fixed && props.tableStyle.width) {
          const sArr = props.columns.slice(colIndex + 1);
          result.position = 'sticky';
          result.right = sumBy(sArr, 'width') + 'px'; // 暂时只考虑右边
          // result.borderRight = '1px solid #dedfe1';
          result.boxShadow = setBoxShadow(colIndex);
        }
        return result;
      }
      return { firstFixedIndex, cellStyle };
    }
  })
</script>
