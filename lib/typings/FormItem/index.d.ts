import { SFCWithInstall } from "../utils/types";
declare const _default: SFCWithInstall<import("vue").DefineComponent<{
    label: {
        type: StringConstructor;
        default: string;
    };
    prop: {
        type: StringConstructor;
        default: string;
    };
    rules: import("vue").PropType<import("../Form/types").AntRuleItem | import("../Form/types").AntRuleItem[]>;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    label: string;
    prop: string;
} & {
    rules?: import("../Form/types").AntRuleItem | import("../Form/types").AntRuleItem[] | undefined;
}>, {
    label: string;
    prop: string;
}>>;
export default _default;
