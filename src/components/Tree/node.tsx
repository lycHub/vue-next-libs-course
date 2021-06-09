import {defineComponent, PropType, ref} from 'vue';
import {RequiredTreeNodeOptions} from "./types";


export default defineComponent({
  name: "ATreeNode",
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true
    }
  },
  setup(props, { emit }) {
    const { node } = props;
    return () => {
      return (
        <div class="ant-tree-node" key={ node.nodeKey }>
          <div class="node-arrow">
            {
              node.hasChildren
                ? <i class="iconfont iconExpand" />
                : null
            }
          </div>
          <div class="node-content node-text">
            <span class="node-title">{ node.name }</span>
          </div>
        </div>
      );
    }
  }
});
