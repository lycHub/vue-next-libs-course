import {defineComponent, PropType} from 'vue';
import './index.scss';
import {TreeNodeOptions} from "./types";

export default defineComponent({
  name: "ATree",
  props: {
    source: {
      type: Array as PropType<TreeNodeOptions[]>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    return () => {
      return (
        <div class="ant-tree-wrap">
          <div class="ant-tree">
            <div class="ant-tree-node">
              <div class="tree-content">aaa</div>
            </div>

            <div class="ant-tree-node">
              <div class="tree-content">bbb</div>
            </div>
          </div>
        </div>
      );
    }
  }
});
