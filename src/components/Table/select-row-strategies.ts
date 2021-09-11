import { last, take, uniq } from "lodash-es";
import { Ref } from "vue";
import { genIndexesFromRange } from "../utils";
import { SelectedRow } from "./types";

function findTargetIndexOfSelectedRowIndexes(index: number, selectedRowIndexes: number[]): number {
  return selectedRowIndexes.findIndex(item => item === index);
}
let startRowOfShiftSelectRow = -1;
export default {
  single(row: SelectedRow, selectedRowIndexes: Ref<number[]>) {
    const targetIndexOfSelectedRowIndexes = findTargetIndexOfSelectedRowIndexes(row.index, selectedRowIndexes.value);
    if (selectedRowIndexes.value.length === 1 && targetIndexOfSelectedRowIndexes === 0) {
      selectedRowIndexes.value.length = 0;
      startRowOfShiftSelectRow = -1;
    } else {
      selectedRowIndexes.value = [row.index];
      startRowOfShiftSelectRow = row.index;
    }
  },
  ctrl(row: SelectedRow, selectedRowIndexes: Ref<number[]>) {
    const targetIndexOfSelectedRowIndexes = findTargetIndexOfSelectedRowIndexes(row.index, selectedRowIndexes.value);
    if (selectedRowIndexes.value.length) {
      if (targetIndexOfSelectedRowIndexes > -1) {
        const delRow = selectedRowIndexes.value.splice(targetIndexOfSelectedRowIndexes, 1)[0];
        if (delRow === startRowOfShiftSelectRow) {
          startRowOfShiftSelectRow = last(selectedRowIndexes.value) ?? -1;
        }
      } else {
        selectedRowIndexes.value.push(row.index);
        startRowOfShiftSelectRow = row.index;
      }
    } else {
      selectedRowIndexes.value = [row.index];
      startRowOfShiftSelectRow = row.index;
    }
  },
  shift(row: SelectedRow, selectedRowIndexes: Ref<number[]>) {
    if (startRowOfShiftSelectRow > -1) {
      // 起点对应的索引
      const targetIndexOfSelectedRowIndexes = findTargetIndexOfSelectedRowIndexes(startRowOfShiftSelectRow, selectedRowIndexes.value);
      // 以startRowOfShiftSelectRow为起点，之前的保留下来，后面的去掉
      const remainRows = take(selectedRowIndexes.value, targetIndexOfSelectedRowIndexes); // 取前面的 startIndex 个元素
      selectedRowIndexes.value = uniq(remainRows.concat(genIndexesFromRange([startRowOfShiftSelectRow, row.index])));
      getSelection()!.removeAllRanges();
    } else {
      selectedRowIndexes.value = [row.index];
      startRowOfShiftSelectRow = row.index;
    }
  }
}