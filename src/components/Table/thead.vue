<template>
  <thead class="table-head">
  <tr class="table-row">
    <th class="table-cell" v-for="(item, index) of columns" :key="item.title || index" :style="cellStyle(item, index)">
      <render-cell v-if="item.renderHeader" :render-func="item.renderHeader" :column="item" :index="index" />
      <span v-else class="cell-text">{{ item.title }}</span>
    </th>
  </tr>
  </thead>
</template>

<script lang="tsx">
import {defineComponent, ref, computed, PropType} from 'vue';
import RenderCell from './render';
import {CellStyle, ColumnOptions, TableStyle} from "./types";
import {sumBy} from "lodash-es";

  export default defineComponent({
    name: 'ATable',
    components: { RenderCell },
    props: {
      columns: {
        type: Array as PropType<ColumnOptions[]>,
        default: () => []
      },
      tableStyle: {
        // 类型问题：默认值没约束
        type: Object as PropType<TableStyle>,
        default: () => ({})
      },
      // scrollBoundary: Array
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
