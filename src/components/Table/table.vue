<template>
  <div :class="rootCls" ref="tableRootHtml">
    <div class="ant-tables">
      <div class="ant-table-section sec-head" :style="hfStyle" v-if="separateHeight">
        <table class="ant-table" cellspacing="0" :style="{ width: tableWidth + 'px' }">
          <colgroup>
            <col v-for="(col, index) of columns" :key="tableRowKey(col, index)" :width="col.width" />
          </colgroup>
          <a-thead :col-style-width-cls="colStyleWidthCls" :columns="columns" />
        </table>
      </div>


      <div class="ant-table-section sec-body" :style="bodyStyle" @scroll="handleBodyScroll">
        <table class="ant-table" cellspacing="0" :style="{ width: tableWidth + 'px' }">
         <colgroup>
            <col v-for="(col, index) of columns" :key="tableRowKey(col, index)" :width="col.width" />
          </colgroup>
          <a-thead :columns="columns" :col-style-width-cls="colStyleWidthCls" v-if="!separateHeight" />
          <a-tbody :columns="columns" :col-style-width-cls="colStyleWidthCls" :data="tableData" :row-key="rowKey" />
        </table>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, PropType, ref, watch } from 'vue';
  import { ColStyleWithCls, ColumnOptions, TableData, TableSectionEls } from './types';
  import AThead from './thead.vue';
  import ATbody from './tbody.vue';
  import { findIndex, findLastIndex, partition, sumBy } from 'lodash-es';
  import { getColStyle, tableRowKey } from './helper';
  import ScrollServe, {IsReachBoundary} from './scroll';

  const baseCls = 'ant-table-wrap';
  const scrollBaseCls = 'scroll-position-';

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
      maxHeight: {
        type: Number,
        default: 0
      },
    },
    setup(props) {
      const tableData = ref<TableData[]>([]);
      const tableRootHtml = ref<HTMLElement | undefined>();
      const separateHeight = ref(false);
      const tableWidth = ref(0);

      const bodyHeadDom = (): Partial<TableSectionEls> => {
        if (tableRootHtml.value instanceof HTMLElement) {
          const head = <HTMLElement>tableRootHtml.value.querySelector('.table-head') || undefined; // .table-head
          const body = <HTMLElement>tableRootHtml.value.querySelector('.sec-body .ant-table') || undefined;
          return { head, body };
        }
        return {};
      }

      const setSeparateHeight = () => {
        const { head, body } = bodyHeadDom();
          if (head && body) {
            // 可能需要再减去横向滚动条的高度
            separateHeight.value = props.maxHeight > 0 && body.clientHeight - head.clientHeight > props.maxHeight;
            console.log('separateHeight', separateHeight.value);
          }
      }

      // 设置每一列的宽度，计算table总宽度
      const setColumnsWidth = () => {
        const { head, body } = bodyHeadDom();
        if (head && body) {
          const containerWidth = body.clientWidth;
          const [hasWidthColumns, noWidthColumns] = partition(props.columns, 'width');
          const colCountWidth = sumBy(hasWidthColumns, 'width');
          const restWidth = Math.max(0, containerWidth - colCountWidth);
          const restAverageWidth = restWidth / (noWidthColumns.length || 1);
          props.columns.forEach(col => {
            let width = col.width || 0;
            if (typeof col.width !== 'number') {
              width = restAverageWidth;
              if (col.minWidth) {
                width = Math.max(col.minWidth, width);
              }
              if (col.maxWidth) {
                width = Math.min(col.maxWidth, width);
              }
            }
            col.width = width;
          });
          tableWidth.value = sumBy(props.columns, 'width');
        }
      }

      const rootCls = ref(`${baseCls} ${scrollBaseCls + 'left'}`);

      // 横向滚动条是否到[左, 右]边界
      const scrollBoundary = ref<IsReachBoundary>([true, false]);

      const updateScrollBoundary = (state: IsReachBoundary) => {
      for (let a = 0; a < state.length; a++) {
        if (state[a] !== scrollBoundary.value[a]) {
          scrollBoundary.value = state;
          const boundary = state[0] ? 'left' : state[1] ? 'right' : 'middle';
          rootCls.value = `${baseCls} ${scrollBaseCls + boundary}`;
          break;
        }
      }
    }

      const handleBodyScroll = (event: Event) => {
        const target = event.target as HTMLElement;
        const direction = ScrollServe.getDirection(target);
        if (direction === 'horizontal') {
          const headSec = tableRootHtml.value?.querySelector('.sec-head') as HTMLElement;
          updateScrollBoundary(ScrollServe.hasReachBoundary(target, direction));
          if (headSec) {
            ScrollServe.setScroll(headSec, target.scrollLeft, false);
          }
        }
      }

      const hfStyle = computed(() => {
        const result: {
          overflow: string;
        } = { overflow: 'hidden ' };
        if (separateHeight.value) {
          result.overflow += 'scroll';
        }
        return result;
      });
      const bodyStyle = computed(() => {
        const result: {
          overflow: string;
          maxHeight?: string;
        } = { overflow: 'auto' };
        if (separateHeight.value) {
          result.maxHeight = props.maxHeight + 'px';
        }
        return result;
      });

      const colStyleWidthCls = computed<Partial<ColStyleWithCls>[]>(() => {
        const base = 'table-cell';
        const leftEdgeFixedIndex = findLastIndex(props.columns, { fixed: 'left' });
        const rightEdgeFixedIndex = findIndex(props.columns, { fixed: 'right' });
        return props.columns.map((col, index) => {
          let style = {};
          let cls = base;
          if (col.fixed) {
            cls += ' fixed';
            style = getColStyle(props.columns, index, tableWidth.value);
            if (index === leftEdgeFixedIndex || index === rightEdgeFixedIndex) {
              cls += ' fixed-' + col.fixed;
            }
          }
          return { style, cls }
        })
      });


      const init = async () => {
        tableData.value = props.data;
        await nextTick();
        setSeparateHeight();
        setColumnsWidth();
      }
      onMounted(() => {
        init();
      });
      watch(() => props.data, () => {
        init();
      });
      return {
        tableData,
        bodyStyle,
        hfStyle,
        separateHeight,
        tableWidth,
        tableRootHtml,
        tableRowKey,
        handleBodyScroll,
        colStyleWidthCls,
        rootCls,
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
        &.sec-head::-webkit-scrollbar, &.sec-foot::-webkit-scrollbar {
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

