import {WrapWithUndefined} from "../utils/types";
import {SelectedRow} from "./types";
import {last, take} from "lodash-es";
import {genIndexesFromRange} from "../utils/tools";

// shift选择时，起点的索引
let startRowOfShiftSelectRow: WrapWithUndefined<number>;

function ctrlSelect(row: SelectedRow, selectedRowIndexes: number[], targetIndexOfSelectedRowIndexes: number): number[] {
  startRowOfShiftSelectRow = undefined;
  if (selectedRowIndexes.length) {
    if (targetIndexOfSelectedRowIndexes > -1) {
      selectedRowIndexes.splice(targetIndexOfSelectedRowIndexes, 1);
    } else {
      selectedRowIndexes.push(row.index);
    }
  } else {
    selectedRowIndexes = [row.index];
  }
  return selectedRowIndexes;
}


function shiftSelect(row: SelectedRow, selectedRowIndexes: number[]): number[] {
  if (selectedRowIndexes.length) {
    if (!startRowOfShiftSelectRow) {
      startRowOfShiftSelectRow = last(selectedRowIndexes)!;
    }
    // 以startRowOfShiftSelectRow对应的index为起点，之前的保留下来，后面的去掉
    const startIndex = selectedRowIndexes.findIndex(item => item === startRowOfShiftSelectRow);
    const remainRows = take(selectedRowIndexes, startIndex + 1); // 取前面的 startIndex + 1 个元素
    const lastOfRemainRow = last(remainRows)!;
    selectedRowIndexes = remainRows.concat(genIndexesFromRange([lastOfRemainRow, row.index]));
    getSelection()!.removeAllRanges();
  } else {
    selectedRowIndexes = [row.index];
  }
  return selectedRowIndexes;
}


function singleSelect(row: SelectedRow, selectedRowIndexes: number[], targetIndexOfSelectedRowIndexes: number): number[] {
  startRowOfShiftSelectRow = undefined;
  if (selectedRowIndexes.length === 1 && targetIndexOfSelectedRowIndexes === 0) {
    selectedRowIndexes = [];
  } else {
    selectedRowIndexes = [row.index];
  }
  return selectedRowIndexes;
}

export const rowSelectStrategies = {
  ctrl: ctrlSelect,
  shift: shiftSelect,
  single: singleSelect,
}
