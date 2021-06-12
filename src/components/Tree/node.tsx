import {defineComponent, PropType, ref} from 'vue';
import {RequiredTreeNodeOptions} from "./types";


export default defineComponent({
  name: "ATreeNode",
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true
    },
    onToggleExpand: Function as PropType<(arg: RequiredTreeNodeOptions) => void>
  },
  emits: ['toggle-expand'],
  setup(props, { emit }) {
    const { node } = props;

    const handleExpand = () => {
      emit('toggle-expand', props.node);
    }

    // ??
    const renderArrow = (): JSX.Element => {
      return <div class={ ['node-arrow', node.expanded ? 'expanded' : ''] }>
        {
          node.hasChildren
            ? node.loading
            ? <i class="iconfont iconloading ico-loading" />
            : <i class="iconfont iconExpand" onClick={handleExpand} />
            : null
        }
      </div>
    }
    return () => {
      return (
        <div class="ant-tree-node" style={{ paddingLeft: node.level * 18 + 'px' }}>
          { renderArrow() }
          <div class="node-content node-text">
            <span class="node-title">{ node.name }</span>
          </div>
        </div>
      );
    }
  }
});
