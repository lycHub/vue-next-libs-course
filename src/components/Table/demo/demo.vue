<template>
  <div class="demo-box" style="margin-top: 100px;">
    <a-table select-mode="row" :columns="columns" :data="data" row-key="id" :max-height="300">
      <template #city="{ data }">
        <b style="color: green;">abc--{{ data.city }}</b>
      </template>
    </a-table>
  </div>
</template>

<script lang="tsx">
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
            width: 200,
            // renderHeader({ col, index }) {
            //   return <b>姓名--{ index }</b>;
            // }
          },
          {
            title: 'Age',
            key: 'age',
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
            width: 200,
            slot: 'city'
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
            width: 200,
            fixed: 'right',
            render() {
              return <div>
                <a>启用</a>
                <a style="color: red; margin-left: 8px;">禁用</a>
              </div>
            }
          }
        ]
      }
    }
  });
</script>
