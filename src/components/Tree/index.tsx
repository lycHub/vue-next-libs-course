import {defineComponent} from 'vue';
import './index.scss';

export default defineComponent({
  name: "ATree",
  props: {

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
