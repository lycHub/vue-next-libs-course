import {ColumnOptions} from "./types";

function tableRowKey(col: ColumnOptions, index: number): string | number {
  return col.key || col.title || index;
}

export { tableRowKey }
