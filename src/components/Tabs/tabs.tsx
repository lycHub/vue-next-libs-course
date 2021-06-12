import {defineComponent, onMounted, provide, ref, watch} from 'vue';
import './index.scss';
import {TabContext, TabPaneContext, TabsKey} from "./types";

export default defineComponent({
  name: "ATabs",
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const panels = ref<TabPaneContext[]>([]);
    const currentTabName = ref(props.modelValue);
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
        emit('update:modelValue', panels.value[0].name);
      }
      updatePaneVisible();
    });
    watch(() => props.modelValue, newVal => {
      currentTabName.value = newVal;
      updatePaneVisible();
    });
    const tabClick = (name: string) => {
      if (name !== currentTabName.value) {
        emit('update:modelValue', name);
      }
    }
    const renderNavs = () => {
      return panels.value.map(item => {
        const extraCls = item.name === currentTabName.value ? 'active' : '';
        return <div class={ 'ant-tab-pane ' + extraCls } onClick={ tabClick.bind(null, item.name) }>
          { item.titleSlot ? item.titleSlot(item.name) : item.name }
        </div>
      });
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
