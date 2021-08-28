import {computed, PropType} from "vue";
import {
  CellCoordinate,
  CellStyle,
  ClickType,
  ColumnOptions,
  Coordinate,
  FixTypes,
  TableDataOfSelected,
  TableStyle
} from "./types";
import {findIndex, findLastIndex, orderBy, sumBy} from "lodash-es";
import {IsReachBoundary} from "./scroll";
import {WrapWithUndefined} from "../utils/types";

const commonProps = {
  columns: {
    type: Array as PropType<ColumnOptions[]>,
    default: () => []
  },
  tableStyle: {
    // 类型问题：默认值没约束
    type: Object as PropType<TableStyle>,
    default: () => ({})
  },
  scrollBoundary: {
    type: Array as unknown as PropType<IsReachBoundary>,
    default: () => [true, false]
  }
}




function getCellStyle(columns: ColumnOptions[], tableStyle: TableStyle, scrollBoundary: IsReachBoundary, index: number): Partial<CellStyle> {
  console.log('getSc');
  const result: Partial<CellStyle> = {};
  const col = columns[index];
  const setBoxShadow = (colIndex: number, fixed: FixTypes): string => { // 暂时只考虑右边
    const boundary = fixed === 'left' ? scrollBoundary[0] : scrollBoundary[1];
    const indexFunc = fixed === 'left' ? findLastIndex : findIndex;
    const boxShadowXY = fixed === 'left' ? '2px 0 ' : '-2px 0 ';
    const edgeFixedIndex = indexFunc(columns, { fixed });

    // console.log('colIndex firstFixedIndex', colIndex, edgeFixedIndex);
    return !boundary && colIndex === edgeFixedIndex ? boxShadowXY +'6px -2px rgb(0 0 0 / 20%)' : 'none';
  }

  if (tableStyle.width) {
    if (col.fixed === 'right') {
      const sArr = columns.slice(index + 1);
      // console.log('sArr', sArr);
      result.position = 'sticky';
      result.right = sumBy(sArr, 'width') + 'px';
      result.boxShadow = setBoxShadow(index, col.fixed);
    } else if (col.fixed === 'left') {
      const sArr = columns.slice(0, index);
      // console.log('sArr', sArr);
      result.position = 'sticky';
      result.left = sumBy(sArr, 'width') + 'px';
      result.boxShadow = setBoxShadow(index, col.fixed);
    }
  }
  return result;
}


function getClickType(event: MouseEvent): ClickType {
  return event.shiftKey ? 'shift' : event.ctrlKey ? 'ctrl' : 'single';
}

function getSelectedCellIndex(selectedCells: TableDataOfSelected[], x: number, y: number): number {
  return selectedCells.findIndex(item => item.x === x && item.y === y);
}

function isInRangeOfCoordinates(range: [CellCoordinate, CellCoordinate], target: CellCoordinate): boolean {
  // const isBoundary = getSelectedCellIndex(range, target.x, target.y) > -1;
  const rowRange = orderBy([range[0].x, range[1].x]);
  const colRange = orderBy([range[0].y, range[1].y]);
  return (target.x >= rowRange[0] && target.x <= rowRange[1]) && (target.y >= colRange[0] && target.y <= colRange[1]);
}

function isInRangeOfMouseCoordinate(mouseCoordinate: Coordinate, cellCoordinate: Coordinate): boolean {
  return mouseCoordinate.x > cellCoordinate.x && mouseCoordinate.y > cellCoordinate.y;
}

export { commonProps, getCellStyle, getClickType, getSelectedCellIndex, isInRangeOfCoordinates, isInRangeOfMouseCoordinate };
