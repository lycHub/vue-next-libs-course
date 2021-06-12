import { App } from 'vue';
import { PropType } from "@vue/runtime-core";
declare type CustomEventFuncType<T> = PropType<(arg: T) => void>;
declare type SFCWithInstall<T> = T & {
    install(app: App): void;
};
export { CustomEventFuncType, SFCWithInstall };
