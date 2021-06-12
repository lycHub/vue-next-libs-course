import { PropType } from 'vue';
import { renderFunc } from "./types";
declare const _default: import("vue").DefineComponent<{
    node: {
        type: PropType<Required<import("./types").TreeNodeOptions>>;
        required: true;
    };
    render: {
        type: PropType<renderFunc>;
        required: true;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    node: Required<import("./types").TreeNodeOptions>;
    render: renderFunc;
} & {}>, {}>;
export default _default;
