import {defineComponent, PropType, provide} from 'vue';
import {AntFormRules, FormContext, FormItemContext, FormKey, validateFunc} from "./types";
import './index.scss';
import {useExpose} from "../../uses";
import {ErrorList} from "async-validator";

export default defineComponent({
  name: "AForm",
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object as PropType<AntFormRules>
  },
  setup(props, { emit, slots }) {
    const formItems: FormItemContext[] = [];
    const addItem = (item: FormItemContext) => {
      formItems.push(item);
      console.log('formItems', formItems);
    }
    const removeItem = (id: string) => {
      if (formItems.length) {
        const index = formItems.findIndex(item => item.id === id);
        if (index > -1) {
          formItems.splice(index, 1);
        }
      }
    }
    provide<Partial<FormContext>>(FormKey, {
      model: props.model,
      rules: props.rules,
      addItem,
      removeItem
    });
    const validate = (callback?: (valid: boolean) => void): Promise<boolean | ErrorList> => {
      return Promise.all(
        formItems
          .filter(item => item.prop)
          .map(item => item.validate(props.model[item.prop]))
      ).then(() => {
        if (callback) {
          callback(true);
        }
        return Promise.resolve(true);
      }).catch(errors => {
        if (callback) {
          callback(false)
        }
        return Promise.reject(errors);
      })
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
