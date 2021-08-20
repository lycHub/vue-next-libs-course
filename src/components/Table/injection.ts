import {InjectionKey, Ref} from "vue";
import {Slots} from "@vue/runtime-core";
import {CellCoordinate, Coordinate} from "./types";
import {WrapWithUndefined} from "../utils/types";

interface TableRootCtx {
  rowKey: string;
  slots: Slots;
  highCells: Ref<CellCoordinate[]>;
  mouseCoordinate: Ref<WrapWithUndefined<Coordinate>>;
  handleTableCellClick(cell: CellCoordinate, event: MouseEvent): void;
  handleCellMousedown(cell: CellCoordinate, event: MouseEvent): void;
  addCellCoordinatesInRange(coordinate: CellCoordinate): void
  moveInRange(coordinate: CellCoordinate): void
}

const TableRootKey: InjectionKey<TableRootCtx> = Symbol('Table slots');

export { TableRootKey };
