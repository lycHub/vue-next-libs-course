import {ErrorList, RuleItem} from "async-validator";

const FormKey = 'formKey';
const FormItemKey = 'formItemKey';

type validateFunc = (callback: (valid: boolean) => void) => Promise<boolean | ErrorList>;

interface FormContext {
  model: Record<string, any>;
  rules: AntFormRules;
  validate: validateFunc;
}

interface FormItemContext {
  handlerControlChange(value: string): void;
  handlerControlBlur(value: string): void;
}
type ValidTrigger = 'change' | 'blur';
interface AntRuleItem extends RuleItem {
  trigger?: ValidTrigger;
}
interface AntFormRules {
  [key: string]: AntRuleItem | AntRuleItem[];
}


export { FormKey, FormItemKey, FormContext, FormItemContext, AntRuleItem, ValidTrigger, validateFunc, AntFormRules };
