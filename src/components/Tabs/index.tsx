import {defineComponent, onMounted, provide, ref} from 'vue';
import './index.scss';
import {TabContext, TabPaneContext, TabsKey} from "./types";

export default defineComponent({
  name: "ATabs",
  setup(props, { emit, slots }) {
    const panels = ref<TabPaneContext[]>([]);
    const currentTabName = ref('');
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
    const updatePaneVisible = () => {
      if (panels.value.length) {
        panels.value.forEach(item => {
          item.changeShow(item.name === currentTabName.value);
        })
      }
    }
    onMounted(() => {
      if (!currentTabName.value && panels.value.length) {
        currentTabName.value = panels.value[0].name;
      }
      updatePaneVisible();
    });
    const renderNavs = () => {
      return panels.value.map(item => {
        const extraCls = item.name === currentTabName.value ? 'active' : '';
        return <div class={ 'ant-tab-pane ' + extraCls }>{ item.name }</div>
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
