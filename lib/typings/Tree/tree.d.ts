import { PropType } from 'vue';
import { renderFunc, RequiredTreeNodeOptions, TreeNodeOptions } from "./types";
import './index.scss';
declare const _default: import("vue").DefineComponent<{
    source: {
        type: PropType<TreeNodeOptions[]>;
        default: () => never[];
    };
    showCheckbox: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    render: PropType<renderFunc>;
    lazyLoad: PropType<(node: RequiredTreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => void>;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("select-change" | "check-change")[], "select-change" | "check-change", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    source: TreeNodeOptions[];
    showCheckbox: boolean;
    checkStrictly: boolean;
} & {
    render?: renderFunc | undefined;
    lazyLoad?: ((node: RequiredTreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => void) | undefined;
}>, {
    source: TreeNodeOptions[];
    showCheckbox: boolean;
    checkStrictly: boolean;
}>;
export default _default;
