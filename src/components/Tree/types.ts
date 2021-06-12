import {PropType} from "@vue/runtime-core";

type nodeKey = string | number; // 唯一索引

/*
* 用户传入的source必须要有 nodeKey, name
* */

interface TreeNodeOptions {
  nodeKey: nodeKey;
  name: string;
  level?: number; // 控制缩进
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


// 组件内部用的
type RequiredTreeNodeOptions = Required<TreeNodeOptions>;

type renderFunc = (node: RequiredTreeNodeOptions) => JSX.Element;

type CustomEventFuncType<T> = PropType<(arg: T) => void>;

export { TreeNodeOptions, nodeKey, RequiredTreeNodeOptions, renderFunc, CustomEventFuncType, TreeInstance, TreeNodeInstance };
