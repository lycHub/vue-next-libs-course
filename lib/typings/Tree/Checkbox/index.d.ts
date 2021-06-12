import './index.scss';
declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    halfChecked: {
        type: BooleanConstructor;
        default: boolean;
    };
    onChange: import("vue").PropType<(arg: boolean) => void>;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "update:modelValue")[], "change" | "update:modelValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    modelValue: boolean;
    disabled: boolean;
    halfChecked: boolean;
} & {
    onChange?: ((arg: boolean) => void) | undefined;
}>, {
    modelValue: boolean;
    disabled: boolean;
    halfChecked: boolean;
}>;
export default _default;
