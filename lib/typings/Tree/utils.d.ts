import { RequiredTreeNodeOptions } from "./types";
declare function updateDownwards(checked: boolean, node: RequiredTreeNodeOptions): void;
declare function updateUpwards(node: RequiredTreeNodeOptions, flatList: RequiredTreeNodeOptions[]): void;
export { updateDownwards, updateUpwards };
