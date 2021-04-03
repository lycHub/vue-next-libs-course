import {defineComponent, provide, ref} from 'vue';
import './index.scss';
import {TabContext, TabPaneContext, TabsKey} from "./types";

export default defineComponent({
  name: "ATabs",
  setup(props, { emit, slots }) {
    const panels = ref<TabPaneContext[]>([]);
    const currentTabName = ref('TabTwo');
    const addPane = (pane: TabPaneContext) => {
      panels.value.push(pane);
    }
    const removePane = (name: string) => {
      if (panels.value.length) {
        const index = panels.value.findIndex(item => item.name === name);
        if (index > -1) {
          panels.value.splice(index, 1);
        }
      }
    }
    provide<TabContext>(TabsKey, {
      addPane,
      removePane
    });
    const renderNavs = () => {
      console.log('renderNavs panels', panels);
      return panels.value.map(item => {
        return <div class="ant-tab-pane">{ item.name }</div>
      })
    }
    return () => {
      return (
        <div class="ant-tabs">
          <div class="navs">{ renderNavs() }</div>
          { slots.default!() }
        </div>
      );
    }
  }
});
