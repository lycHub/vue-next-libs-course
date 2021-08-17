import { defineComponent, PropType } from 'vue';
import {ColumnOptions, TableData, TableRenderFunc} from "./types";

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
      type: Array as PropType<TableData>,
      default: () => ({})
    },
    renderFunc: {
      type: Function as PropType<TableRenderFunc>,
      required: true
    }
  },
  setup({ column, index, data, renderFunc }) {
    console.log('render data setup', data);
    return () => renderFunc(column, index, data);
  }
});
