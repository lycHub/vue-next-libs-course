import { App } from 'vue';

import {PropType} from "@vue/runtime-core";

type CustomEventFuncType<T> = PropType<(arg: T) => void>;
type SFCWithInstall<T> = T & { install(app: App): void; }

export { CustomEventFuncType, SFCWithInstall }
