import { ClickType } from "./types";

function getClickType(event: MouseEvent): ClickType {
  return event.shiftKey ? 'shift' : (event.ctrlKey || event.metaKey) ? 'ctrl' : 'single';
}

export { getClickType };