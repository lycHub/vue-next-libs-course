import { App } from 'vue';

import {PropType} from "@vue/runtime-core";

type CustomEventFuncType<T> = PropType<(arg: T) => void>;
type SFCWithInstall<T> = T & { install(app: App): void; };
type WrapWithUndefined<T> = T & undefined;

type ClickType = 'single' | 'ctrl' | 'shift';

export { CustomEventFuncType, SFCWithInstall, WrapWithUndefined, ClickType }
