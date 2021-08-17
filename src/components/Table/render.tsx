import { defineComponent, PropType } from 'vue';
import {ColumnOptions, RenderTableHeader} from "./types";

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
    renderFunc: {
      type: Function as PropType<RenderTableHeader>,
      required: true
    }
  },
  setup(props) {
    return () => props.renderFunc(props.column, props.index);
  }
});
