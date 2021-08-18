import {InjectionKey} from "vue";
import {Slots} from "@vue/runtime-core";

type FixTypes = 'left' | 'right';
type SelectMode = 'row' | 'cell';
type TableData = Record<string, any>;

type TableRenderFuncParams = {
  col: ColumnOptions;
  index: number;
  data: TableData;
};
type TableRenderFunc = (data: TableRenderFuncParams) => JSX.Element;
interface ColumnOptions {
  title: string;
  key: string;
  slot: string;
  fixed: FixTypes;
  width: number;
  minWidth: number;
  maxWidth: number;
  renderHeader: TableRenderFunc;
  render: TableRenderFunc;
}

interface TableStyle {
  width?: string;
}

interface CellStyle {
  position: string;
  left: string;
  right: string;
  boxShadow: string;
}

type ClickType = 'single' | 'ctrl' | 'shift';

interface SelectedRow {
  index: number;
  clickType: ClickType;
}

const TableRootKey: InjectionKey<Slots> = Symbol('Table slots');

export { TableRootKey, SelectedRow, ClickType, ColumnOptions, TableData, TableStyle, CellStyle, TableRenderFunc, TableRenderFuncParams, FixTypes, SelectMode };
