<template>
  <div class="ant-table-wrap" ref="tableRootHtml">
    <div class="ant-tables">
      <div class="ant-table-section sec-header" :style="hfStyle">
        <table class="ant-table" cellSpacing="0" :style="tableStyle">
          <colgroup>
            <col v-for="item of cols" :width="item" />
          </colgroup>
          <table-header :columns="columns" :tableStyle="tableStyle" :scrollBoundary="scrollBoundary" />
        </table>
      </div>

      <div class="ant-table-section sec-body" :style="bodyStyle" @scroll="handleBodyScroll">
        <table class="ant-table" cellSpacing="0" :style="tableStyle">
          <colgroup>
            <col v-for="item of cols" :width="item" />
          </colgroup>
          <!-- :scrollBoundary="scrollBoundary"  -->
          <table-body :columns="columns" :data="tableData" :tableStyle="tableStyle" :row-key="rowKey" :scrollBoundary="scrollBoundary" />
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, nextTick, onMounted, PropType, watch, InjectionKey, provide} from 'vue';
import {partition, sum, sumBy} from "lodash-es";
import TableHeader from './thead.vue';
import TableBody from './tbody.vue';
import {WrapWithUndefined} from "../utils/types";
import {ColumnOptions, TableData, TableRootKey} from "./types";
import ScrollServe, {IsReachBoundary} from './scroll';
import {Slots} from "@vue/runtime-core";

interface TableSectionEls {
  head: HTMLElement;
  body: HTMLElement;
  foot: HTMLElement;
}

export default defineComponent({
  name: 'ATable',
  components: { TableHeader, TableBody },
  props: {
    columns: {
      type: Array as PropType<ColumnOptions[]>,
      default: () => []
    },
    data: {
      type: Array as PropType<TableData[]>,
      default: () => []
    },
    maxHeight: {
      type: Number,
      default: 0
    },
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  setup(props, { emit, slots }) {
    provide(TableRootKey, slots);
    const tableRootHtml = ref<WrapWithUndefined<HTMLElement>>(undefined);
    const separateHeight = ref(false);
    const colTotalWidth = ref(0);
    const tableData = ref<TableData[]>([]);

    // 横向滚动条是否到[左, 右]边界
    const scrollBoundary = ref<IsReachBoundary>([true, false]);

    const bodyHeadDom = (): Partial<TableSectionEls> => {
      if (tableRootHtml.value instanceof HTMLElement) {
        const head = <HTMLElement>tableRootHtml.value.querySelector('.sec-header') || undefined; // .table-head
        const body = <HTMLElement>tableRootHtml.value.querySelector('.sec-body .ant-table') || undefined;
        return { head, body };
      }
      return {};
    }

    const setSeparateHeight = () => {
      nextTick(() => {
        const { head, body } = bodyHeadDom();
        if (head && body) {
          // console.log('head body', head, body);
          separateHeight.value = props.maxHeight > 0 && body.clientHeight - head.clientHeight > props.maxHeight;
        }
      });
    }

    const init = () => {
      tableData.value = props.data || [];
      setSeparateHeight();
    }


    const hfStyle = computed(() => { // 这里本是方法
      const result = { overflow: 'hidden ' };
      if (separateHeight.value) {
        result.overflow += 'scroll';
      }
      return result;
    });

    const bodyStyle = computed(() => { // 这里本是方法
      const result: { overflow: string; maxHeight?: string; } = { overflow: 'auto' };
      if (separateHeight.value) {
        const { head } = bodyHeadDom();
        result.maxHeight = props.maxHeight - (head?.clientHeight || 0) + 'px';
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
            let width: number | 'auto' = item.width || 'auto';
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

    const handleBodyScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const direction = ScrollServe.getDirection(target);
      if (direction === 'horizontal') {
        const { head } = bodyHeadDom();
        scrollBoundary.value = ScrollServe.hasReachBoundary(target, 'horizontal');
        if (head) {
          // console.log('head', head);
          ScrollServe.setScroll(head, target.scrollLeft, false);
        }
        // ScrollServe.setScroll(this.$refs.tableFooter, target.scrollLeft, false);
      }
    }

    init();

    watch(() => props.data, newVal => {
      init();
    });


    onMounted(() => {
      console.log('tableRootHtml', tableRootHtml.value);
    });
    return {
      hfStyle,
      bodyStyle,
      tableStyle,
      tableRootHtml,
      cols,
      tableData,
      handleBodyScroll,
      scrollBoundary,
    }
  }
});
</script>
<style lang="scss">
  .#{$ant-pre}table-wrap {
    background-color: $white-color;
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
            }
          }
        }
      }
    }
  }
</style>
