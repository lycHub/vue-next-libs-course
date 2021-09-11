import {CellCoordinate, ColStyle, ColumnOptions, TableDataOfSelected} from "./types";
import { orderBy, sumBy } from 'lodash-es';

function tableRowKey(col: ColumnOptions, index: number): string | number {
  return col.key || col.title || index;
}

function getColStyle(columns: ColumnOptions[], index: number, tableWidth: number): Partial<ColStyle> {
  const result: Partial<ColStyle> = {};
  const col = columns[index];
  if (tableWidth && col.fixed) {
    if (col.fixed === 'right') {
      const sArr = columns.slice(index + 1);
      result.right = sumBy(sArr, 'width') + 'px';
    } else if (col.fixed === 'left') {
      const sArr = columns.slice(0, index);
      result.left = sumBy(sArr, 'width') + 'px';
    }
  }
  return result;
}

function getSelectedCellIndex(selectedCells: TableDataOfSelected[], x: number, y: number): number {
  return selectedCells.findIndex(item => item.x === x && item.y === y);
}

function isInRangeOfCoordinates(range: [CellCoordinate, CellCoordinate], target: CellCoordinate): boolean {
  const rowRange = orderBy([range[0].x, range[1].x]);
  const colRange = orderBy([range[0].y, range[1].y]);
  return (target.x >= rowRange[0] && target.x <= rowRange[1]) && (target.y >= colRange[0] && target.y <= colRange[1]);
}

export { tableRowKey, getColStyle, getSelectedCellIndex, isInRangeOfCoordinates }
