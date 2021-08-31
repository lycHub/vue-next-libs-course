<template>
  <div :class="rootCls" ref="tableRootHtml">
    <div class="ant-tables">
      <div class="ant-table-section sec-header" :style="hfStyle">
        <table class="ant-table" cellSpacing="0" :style="tableStyle">
          <colgroup>
            <col v-for="item of cols" :width="item" />
          </colgroup>
          <a-table-head :columns="columns" :tableStyle="tableStyle" :colStyleWithCls="colStyleWithCls" />
        </table>
      </div>

      <div class="ant-table-section sec-body" :style="bodyStyle"  @scroll="handleBodyScroll">
        <table class="ant-table" cellSpacing="0" :style="tableStyle">
          <colgroup>
            <col v-for="item of cols" :width="item" />
          </colgroup>
          <a-table-body
            :columns="columns"
            :data="tableData"
            :tableStyle="tableStyle"
            :colStyleWithCls="colStyleWithCls"
            :row-key="rowKey"
            :select-mode="selectMode"
            :select-indexes="selectedRowIndexes"
            @rowClick="handleRowClick"/>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, nextTick, PropType, watch, provide} from 'vue';
import {findIndex, findLastIndex, partition, sum, sumBy} from "lodash-es";
import ATableHead from './thead.vue';
import ATableBody from './tbody.vue';
import {WrapWithUndefined} from "../utils/types";
import {
  CellCoordinate, ColStyleWithCls,
  ColumnOptions, Coordinate,
  SelectedRow,
  SelectMode,
  TableData
} from "./types";
import ScrollServe, {IsReachBoundary} from './scroll';
import {TableRootKey} from "./injection";
import {getColStyle, getClickType, getSelectedCellIndex} from "./uses";
import {rowSelectStrategies} from "./select-row-strategies";

interface TableSectionEls {
  head: HTMLElement;
  body: HTMLElement;
  foot: HTMLElement;
}

const baseCls = 'ant-table-wrap';
const scrollBaseCls = 'scroll-position-';

export default defineComponent({
  name: 'ATable',
  components: { ATableHead, ATableBody },
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
    },
    selectMode: String as PropType<WrapWithUndefined<SelectMode>>
  },
  setup(props, { slots }) {
    const tableRootHtml = ref<WrapWithUndefined<HTMLElement>>(undefined);
    const separateHeight = ref(false);
    const colTotalWidth = ref(0);
    const tableData = ref<TableData[]>([]);

    // 横向滚动条是否到[左, 右]边界
    const scrollBoundary = ref<IsReachBoundary>([true, false]);

    // 保存选中的行
    const selectedRowIndexes = ref<number[]>([]);

    // 保存选中单元格的坐标
    const selectedCellCoordinates = ref<CellCoordinate[]>([]);

    // 保存范围内被选中的单元格坐标
    const selectedCellCoordinatesInRange = ref<CellCoordinate[]>([]);

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


    const hfStyle = computed(() => { // 这里本是方法
      const result = { overflow: 'hidden ' };
      if (separateHeight.value) {
        result.overflow += 'scroll';
      }
      return result;
    });

    const moving = ref(false);
    const bodyStyle = computed(() => { // 这里本是方法
      const result: {
        overflow: string;
        cursor: string;
        userSelect: string;
        maxHeight?: string;
      } = { overflow: 'auto', cursor: 'auto', userSelect: 'auto' };
      if (separateHeight.value) {
        const { head } = bodyHeadDom();
        result.maxHeight = props.maxHeight - (head?.clientHeight || 0) + 'px';
      }
      if (props.selectMode) {
        result.cursor = 'pointer';
      }
      if (moving.value) {
        result.userSelect = 'none';
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
        const trueWidth = body.clientWidth;
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

    const rootCls = ref(`${baseCls} ${scrollBaseCls + 'left'}`);
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

    const colStyleWithCls = computed<Partial<ColStyleWithCls>[]>(() => {
      const base = 'table-cell';
      const leftEdgeFixedIndex = findLastIndex(props.columns, { fixed: 'left' });
      const rightEdgeFixedIndex = findIndex(props.columns, { fixed: 'right' });
      return props.columns.map((col, index) => {
        let style = {};
        let cls = base;
        if (col.fixed) {
          style = getColStyle(props.columns, tableStyle.value, index);
          cls += ' fixed';
          if (index === leftEdgeFixedIndex || index === rightEdgeFixedIndex) {
            cls += ' fixed-' + col.fixed
          }
        }
        return { style, cls };
      });
    });
    const handleBodyScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const direction = ScrollServe.getDirection(target);
      if (direction === 'horizontal') {
        const { head } = bodyHeadDom();
        updateScrollBoundary(ScrollServe.hasReachBoundary(target, direction));
        if (head) {
          ScrollServe.setScroll(head, target.scrollLeft, false);
        }
        // ScrollServe.setScroll(this.$refs.tableFooter, target.scrollLeft, false);
      }
    }

    const handleRowClick = (row: SelectedRow) => {
      if (props.selectMode !== 'row') return;
      const targetIndexOfSelectedRowIndexes = selectedRowIndexes.value.findIndex(item => item === row.index);
      selectedRowIndexes.value = rowSelectStrategies[row.clickType](row, selectedRowIndexes.value, targetIndexOfSelectedRowIndexes);
      // console.log('selectedRowIndexes', selectedRowIndexes.value);
    }

    const addCellCoordinatesInRange = (coordinate: CellCoordinate) => {
      selectedCellCoordinatesInRange.value.push(coordinate);
      // console.log('selectedCellCoordinatesInRange', selectedCellCoordinatesInRange.value);
    }

    const handleTableCellClick = (coordinate: CellCoordinate, event: MouseEvent) => {
      // debugger;
      if (props.selectMode !== 'cell' || moving.value) return;
      event.stopPropagation();
      const clickType = getClickType(event);
      const targetIndexOfSelectedCells = getSelectedCellIndex(selectedCellCoordinates.value, coordinate.x, coordinate.y);
      const targetIndexOfSelectedInRangeCells = getSelectedCellIndex(selectedCellCoordinatesInRange.value, coordinate.x, coordinate.y);
      const startCell = selectedCellCoordinates.value.find(item => item.isStart) || selectedCellCoordinatesInRange.value.find(item => item.isStart);
      const endCellIndex = selectedCellCoordinates.value.findIndex(item => item.isEnd);

      switch (clickType) {
        case 'ctrl':
          if (selectedCellCoordinates.value.length || selectedCellCoordinatesInRange.value.length) {
            if (startCell) {
              Reflect.deleteProperty(startCell, 'isStart');
            }
            if (endCellIndex > -1) {
              Reflect.deleteProperty(selectedCellCoordinates.value[endCellIndex], 'isEnd');
            }
            if (selectedCellCoordinates.value[targetIndexOfSelectedCells]?.inRange) {
              selectedCellCoordinates.value[targetIndexOfSelectedCells].isStart = true;
              selectedCellCoordinates.value = selectedCellCoordinates.value.slice();
            } else if (selectedCellCoordinatesInRange.value[targetIndexOfSelectedInRangeCells]?.inRange) {
              selectedCellCoordinatesInRange.value[targetIndexOfSelectedInRangeCells].isStart = true;
              selectedCellCoordinatesInRange.value = selectedCellCoordinatesInRange.value.slice();
            } else {
              selectedCellCoordinates.value.push(coordinate);
            }
          } else {
            selectedCellCoordinates.value = [coordinate];
          }
          break;
        case 'shift':
          if (selectedCellCoordinates.value.length) {
            // 把所有inRange清空但起点要保留，不然无法生成新的范围
            selectedCellCoordinatesInRange.value = selectedCellCoordinatesInRange.value.filter(item => item.isStart);
            selectedCellCoordinates.value = selectedCellCoordinates.value.filter(item => !item.inRange || item.isStart);
            if (!startCell) {
              selectedCellCoordinates.value[selectedCellCoordinates.value.length - 1].isStart = true;
              selectedCellCoordinates.value[selectedCellCoordinates.value.length - 1].inRange = true;
              selectedCellCoordinates.value = selectedCellCoordinates.value.slice();
            }
            if (endCellIndex > -1) {
              // todo: inRange ？？
              // Reflect.deleteProperty(selectedCellCoordinates.value[endCellIndex], 'isEnd');
              selectedCellCoordinates.value.splice(endCellIndex, 1);
            }
            if (targetIndexOfSelectedCells > -1) {
              // 直接改.isEnd  不会触发响应式
              selectedCellCoordinates.value[targetIndexOfSelectedCells] = { ...coordinate, isEnd: true, inRange: true };
            } else {
              selectedCellCoordinates.value.push({ ...coordinate, isEnd: true, inRange: true });
            }
            getSelection()!.removeAllRanges();
          } else {
            selectedCellCoordinates.value = [coordinate];
          }
          break;
        default:
          selectedCellCoordinatesInRange.value = [];
          if (selectedCellCoordinates.value.length === 1 && targetIndexOfSelectedCells === 0) {
            selectedCellCoordinates.value = [];
          } else {
            selectedCellCoordinates.value = [coordinate];
          }
          break;
      }
      // console.log('selectedCellCoordinates', selectedCellCoordinates);
    }
    const mousedownStartCoordinate = ref<WrapWithUndefined<CellCoordinate>>();

    const handleCellMouseenter = (coordinate: CellCoordinate) => {
      if (moving.value) {
        if (mousedownStartCoordinate.value && coordinate) {
          selectedCellCoordinatesInRange.value = [];
          // selectedCellCoordinates.value = selectedCellCoordinates.value.filter(item => item.isStart);
          selectedCellCoordinates.value = [];
          selectedCellCoordinates.value = [{ ...mousedownStartCoordinate.value, isStart: true, inRange: true }];
          const endCellIndex = selectedCellCoordinates.value.findIndex(item => item.isEnd);
          if (endCellIndex > -1) {
            selectedCellCoordinates.value.splice(endCellIndex, 1);
          }
          selectedCellCoordinates.value.push({ ...coordinate, isEnd: true, inRange: true });
        }
      }
    }

    const handleMouseup = () => {
      moving.value = false;
      mousedownStartCoordinate.value = undefined;
    }


    const handleCellMousedown = (coordinate: CellCoordinate) => {
      moving.value = true;
      mousedownStartCoordinate.value = coordinate;
      addEventListener('mouseup', handleMouseup);
    }

    provide(TableRootKey, {
      rowKey: props.rowKey,
      selectMode: props.selectMode,
      slots,
      highCells: computed(() => selectedCellCoordinates.value.concat(selectedCellCoordinatesInRange.value)),
      handleTableCellClick,
      handleCellMousedown,
      handleCellMouseenter,
      addCellCoordinatesInRange,
    });

    const init = () => {
      tableData.value = props.data || [];
      selectedRowIndexes.value = [];
      setSeparateHeight();
    }
    init();
    watch(() => props.data, () => {
      init();
    });
    return {
      rootCls,
      colStyleWithCls,
      hfStyle,
      bodyStyle,
      tableStyle,
      tableRootHtml,
      moving,
      cols,
      tableData,
      handleMouseup,
      handleBodyScroll,
      handleRowClick,
      selectedRowIndexes,
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
              transition: box-shadow .2s ease-in-out;
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
