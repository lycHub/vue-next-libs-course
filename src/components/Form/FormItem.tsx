import {defineComponent, PropType, provide, ref} from 'vue';
import './index.scss';
import {AntRuleItem, FormItemKey, ValidTrigger} from "@/components/Form/types";
import Schema from 'async-validator';

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
    rules: {
      type: [Object, Array] as PropType<AntRuleItem | AntRuleItem[]>,
      default: () => ({})
    }
  },
  setup(props, {emit, slots}) {
    const errMsg = ref('');
    const getRules = (trigger: ValidTrigger): AntRuleItem[] => {
      const rules = props.rules;
      const ruleArr = Array.isArray(rules) ? rules : [rules];
      return ruleArr.filter(item => {
        const itemTrigger = item?.trigger || 'change';
        return itemTrigger === trigger;
      });
    }

    const validate = (value: string, rules: AntRuleItem[]): Promise<any> => {
      if (rules && props.prop) {
        // console.log('rules', rules);
        const schema = new Schema({ [props.prop]: rules });
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
    provide(FormItemKey, {
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
