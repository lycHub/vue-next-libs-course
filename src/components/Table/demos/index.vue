<template>
  <div class="demo-box">
<!--    <p>类型问题：全局组件的属性没提示</p>-->
    <button @click="changeTableData">change table data</button>
    <a-table :columns="columns" :data="data" :max-height="300">
      <template v-slot:age="{ data }">
        <b>{{ data.age }}岁</b>
      </template>
    </a-table>
  </div>
</template>

<script lang="tsx">
import {defineComponent, ref} from 'vue';
import {ColumnOptions, TableData, TableRenderFuncParams} from "../types";
import {genTableData} from "./mock";
  export default defineComponent({
    name: "TableDemo",
    setup() {
      const data = ref<TableData[]>(genTableData(3));
      const changeTableData = () => {
        data.value = genTableData(10);
      }
      const look = (data: string) => {
        console.log('look', data);
      }
      return {
        data,
        changeTableData,
        columns: [
          {
            title: 'Name',
            key: 'name',
            width: 200
          },
          {
            title: 'Age',
            slot: 'age',
            width: 200
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
            width: 200
          },
          {
            title: 'Action',
            width: 120,
            render: ({ data }: TableRenderFuncParams) => {
              // console.log('data', data);
              return <div class="table-acts">
                <a onClick={ look.bind(null, data.name) }>查看</a>
                <a>编辑</a>
              </div>
            }
          }
        ]
      }
    }
  });
</script>
