<template>
  <div class="ant-table-wrap">
    <div class="ant-tables">
      <div class="ant-table-section sec-header">
        <table class="ant-table" cellspacing="0">
         <!-- <colgroup>
            <col width="300" />
            <col width="100" />
            <col width="300" />
          </colgroup>-->
          <a-thead :columns="columns" />
        </table>
      </div>


       <div class="ant-table-section sec-body">
        <table class="ant-table" cellspacing="0">
         <!-- <colgroup>
            <col width="300" />
            <col width="100" />
            <col width="300" />
          </colgroup>-->
          <a-tbody :columns="columns" :data="tableData" :row-key="rowKey" />
        </table>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import { ColumnOptions, TableData } from './types';
  import AThead from './thead.vue';
  import ATbody from './tbody.vue';
  export default defineComponent({
    name: "ATable",
    components: { AThead, ATbody },
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
        required: true
      },
    },
    setup(props) {
      const tableData = ref<TableData[]>([]);
      const init = () => {
        tableData.value = props.data;
      }
      onMounted(() => {
        init();
      });
      watch(() => props.data, () => {
        init();
      });
      return {
        tableData
      }
    }
  });
</script>

<style lang="scss">
  .#{$ant-pre}table-wrap {
    .#{$ant-pre}tables {
      overflow-x: auto;
      border: {
        left: 1px solid $border-color;
        top: 1px solid $border-color;
      }
      .#{$ant-pre}table-section {
        position: relative;
        &.sec-header::-webkit-scrollbar, &.sec-footer::-webkit-scrollbar {
          background-color: transparent;
          border-right: 1px solid $border-color;
        }
        .#{$ant-pre}table {
          width: 100%;
          min-width: 100%;
          table-layout: fixed;
          .table-row {
            background-color: $white-color;
            transition: background-color .2s ease-in-out;
            &:hover {
              background-color: $bg-prev-color;
            }
            .table-cell {
              padding: 2px 18px;
              height: 48px;
              border: {
                bottom: 1px solid $border-color;
                right: 1px solid $border-color;
              }
              background-color: inherit;
              transition: background-color .2s ease-in-out;
            }
            .table-cell.fixed {
              position: sticky;
              transition: box-shadow .2s ease-in-out, background-color .2s ease-in-out;
              &.fixed-left {
                box-shadow: 2px 0 6px -2px rgba(0,0,0,.2);
              }
              &.fixed-right {
                box-shadow: -2px 0 6px -2px rgba(0,0,0,.2);
              }
            }
            .table-cell.selected {
              background-color: $assist-color;
            }
            .table-cell.is-start {
              background-color: unset;
              border: 1px solid $assist-color;
            }
          }
          .table-row.selected {
            background-color: $assist-color;
          }
        }
      }
    }
  }
  
  .#{$ant-pre}table-wrap {
    &.scroll-position-left .table-cell.fixed-left {
      box-shadow: none!important;
    }
    &.scroll-position-right .table-cell.fixed-right {
      box-shadow: none!important;
    }
  }
</style>

