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
  fixed: 'left' | 'right';
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
  right: string;
  boxShadow: string;
}

export { ColumnOptions, TableData, TableStyle, CellStyle, TableRenderFunc, TableRenderFuncParams };
