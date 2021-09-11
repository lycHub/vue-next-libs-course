import {ColStyle, ColumnOptions} from "./types";
import { sumBy } from 'lodash-es';

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

export { tableRowKey, getColStyle }
