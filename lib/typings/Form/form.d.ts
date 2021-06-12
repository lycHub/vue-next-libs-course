import { PropType } from 'vue';
import { AntFormRules } from "./types";
import './index.scss';
declare const _default: import("vue").DefineComponent<{
    model: {
        type: ObjectConstructor;
        required: true;
    };
    rules: PropType<AntFormRules>;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "validate"[], "validate", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    model: Record<string, any>;
} & {
    rules?: AntFormRules | undefined;
}>, {}>;
export default _default;
