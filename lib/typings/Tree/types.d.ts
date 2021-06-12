declare type nodeKey = string | number;
interface TreeNodeOptions {
    nodeKey: nodeKey;
    name: string;
    level?: number;
    loading?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
    checked?: boolean;
    hasChildren?: boolean;
    children?: TreeNodeOptions[];
    parentKey?: nodeKey | null;
}
interface TreeInstance {
    getSelectedNode: () => RequiredTreeNodeOptions | undefined;
    getCheckedNodes: () => RequiredTreeNodeOptions[];
    getHalfCheckedNodes: () => RequiredTreeNodeOptions[];
}
interface TreeNodeInstance {
    node: RequiredTreeNodeOptions;
    halfChecked: () => boolean;
}
declare type RequiredTreeNodeOptions = Required<TreeNodeOptions>;
declare type renderFunc = (node: RequiredTreeNodeOptions) => JSX.Element;
export { TreeNodeOptions, nodeKey, RequiredTreeNodeOptions, renderFunc, TreeInstance, TreeNodeInstance };
