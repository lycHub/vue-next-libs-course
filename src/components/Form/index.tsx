import {defineComponent, getCurrentInstance, PropType, provide} from 'vue';
import {AntFormRules, FormContext, FormKey, validateFunc} from "@/components/Form/types";
import './index.scss';
import {useExpose} from "@/uses";
import {ErrorList} from "async-validator";

export default defineComponent({
  name: "AForm",
  props: {
    model: Object,
    rules: Object as PropType<AntFormRules>
  },
  setup(props, { emit, slots }) {
    provide<Partial<FormContext>>(FormKey, {
      model: props.model,
      rules: props.rules
    });
    const validate = (callback?: (valid: boolean) => void): Promise<boolean | ErrorList> => {
      console.log('form validate');
      if (callback) {
        callback(true);
      }
      return Promise.resolve(true);
    }
    useExpose<{ validate: validateFunc }>({ validate });
    return () => {
      return (
        <div class="ant-form">
          { slots.default!() }
        </div>
      );
    }
  }
});
