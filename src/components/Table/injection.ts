import {InjectionKey, Ref} from "vue";
import {Slots} from "@vue/runtime-core";
import {CellCoordinate, Coordinate} from "./types";
import {WrapWithUndefined} from "../utils/types";

interface TableRootCtx {
  rowKey: string;
  slots: Slots;
  highCells: Ref<CellCoordinate[]>;
  handleTableCellClick(cell: CellCoordinate, event: MouseEvent): void;
  handleCellMousedown(cell: CellCoordinate): void;
  handleCellMouseenter(cell: CellCoordinate): void;
  addCellCoordinatesInRange(coordinate: CellCoordinate): void;
}

const TableRootKey: InjectionKey<TableRootCtx> = Symbol('Table slots');

export { TableRootKey };
