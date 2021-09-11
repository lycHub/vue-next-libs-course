<template>
  <div class="demo-box" style="margin-top: 100px;">
    <a-table select-mode="row" :columns="columns" :data="data" row-key="id" :max-height="300" />
  </div>
</template>

<script lang="ts">
  import {defineComponent, onMounted, ref} from 'vue';
  import { TableData } from '../types';
  import { genTableData } from './mock';

  export default defineComponent({
    name: "TableDemo",
    setup() {
      const data = ref<TableData[]>([]);
      onMounted(() => {
        data.value = genTableData();
      });
      return {
        data,
        columns: [
          {
            title: 'Name',
            key: 'name',
            width: 200
          },
          {
            title: 'Age',
            key: 'age',
            slot: 'age',
            width: 100
          },
          {
            title: 'Province',
            key: 'province',
            width: 200
          },
          {
            title: 'City',
            key: 'city',
            width: 200
          },
          {
            title: 'Address',
            key: 'address',
            minWidth: 180
          },
          {
            title: 'Postcode',
            key: 'zip',
            width: 200
          },
          {
            title: 'Action',
            key: 'action',
            width: 200
          }
        ]
      }
    }
  });
</script>
