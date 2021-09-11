import {defineComponent, inject, PropType, toRefs} from 'vue';
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
      type: Object as PropType<TableData>,
      default: () => ({})
    },
    renderFunc: {
      type: Function as PropType<TableRenderFunc>,
      required: true
    }
  },
  setup(props) {
    // console.log('render data setup', data); 不能解构
    return () => props.renderFunc({
      col: props.column,
      index: props.index,
      data: props.data
    });
  }
});
