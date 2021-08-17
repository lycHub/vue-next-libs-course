<template>
  <div class="ant-table-wrap" ref="tableRootHtml">
    <div class="ant-tables">
      <div class="ant-table-section header" :style="hfStyle" ref="tableHeader">
        <table class="ant-table" cellSpacing="0" :style="tableStyle">
          <colgroup>
            <col v-for="item of cols" :width="item" />
          </colgroup>
          <!-- :scrollBoundary="scrollBoundary"  -->
          <table-header :columns="columns" :tableStyle="tableStyle" />
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, nextTick, onMounted, PropType} from 'vue';
import TableHeader from './thead.vue';
import {WrapWithUndefined} from "../utils/types";
import {ColumnOptions, TableData} from "./types";
import {sum} from "lodash-es";

  export default defineComponent({
    name: 'ATable',
    components: { TableHeader },
    props: {
      columns: {
        type: Array as PropType<ColumnOptions[]>,
        default: () => []
      },
      data: {
        type: Array as PropType<TableData[]>,
        default: () => []
      },
    },
    setup(props, { emit }) {
      const tableRootHtml = ref<WrapWithUndefined<HTMLElement>>(undefined);
      const tableBodyHtml = ref<WrapWithUndefined<HTMLElement>>(undefined);
      const separateHeight = ref(false);
      const colTotalWidth = ref(0);
      const hfStyle = computed(() => { // 这里本是方法
        const result = { overflow: 'hidden ' };
        if (separateHeight.value) {
          result.overflow += 'auto'; // 本来是scroll
        }
        return result;
      });
      const tableStyle = computed(() => { // 这里本是方法
        if (!tableRootHtml.value) return {};
        if (colTotalWidth.value > tableRootHtml.value.clientWidth) {
          return {
            width: colTotalWidth.value + 'px'
          }
        }
        return {};
      });
      const bodyHeadDom = () => {
        const head = tableRootHtml.value?.querySelector('.table-head');
        const body = tableBodyHtml.value?.querySelector('.ant-table');
        return { head, body };
      }
      const cols = computed(() => {
        let widths = props.columns.map(item => item.width || 'auto');
        const { head, body } = bodyHeadDom();
        // console.log('render head body', head, body);
        if (head && body) {
          // debugger;
          const trueWidth = body.clientWidth;
          console.log('trueWidth', trueWidth);
          const [hasWidthColumns, noWidthColumns] = partition(props.columns, 'width');
          const colCountWidth = sumBy(hasWidthColumns, 'width');
          const restWidth = trueWidth - colCountWidth;
          const restAverageWidth = restWidth / (noWidthColumns.length || 1);
          if (restWidth > 0) {
            widths = props.columns.map(item => {
              let width = item.width || 'auto';
              if (width === 'auto') {
                // width = Math.min(Math.max((item.minWidth || 0), restAverageWidth), item.maxWidth || 0)
                width = restAverageWidth;
                if (item.minWidth) {
                  width = Math.max(item.minWidth, width);
                }
                if (item.maxWidth) {
                  width = Math.min(item.maxWidth, width);
                }
              }
              return width;
            });
          }
        }
        colTotalWidth.value = sum(widths.filter(item => typeof item === 'number'));
        return props.columns.map((item, index) => widths[index]);
      });
      onMounted(() => {
        console.log('tableRootHtml', tableRootHtml.value);
      });
      return {
        hfStyle,
        tableStyle,
        tableRootHtml,
        tableBodyHtml,
        cols,
      }
    }
  })
</script>
<style lang="scss" scoped>
  .#{$ant-pre}table-wrap {
    .#{$ant-pre}tables {
      overflow-x: auto;
      .#{$ant-pre}table-section {
        position: relative;
        /*&.header::-webkit-scrollbar, &.footer::-webkit-scrollbar {
          background-color: transparent;
        }*/
        .#{$ant-pre}table {
          width: 100%;
          min-width: 100%;
          border: 1px solid $border-color;
          //border-bottom: none;
          table-layout: fixed;
          .table-row {
            &:hover .table-cell {
              background-color: $bg-prev-color;
            }
            .table-cell {
              padding: 2px 18px;
              height: 48px;
              background-color: $white-color;
              border-bottom: 1px solid $border-color;
              transition: background-color .2s ease-in-out;
            }
          }
        }
      }
    }
  }
</style>
