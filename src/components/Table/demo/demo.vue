<template>
  <div class="demo-box">
    <a-table :columns="columns" :data="data" row-key="id" />
  </div>
</template>

<script lang="ts">
  import {defineComponent, onMounted, ref} from 'vue';
  import { TableData } from '';
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
            width: 200,
            fixed: 'left'
          },
          {
            title: 'Age',
            key: 'age',
            slot: 'age',
            width: 200,
            fixed: 'left'
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
            width: 200
          },
          {
            title: 'Postcode',
            key: 'zip',
            width: 200,
            fixed: 'right',
          },
          {
            title: 'Action',
            key: 'action',
            width: 200,
            fixed: 'right',
          }
        ]
      }
    }
  });
</script>
