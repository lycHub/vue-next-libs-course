import {getCurrentInstance} from "@vue/runtime-core";

function useExpose<T>(extra: T) {
  const instance = getCurrentInstance();
  if (instance) {
    Object.assign(instance.proxy, extra);
  }
}

export { useExpose };
