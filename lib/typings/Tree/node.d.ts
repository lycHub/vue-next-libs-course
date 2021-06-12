import { PropType, Slot } from 'vue';
import { renderFunc } from "./types";
declare const _default: import("vue").DefineComponent<{
    node: {
        type: PropType<Required<import("./types").TreeNodeOptions>>;
        required: true;
    };
    showCheckbox: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    iconSlot: PropType<Slot>;
    render: PropType<renderFunc>;
    onToggleExpand: PropType<(arg: Required<import("./types").TreeNodeOptions>) => void>;
    onSelectChange: PropType<(arg: Required<import("./types").TreeNodeOptions>) => void>;
    onCheckChange: PropType<(arg: [boolean, Required<import("./types").TreeNodeOptions>]) => void>;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("toggle-expand" | "select-change" | "check-change")[], "toggle-expand" | "select-change" | "check-change", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    node: Required<import("./types").TreeNodeOptions>;
    showCheckbox: boolean;
    checkStrictly: boolean;
} & {
    render?: renderFunc | undefined;
    iconSlot?: Slot | undefined;
    onToggleExpand?: ((arg: Required<import("./types").TreeNodeOptions>) => void) | undefined;
    onSelectChange?: ((arg: Required<import("./types").TreeNodeOptions>) => void) | undefined;
    onCheckChange?: ((arg: [boolean, Required<import("./types").TreeNodeOptions>]) => void) | undefined;
}>, {
    showCheckbox: boolean;
    checkStrictly: boolean;
}>;
export default _default;
