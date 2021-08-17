type RenderTableHeader = (col: ColumnOptions, index: number) => JSX.Element;
interface ColumnOptions {
  title: string;
  key: string;
  slot: string;
  fixed: boolean;
  width: number;
  minWidth: number;
  maxWidth: number;
  renderHeader: RenderTableHeader;
  render: () => JSX.Element;
}

type TableData = Record<string, any>;

interface TableStyle {
  width?: string;
}

interface CellStyle {
  position: string;
  right: string;
  boxShadow: string;
}

export { ColumnOptions, TableData, TableStyle, CellStyle, RenderTableHeader };
