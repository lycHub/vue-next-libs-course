import {InjectionKey, Ref} from "vue";
import {Slots} from "@vue/runtime-core";
import {CellCoordinate} from "./types";

interface TableRootCtx {
  rowKey: string;
  slots: Slots;
  selectedCellCoordinates: Ref<CellCoordinate[]>;
  handleTableCellClick: (cell: CellCoordinate, event: MouseEvent) => void;
}

const TableRootKey: InjectionKey<TableRootCtx> = Symbol('Table slots');

export { TableRootKey };
