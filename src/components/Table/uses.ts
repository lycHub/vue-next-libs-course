import {computed, PropType} from "vue";
import {CellStyle, ColumnOptions, TableStyle} from "./types";
import {sumBy} from "lodash-es";
import {IsReachBoundary} from "./scroll";

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
  scrollBoundary: {
    type: Array as unknown as PropType<IsReachBoundary>,
    default: () => [true, false]
  }
}




function getCellStyle(columns: ColumnOptions[], tableStyle: TableStyle, scrollBoundary: IsReachBoundary, index: number): Partial<CellStyle> {
  const result: Partial<CellStyle> = {};
  const col = columns[index];
  const firstFixedIndex = computed(() => columns.findIndex(item => item.fixed));
  const setBoxShadow = (colIndex: number): string => { // 暂时只考虑右边
    return !scrollBoundary[1] && colIndex === firstFixedIndex.value ? '-2px 0 6px -2px rgba(0,0,0,.2)' : 'none';
  }
  if (col.fixed && tableStyle.width) { // 暂时只考虑右边
    const sArr = columns.slice(index + 1);
    // console.log('sArr', sArr);
    result.position = 'sticky';
    result.right = sumBy(sArr, 'width') + 'px';
    // result.borderRight = '1px solid #dedfe1';
    result.boxShadow = setBoxShadow(index);
  }
  return result;
}

export { commonProps, getCellStyle };
