import { PropType } from 'vue';
import { AntRuleItem } from "./types";
declare const _default: import("vue").DefineComponent<{
    label: {
        type: StringConstructor;
        default: string;
    };
    prop: {
        type: StringConstructor;
        default: string;
    };
    rules: PropType<AntRuleItem | AntRuleItem[]>;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    label: string;
    prop: string;
} & {
    rules?: AntRuleItem | AntRuleItem[] | undefined;
}>, {
    label: string;
    prop: string;
}>;
export default _default;
