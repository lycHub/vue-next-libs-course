import {defineComponent, PropType, watch, ref} from 'vue';
import { cloneDeep } from 'lodash';

import {nodeKey, RequiredTreeNodeOptions, TreeNodeOptions} from "./types";
import ATreeNode from './node';
import './index.scss';

export default defineComponent({
  name: "ATree",
  props: {
    source: {
      type: Array as PropType<TreeNodeOptions[]>,
      default: () => []
    },
    lazyLoad: Function as PropType<(node: RequiredTreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => void>
  },
  emits: ['select-change'],
  setup(props, { emit }) {
    // 推导优先，其次范型
    const loading = ref(false);
    const selectedKey = ref<nodeKey>('');
    const flatList = ref<RequiredTreeNodeOptions[]>([]);
    const flattenTree = (source: TreeNodeOptions[]): RequiredTreeNodeOptions[] => {
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
          if (node.selected) {
            selectedKey.value = node.nodeKey;
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
    watch(() => props.source, (newVal) => {
      flatList.value = flattenTree(newVal);
      // console.log('flatList', flatList.value);
      // console.log('selectedKey', selectedKey.value);
    }, { immediate: true });

    const expandNode = (node: RequiredTreeNodeOptions, children: TreeNodeOptions[] = []) => {
      const trueChildren = children.length ? children : cloneDeep(node.children);
      node.children = trueChildren.map(item => {
        return {
          ...item,
          level: item.level || node.level + 1,
          loading: false,
          disabled: item.disabled || false,
          expanded: item.expanded || false,
          selected: item.selected || false,
          hasChildren: item.hasChildren || false,
          // false也是合法值，不能用 ||, 可选链
          checked: item.checked ?? node.checked,
          parentKey: node.nodeKey || null,
          children: item.children || []
        }
      });
      const targetIndex = flatList.value.findIndex(item => item.nodeKey === node.nodeKey);
      if (targetIndex > -1) {
        flatList.value.splice(targetIndex + 1, 0, ...(node.children as RequiredTreeNodeOptions[]))
      }
    }

    const collapseNode = (node: RequiredTreeNodeOptions) => {
      const delKeys: nodeKey[] = [];
      const recursion = (currentNode: RequiredTreeNodeOptions) => {
        if (currentNode.children.length) {
          currentNode.children.forEach(item => {
            delKeys.push(item.nodeKey);
            if (item.expanded) { // 也需要收起
              item.expanded = false;
              recursion(item as RequiredTreeNodeOptions);
            }
          });
        }
      }
      recursion(node);
      if (delKeys.length) {
        flatList.value = flatList.value.filter(item => !delKeys.includes(item.nodeKey));
      }
    }

    const handleToggleExpand = (node: RequiredTreeNodeOptions) => {
      if (loading.value) return;
      node.expanded = !node.expanded;
      if (node.expanded) { // 需要展开
        /*
        * 首次展开，children可能是用户自带的
        * */
        if (node.children.length) {
          expandNode(node);
        } else {
          // 懒加载
          if (props.lazyLoad && node.hasChildren) {
            node.loading = true; // 控制图标
            loading.value = true; // 防止重复点击
            props.lazyLoad(node, children => {
              if (children.length) {
                expandNode(node, children);
              }
              node.loading = false;
              loading.value = false;
            });
          } else {
            node.expanded = !node.expanded;
          }
        }
      } else { // 收起
        collapseNode(node);
      }
    }

    const handleSelectChange = (node: RequiredTreeNodeOptions) => {
      node.selected = !node.selected;
      let newSelectKey: nodeKey = '';
      if (selectedKey.value !== node.nodeKey) {
        const preSelectedIndex = flatList.value.findIndex(item => item.nodeKey === selectedKey.value);
        if (preSelectedIndex > -1) {
          flatList.value[preSelectedIndex].selected = false;
        }
        newSelectKey = node.nodeKey;
      }
      selectedKey.value = newSelectKey;
      emit('select-change', node);
    }

    return () => {
      return (
        <div class="ant-tree-wrap">
          <div class="ant-tree">
            {
              flatList.value.map((node, index) => {
                return <ATreeNode
                  key={ node.nodeKey }
                  node={ node }
                  onToggleExpand={ handleToggleExpand }
                  onSelectChange={ handleSelectChange }
                />
              })
            }
          </div>
        </div>
      );
    }
  }
});
