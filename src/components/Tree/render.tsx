import { defineComponent, PropType } from 'vue';
import {renderFunc, RequiredTreeNodeOptions} from "./types";
export default defineComponent({
  name: 'RenderNode',
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true
    },
    render: {
      type: Function as PropType<renderFunc>,
      required: true
    }
  },
  setup(props) {
    return () => props.render(props.node);
  }
});
