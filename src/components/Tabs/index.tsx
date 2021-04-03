import {defineComponent} from 'vue';
import './index.scss';

export default defineComponent({
  name: "ATabs",
  setup(props, { emit, slots }) {
    return () => {
      return (
        <div class="ant-tabs">
          <div class="navs">
            <div class="ant-tab-pane">Tab 1</div>
            <div class="ant-tab-pane active">Tab 2</div>
            <div class="ant-tab-pane">Tab 3</div>
          </div>
          { slots.default!() }
        </div>
      );
    }
  }
});
