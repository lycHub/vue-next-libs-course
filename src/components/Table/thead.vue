<template>
  <thead class="table-head">
  <tr class="table-row">
    <th :class="colStyleWithCls[index].cls" v-for="(item, index) of columns" :key="item.title || index" :style="colStyleWithCls[index].style">
      <render-cell v-if="item.renderHeader" :render-func="item.renderHeader" :column="item" :index="index" />
      <span v-else class="cell-text">{{ item.title }}</span>
    </th>
  </tr>
  </thead>
</template>

<script lang="tsx">
import {defineComponent} from 'vue';
import RenderCell from './render';
import {commonProps} from "./uses";

  export default defineComponent({
    name: 'ATableHead',
    components: { RenderCell },
    props: commonProps
  })
</script>
