import {defineComponent, inject, onMounted, onBeforeUnmount, PropType, provide, ref} from 'vue';
import {
  AntRuleItem,
  FormContext,
  FormItemContext,
  FormItemKey,
  FormKey,
  ValidTrigger
} from "./types";
import Schema, {ErrorList} from 'async-validator';
let id = 0;
function generateId(): string {
  return 'form-item-' + id++;
}

export default defineComponent({
  name: "AFormItem",
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    rules: [Object, Array] as PropType<AntRuleItem | AntRuleItem[]>
  },
  setup(props, {emit, slots}) {
    const currentId = generateId();
    const errMsg = ref('');
    const parent = inject<FormContext>(FormKey);

    onMounted(() => {
      parent?.addItem({
        id: currentId,
        prop: props.prop,
        validate
      })
    });

    onBeforeUnmount(() => {
      parent?.removeItem(currentId);
    });

    const getRules = (trigger?: ValidTrigger): AntRuleItem[] => {
      const rules = props.rules || parent?.rules[props.prop];
      if (rules) {
        const ruleArr = Array.isArray(rules) ? rules : [rules];
        if (trigger) {
          return ruleArr.filter(item => item.trigger === trigger);
        }
        return ruleArr;
      }
      return [];
    }

    const validate = (value: string, rules?: AntRuleItem[]): Promise<boolean | ErrorList> => {
      const trueRules = rules || getRules();
      if (trueRules.length && props.prop) {
        // console.log('rules', rules);
        const schema = new Schema({ [props.prop]: trueRules });
        return schema.validate({ [props.prop]: value }).then(() => {
          errMsg.value = '';
          return true
        }).catch(({ errors }) => {
          errMsg.value = errors[0].message;
          return Promise.reject(errors);
        })
      }
      return Promise.resolve(true);
    }
    const handlerControlChange = (value: string) => {
      const trueRules = getRules('change');
      if (trueRules.length) {
        validate(value, trueRules);
      }
    }
    const handlerControlBlur = (value: string) => {
      const trueRules = getRules('blur');
      if (trueRules.length) {
        validate(value, trueRules);
      }
    }
    provide<Partial<FormItemContext>>(FormItemKey, {
      handlerControlChange,
      handlerControlBlur
    });
    const renderLabel = () => {
      return slots.label ? slots.label() : <label class="item-label">{ props.label }</label>;
    }

    return () => {
      return (
        <div class="ant-form-item">
          { renderLabel() }
          <div class="item-content">
            <div class="item-control-wrap">
              { slots.default!() }
            </div>
            <p class="item-error" v-show={ errMsg.value }>{ errMsg.value }</p>
          </div>
        </div>
      );
    }
  }
});
