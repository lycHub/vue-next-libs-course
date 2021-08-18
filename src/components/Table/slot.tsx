import {defineComponent, inject, PropType} from 'vue';
import {ColumnOptions, TableData, TableRenderFunc, TableRootKey} from "./types";

export default defineComponent({
  name: 'RenderCell',
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
    const tableSlots = inject(TableRootKey);
    return () => tableSlots ? tableSlots[props.column.slot]!({
      col: props.column,
      index: props.index,
      data: props.data
    }) : null;
  }
});
