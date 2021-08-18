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
import {defineComponent} from 'vue';
import RenderCell from './render';
import {CellStyle} from "./types";
import {commonProps, getCellStyle} from "./uses";

  export default defineComponent({
    name: 'ATableHead',
    components: { RenderCell },
    props: commonProps,
    setup(props, { emit }) {
      const cellStyle = (index: number): Partial<CellStyle> => {
        return getCellStyle(props.columns, props.tableStyle, props.scrollBoundary, index);
      }
      return { cellStyle };
    }
  })
</script>
