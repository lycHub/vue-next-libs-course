import {computed, PropType} from "vue";
import {CellStyle, ColumnOptions, TableStyle} from "./types";
import {sumBy} from "lodash-es";

const commonProps = {
  columns: {
    type: Array as PropType<ColumnOptions[]>,
    default: () => []
  },
  tableStyle: {
    // 类型问题：默认值没约束
    type: Object as PropType<TableStyle>,
    default: () => ({})
  },
  // scrollBoundary: Array
}




function getCellStyle(columns: ColumnOptions[], tableStyle: TableStyle, index: number): Partial<CellStyle> {
  const result: Partial<CellStyle> = {};
  const col = columns[index];
  const firstFixedIndex = computed(() => columns.findIndex(item => item.fixed));
  const setBoxShadow = (colIndex: number): string => {
    // return !this.scrollBoundary[1] && colIndex === this.firstFixedIndex ? '-2px 0 6px -2px rgba(0,0,0,.2)' : 'none';
    return 'none';
  }
  if (col.fixed && tableStyle.width) {
    const sArr = columns.slice(index + 1);
    result.position = 'sticky';
    result.right = sumBy(sArr, 'width') + 'px'; // 暂时只考虑右边
    // result.borderRight = '1px solid #dedfe1';
    result.boxShadow = setBoxShadow(index);
  }
  return result;
}

export { commonProps, getCellStyle };
