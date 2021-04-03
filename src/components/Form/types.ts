import {RuleItem} from "async-validator";

const FormItemKey = 'formItemKey';


interface FormItemContext {
  handlerControlChange(value: string): void;
  handlerControlBlur(value: string): void;
}
type ValidTrigger = 'change' | 'blur';
interface AntRuleItem extends RuleItem {
  trigger?: ValidTrigger;
}

export { FormItemKey, FormItemContext, AntRuleItem, ValidTrigger };
