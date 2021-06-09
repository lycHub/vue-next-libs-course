import {defineComponent, PropType, watch, ref} from 'vue';
import './index.scss';
import {RequiredTreeNodeOptions, TreeNodeOptions} from "./types";

function flattenTree(source: TreeNodeOptions[]): RequiredTreeNodeOptions[] {
  const result: RequiredTreeNodeOptions[] = [];
  const recursion = (list: TreeNodeOptions[], level = 0, parent: RequiredTreeNodeOptions | null = null): RequiredTreeNodeOptions[] => {
    return list.map(item => {
      const node: RequiredTreeNodeOptions = {
        ...item,
        level,
        loading: false,
        disabled: item.disabled || false,
        expanded: item.expanded || false,
        selected: item.selected || false,
        checked: item.checked || parent?.checked || false,
        hasChildren: item.hasChildren || false,
        parentKey: parent?.nodeKey || null,
        children: item.children || []
      }
      result.push(node);
      if (item.expanded && node.children.length) {
        node.children = recursion(node.children, level + 1, node);
      }
      return node;
    });
  }
  if (source.length) {
    recursion(source);
  }
  return result;
}

export default defineComponent({
  name: "ATree",
  props: {
    source: {
      type: Array as PropType<TreeNodeOptions[]>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const flatList = ref<RequiredTreeNodeOptions[]>([]);
    watch(() => props.source, (newVal) => {
      flatList.value = flattenTree(newVal);
      console.log('flatList', flatList.value);
    }, { immediate: true });
    return () => {
      return (
        <div class="ant-tree-wrap">
          <div class="ant-tree">
            <div class="ant-tree-node">
              <div class="tree-content node-text">
                <span class="node-title">aaa</span>
              </div>
            </div>

            <div class="ant-tree-node">
              <div class="tree-content node-text">
                <span class="node-title">bbb</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
});
