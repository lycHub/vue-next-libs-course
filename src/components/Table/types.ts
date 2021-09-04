import { CSSProperties } from '@vue/runtime-dom';
import { PositionProperty } from 'csstype';

export type UserSelectProperty = "-moz-none" | "all" | "auto" | "contain" | "element" | "none" | "text";


type ColWidth = number | 'auto';
type FixTypes = 'left' | 'right';
type SelectMode = 'row' | 'cell';
type ScrollPosition = 'left' | 'middle' | 'right';
type TableData = Record<string, any>;
type Coordinate = { x: number; y: number; };
type CellCoordinate = Coordinate & Partial<{ isStart: boolean; isEnd: boolean; inRange: boolean; }>;

type TableDataOfSelected = TableData & CellCoordinate;

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
  width: ColWidth;
  minWidth: number;
  maxWidth: number;
  renderHeader: TableRenderFunc;
  render: TableRenderFunc;
}

interface TableStyle {
  width?: string;
}

interface ColStyle extends CSSProperties {
  position: PositionProperty;
  left: string;
  right: string;
  boxShadow: string;
}

interface ColStyleWithCls extends CSSProperties {
  style: Partial<ColStyle>;
  cls: string;
}

type ClickType = 'single' | 'ctrl' | 'shift';

interface SelectedRow {
  index: number;
  clickType: ClickType;
}

export { TableDataOfSelected, ColWidth, ScrollPosition, Coordinate, CellCoordinate, SelectedRow, ClickType, ColumnOptions, TableData, TableStyle, ColStyle, ColStyleWithCls, TableRenderFunc, TableRenderFuncParams, FixTypes, SelectMode };
