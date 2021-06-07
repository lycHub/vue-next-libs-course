type nodeKey = string | number; // 唯一索引

/*
* 用户传入的source必须要有 nodeKey, name
* */

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


export { TreeNodeOptions, nodeKey };
