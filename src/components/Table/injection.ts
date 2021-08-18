import {InjectionKey, Ref} from "vue";
import {Slots} from "@vue/runtime-core";
import {TableDataOfSelected} from "./types";

interface TableRootCtx {
  rowKey: string;
  slots: Slots;
  selectedCells: Ref<TableDataOfSelected[]>;
  handleTableCellClick: (cell: TableDataOfSelected, event: MouseEvent) => void;
}

const TableRootKey: InjectionKey<TableRootCtx> = Symbol('Table slots');

export { TableRootKey };
