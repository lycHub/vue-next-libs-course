import { CSSProperties } from '@vue/runtime-dom';
import { PositionProperty } from 'csstype';
import { ClickType } from '../utils/types';

type ScrollDirection = 'horizontal' | 'vertical';
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
  width: number;
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

interface SelectedRow {
  index: number;
  clickType: ClickType;
}

interface TableSectionEls {
  head: HTMLElement;
  body: HTMLElement;
  foot: HTMLElement;
}

export { ScrollDirection, TableDataOfSelected, TableSectionEls, ScrollPosition, Coordinate, CellCoordinate, SelectedRow, ColumnOptions, TableData, TableStyle, ColStyle, ColStyleWithCls, TableRenderFunc, TableRenderFuncParams, FixTypes, SelectMode };
