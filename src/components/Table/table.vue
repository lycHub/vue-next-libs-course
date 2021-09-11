<template>
  <div :class="rootCls" ref="tableRootHtml">
    <div class="ant-tables">
      <div class="ant-table-section sec-head" :style="hfStyle" v-if="separateHeight">
        <table class="ant-table" cellspacing="0" :style="{ width: tableWidth + 'px' }">
          <colgroup>
            <col v-for="(col, index) of columns" :key="tableRowKey(col, index)" :width="col.width" />
          </colgroup>
          <a-thead :col-style-with-cls="colStyleWithCls" :columns="columns" />
        </table>
      </div>


      <div class="ant-table-section sec-body" :style="bodyStyle" @scroll="handleBodyScroll">
        <table class="ant-table" cellspacing="0" :style="{ width: tableWidth + 'px' }">
         <colgroup>
            <col v-for="(col, index) of columns" :key="tableRowKey(col, index)" :width="col.width" />
          </colgroup>
          <a-thead :columns="columns" :col-style-with-cls="colStyleWithCls" v-if="!separateHeight" />
          <a-tbody
          :columns="columns"
          :col-style-with-cls="colStyleWithCls"
          :data="tableData"
          :row-key="rowKey"
          :select-indexes="selectedRowIndexes"
          @row-click="handleRowClick"/>
        </table>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, CSSProperties, defineComponent, nextTick, onMounted, PropType, provide, ref, watch } from 'vue';
  import { CellCoordinate, ColStyleWithCls, ColumnOptions, SelectedRow, SelectMode, TableData, TableSectionEls, UserSelectProperty } from './types';
  import AThead from './thead.vue';
  import ATbody from './tbody.vue';
  import { findIndex, findLastIndex, partition, sumBy } from 'lodash-es';
  import { getColStyle, getSelectedCellIndex, tableRowKey } from './helper';
  import ScrollServe, {IsReachBoundary} from './scroll';
  import SelectRowStrategies from './select-row-strategies';
  import { TableRootKey } from './injections';
  import { getClickType } from '../utils';

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
      selectMode: {
        type: String,
        validaor: (value: string) => {
          return value ? ['row', 'cell'].find(item => item === value) : true;
        },
        default: ''
      }
    },
    setup(props, { slots }) {
      const tableData = ref<TableData[]>([]);
      const tableRootHtml = ref<HTMLElement>();
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
      const bodyStyle = computed<CSSProperties>(() => {
        const result: {
          overflow: string;
          cursor: string;
          userSelect: UserSelectProperty;
          maxHeight?: string;
        } = { overflow: 'auto', cursor: 'auto', userSelect: 'auto' };
        if (separateHeight.value) {
          result.maxHeight = props.maxHeight + 'px';
        }
        if (props.selectMode) {
          result.cursor = 'pointer';
        }
        if (moving.value) {
          result.userSelect = 'none';
        }
        return result;
      });

      const colStyleWithCls = computed<Partial<ColStyleWithCls>[]>(() => {
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
      const selectedRowIndexes = ref<number[]>([]);
      const handleRowClick = (row: SelectedRow) => {
        if (props.selectMode === 'row') {
          SelectRowStrategies[row.clickType](row, selectedRowIndexes);
        }
      }

      // 保存选中单元格的坐标(起点和终点)
      const selectedCellCoordinates = ref<CellCoordinate[]>([]);

      // 保存起点和重点范围内，被选中的单元格坐标
      const selectedCellCoordinatesInRange = ref<CellCoordinate[]>([]);


    const addCellCoordinatesInRange = (coordinate: CellCoordinate) => {
      selectedCellCoordinatesInRange.value.push(coordinate);
    }

    const handleTableCellClick = (coordinate: CellCoordinate, event: MouseEvent) => {
      if (props.selectMode !== 'cell' || moving.value) return;
      event.stopPropagation();
      const clickType = getClickType(event);
      const targetIndexOfSelectedCells = getSelectedCellIndex(selectedCellCoordinates.value, coordinate.x, coordinate.y);
    
      const targetIndexOfSelectedInRangeCells = getSelectedCellIndex(selectedCellCoordinatesInRange.value, coordinate.x, coordinate.y);
      
      const startCellIndex = selectedCellCoordinates.value.findIndex(item => item.isStart) ?? selectedCellCoordinatesInRange.value.findIndex(item => item.isStart);
      const startCell = selectedCellCoordinates.value[startCellIndex] || selectedCellCoordinatesInRange.value[startCellIndex];
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
            if (!startCell && selectedCellCoordinates.value.length) {
              selectedCellCoordinates.value[selectedCellCoordinates.value.length - 1].isStart = true;
              selectedCellCoordinates.value[selectedCellCoordinates.value.length - 1].inRange = true;
              selectedCellCoordinates.value = selectedCellCoordinates.value.slice();
            }
            if (endCellIndex > -1) {
              selectedCellCoordinates.value.splice(endCellIndex, 1);
            }
            
            if (targetIndexOfSelectedCells > -1 && targetIndexOfSelectedCells !== startCellIndex) {
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
    const mousedownStartCoordinate = ref<CellCoordinate>();
    const moving = ref(false);
    const handleCellMouseenter = (coordinate: CellCoordinate) => {
      if (moving.value) {
        if (mousedownStartCoordinate.value && coordinate) {
          selectedCellCoordinatesInRange.value = [];
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
      return {
        tableData,
        bodyStyle,
        hfStyle,
        separateHeight,
        tableWidth,
        tableRootHtml,
        tableRowKey,
        handleBodyScroll,
        colStyleWithCls,
        rootCls,
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

