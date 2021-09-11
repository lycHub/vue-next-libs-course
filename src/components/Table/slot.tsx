import {defineComponent, inject, PropType} from 'vue';
import { TableRootKey } from './injections';
import {ColumnOptions, TableData} from "./types";

export default defineComponent({
  name: 'RenderSlot',
  props: {
    column: {
      type: Object as PropType<ColumnOptions>,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    data: {
      type: Object as PropType<TableData>,
      default: () => ({})
    }
  },
  setup(props) {
    const tableSlots = inject(TableRootKey)!;
    return () => tableSlots.slots[props.column.slot] ? tableSlots.slots[props.column.slot]!({
      col: props.column,
      index: props.index,
      data: props.data
    }) : null;
  }
});
