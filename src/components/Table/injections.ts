import {InjectionKey, Ref} from "vue";
import {Slots} from "@vue/runtime-core";
import {CellCoordinate, SelectMode} from "./types";

interface TableRootCtx {
  rowKey: string;
  selectMode: string;
  slots: Slots;
  highCells: Ref<CellCoordinate[]>;
  handleTableCellClick(cell: CellCoordinate, event: MouseEvent): void;
  handleCellMousedown(cell: CellCoordinate): void;
  handleCellMouseenter(cell: CellCoordinate): void;
  addCellCoordinatesInRange(coordinate: CellCoordinate): void;
}

const TableRootKey: InjectionKey<TableRootCtx> = Symbol('Table inject');

export { TableRootKey };
