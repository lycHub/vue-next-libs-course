import {defineComponent, inject, onMounted, onBeforeUnmount, ref} from 'vue';
import {TabContext, TabsKey} from "./types";

export default defineComponent({
  name: "ATabPane",
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, { emit, slots }) {
    const parent = inject<TabContext>(TabsKey);
    const show = ref(false);
    onMounted(() => {
      parent?.addPane({
        name: props.name
      })
    });
    onBeforeUnmount(() => {
      parent?.removePane(props.name);
    })
    return () => {
      return (
        <div class="pane" v-show={ show.value }>
          { slots.default!() }
        </div>
      );
    }
  }
});
