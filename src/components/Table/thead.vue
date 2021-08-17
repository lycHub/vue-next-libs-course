<template>
  <thead class="table-head">
  <tr class="table-row">
    <th class="table-cell" v-for="(item, index) of columns" :key="item.title || index" :style="cellStyle(index)">
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
import {commonProps, getCellStyle} from "./uses";

  export default defineComponent({
    name: 'ATable',
    components: { RenderCell },
    props: commonProps,
    setup(props, { emit }) {
      const cellStyle = (index: number): Partial<CellStyle> => {
        return getCellStyle(props.columns, props.tableStyle, index);
      }
      return { cellStyle };
    }
  })
</script>
