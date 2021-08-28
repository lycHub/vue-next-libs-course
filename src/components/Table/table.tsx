import {defineComponent, ref, computed, nextTick, onMounted, PropType, watch, provide, VNode} from 'vue';
import {partition, sum, sumBy} from "lodash-es";
import { VirtualList, VirtualListInst } from 'vueuc';
import ATableHead from './thead.vue';
import ATableBody from './body/tbody.vue';
import VirtualTbody from "./body/virtualTbody.vue";
import {WrapWithUndefined} from "../utils/types";
import {
  CellCoordinate,
  ColumnOptions,
  SelectedRow,
  SelectMode,
  TableData
} from "./types";
import ScrollServe, {IsReachBoundary} from './scroll';
import {TableRootKey} from "./injection";
import {getClickType, getSelectedCellIndex} from "./uses";
import {rowSelectStrategies} from "./select-row-strategies";
import './index.scss';
import Cell from './cell.vue';

interface TableSectionEls {
  head: HTMLElement;
  body: HTMLElement;
  foot: HTMLElement;
}

export default defineComponent({
  name: 'ATable',
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
    virtual: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    selectMode: String as PropType<WrapWithUndefined<SelectMode>>
  },
  setup(props, { slots }) {
    const tableRootHtml = ref<WrapWithUndefined<HTMLElement>>(undefined);
    const virtualListRef = ref<VirtualListInst | null>(null);

    onMounted(() => {
      console.log('mounted', virtualListRef.value);
    });

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
        const head = tableRootHtml.value.querySelector('.sec-header') as WrapWithUndefined<HTMLElement>; // .table-head
        const body = tableRootHtml.value.querySelector('.sec-body .ant-table') as WrapWithUndefined<HTMLElement>;
        return { head, body };
      }
      return {};
    }

    const setSeparateHeight = () => {
      nextTick(() => {
        const { head, body } = bodyHeadDom();
        if (head && body) {
          separateHeight.value = props.virtual || (props.maxHeight > 0 && body.clientHeight - head.clientHeight > props.maxHeight);
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
      // selectedCellCoordinates.value = [];
      // selectedCellCoordinatesInRange.value = [];
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
    const setCols = (): JSX.Element[] => {
      return cols.value.map(item => {
        return <col width={ item } key={ item } />;
      });
    }
    const cellsOfTr = (row: TableData, index: number) => {
      return props.columns.map((col, cIndex) => {
        return <Cell
          key={ col.title || cIndex }
          columns={ props.columns }
          tableStyle={ tableStyle.value }
          scrollBoundary={ scrollBoundary.value }
          data={ row }
          colIndex={ cIndex }
          index={ index }
        />
      })
    }

    const tableRowCls = (index: number): string => {
      const selected = selectedRowIndexes.value.findIndex(item => item === index) > -1;
      return `table-row ${ selected ? 'selected' : '' }`;
    };

    const dataOfTr = () => {
      return tableData.value.map((row, index) => {
        // @ts-ignore
        return <tr class={ tableRowCls(index) } key={ row[props.rowKey] } onClick={
          (event: MouseEvent) => {
            const clickType = getClickType(event);
            handleRowClick({ clickType, index });
          }
        }>
          { cellsOfTr(row, index) }
        </tr>
      })
    }

    const virtualBody = (): JSX.Element => {
      return <VirtualList
        class="ant-table-section sec-body"
        ref={ virtualListRef }
        style={ bodyStyle.value }
        items={ dataOfTr() }
        itemSize={54}
        visibleItemsTag={ VirtualTbody }
        visibleItemsProps={{
          tableStyle: tableStyle.value,
          cols: cols.value
        }}
        onScroll={ handleBodyScroll }>
        {{
          default: ({ item }: { item: VNode }) => {
            return item
          }
        }}
      </VirtualList>
    }

    const normalBody = (): JSX.Element => {
      // @ts-ignore
      return <div class="ant-table-section sec-body" style={ bodyStyle.value }  onScroll={ handleBodyScroll }>
        <table class="ant-table" cellspacing="0" style={ tableStyle.value }>
          <colgroup>
            { setCols() }
          </colgroup>
          <ATableBody
            columns={ props.columns }
            rowKey={ props.rowKey }
            selectMode={ props.selectMode }
            data={ tableData.value }
            tableStyle={ tableStyle.value }
            scrollBoundary={ scrollBoundary.value }
            selectIndexes={ selectedRowIndexes.value }
            onRowClick={ handleRowClick } />
        </table>
      </div>;
    }

    return () => {
      return <div class="ant-table-wrap" ref={ tableRootHtml }>
        <div class="ant-tables">
          <div class="ant-table-section sec-header" style={ hfStyle.value }>
            <table class="ant-table" cellspacing="0" style={ tableStyle.value }>
              <colgroup>
                { setCols() }
              </colgroup>
              <ATableHead columns={ props.columns } tableStyle={ tableStyle.value } scrollBoundary={ scrollBoundary.value } />
            </table>
          </div>
          { props.virtual ? virtualBody() : normalBody() }
        </div>
      </div>
    }
  }
});