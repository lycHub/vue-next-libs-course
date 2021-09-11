import { Ref } from "vue";
import { SelectedRow } from "./types";

function findTargetIndexOfSelectedRowIndexes(index: number, selectedRowIndexes: number[]): number {
  return selectedRowIndexes.findIndex(item => item === index);
}

export default {
  single(row: SelectedRow, selectedRowIndexes: Ref<number[]>) {
    const targetIndexOfSelectedRowIndexes = findTargetIndexOfSelectedRowIndexes(row.index, selectedRowIndexes.value);
    if (selectedRowIndexes.value.length === 1 && targetIndexOfSelectedRowIndexes === 0) {
      selectedRowIndexes.value.length = 0;
    } else {
      selectedRowIndexes.value = [row.index];
    }
  },
  ctrl(row: SelectedRow, selectedRowIndexes: Ref<number[]>) {
    const targetIndexOfSelectedRowIndexes = findTargetIndexOfSelectedRowIndexes(row.index, selectedRowIndexes.value);
    if (selectedRowIndexes.value.length) {
      if (targetIndexOfSelectedRowIndexes > -1) {
        selectedRowIndexes.value.splice(targetIndexOfSelectedRowIndexes, 1);
      } else {
        selectedRowIndexes.value.push(row.index);
      }
    } else {
      selectedRowIndexes.value = [row.index];
    }
  },
  shift() {
    console.log('shift');
  }
}