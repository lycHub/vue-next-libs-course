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
            ant-tree
          </div>
        </div>
      );
    }
  }
});
