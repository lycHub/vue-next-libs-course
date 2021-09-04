import {PropType} from "vue";
import {
  CellCoordinate,
  ClickType,
  ColumnOptions,
  Coordinate,
  FixTypes,
  TableDataOfSelected,
  TableStyle, ColStyleWithCls, ColStyle
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
  colStyleWithCls: {
    type: Array as PropType<ColStyleWithCls[]>,
    default: () => []
  }
}




function getColStyle(columns: ColumnOptions[], tableStyle: TableStyle, index: number): Partial<ColStyle> {
  const result: Partial<ColStyle> = {};
  const col = columns[index];
  if (tableStyle.width && col.fixed) {
    if (col.fixed === 'right') {
      const sArr = columns.slice(index + 1);
      // console.log('sArr', sArr);
      result.position = 'sticky';
      result.right = sumBy(sArr, 'width') + 'px';
    } else if (col.fixed === 'left') {
      const sArr = columns.slice(0, index);
      // console.log('sArr', sArr);
      result.position = 'sticky';
      result.left = sumBy(sArr, 'width') + 'px';
    }
  }
  return result;
}


function getClickType(event: MouseEvent): ClickType {
  return event.shiftKey ? 'shift' : (event.ctrlKey || event.metaKey) ? 'ctrl' : 'single';
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

export { commonProps, getColStyle, getClickType, getSelectedCellIndex, isInRangeOfCoordinates };
