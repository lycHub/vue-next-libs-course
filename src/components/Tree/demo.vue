<template>
  <div class="demo-box">
    <h3>tree demo</h3>
    <div class="bts">
      <button @click="selectedNode">获取选中节点</button> ｜
      <button @click="checkedNodes">获取勾选的节点</button> ｜
      <button @click="halfCheckedNodes">获取半选的节点</button>
    </div>
    <a-tree ref="aTree" :source="list" :lazyLoad="lazyLoad" show-checkbox>
      <template #icon="loading">
        <i v-if="loading" class="iconfont iconcustom-icon ico-loading"></i>
        <i v-else class="iconfont iconzhankai"></i>
      </template>
    </a-tree>
  </div>
</template>

<script lang="tsx">
  import {defineComponent, onMounted, ref} from 'vue';
  import {TreeInstance, TreeNodeOptions} from "./types";

  function recursion(path = '0'): TreeNodeOptions[] {
    const list = [];
    for (let i = 0; i < 2; i += 1) {
      const nodeKey = `${path}-${i}`;
      const treeNode: TreeNodeOptions  = {
        nodeKey,
        name: nodeKey,
        selected: nodeKey === '0-0',
        hasChildren: true
      };
      list.push(treeNode);
    }
    return list;
  }

  export default defineComponent({
    name: 'TreeDemo',
    setup(props) {
      // https://lychub.github.io/vue-virtual-tree
      const list = ref<TreeNodeOptions[]>([]);
      onMounted(() => {
        list.value = recursion();
      });
      const lazyLoad = (node: TreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => {
        const result: TreeNodeOptions[] = [];
        for (let i = 0; i < 3; i += 1) {
          const nodeKey = `${node.nodeKey}-${i}`;
          const treeNode: TreeNodeOptions  = {
            nodeKey,
            name: nodeKey,
            // disabled: i % 2 === 0,
            children: [],
            hasChildren: true
          };
          result.push(treeNode);
        }
        setTimeout(() => {
          callback(result);
        }, 1000);
      }

      const aTree = ref<TreeInstance>();
      const selectedNode = () => {
        const node = aTree.value!.getSelectedNode();
        console.log('selected node', node);
      }
      
      const checkedNodes = () => {
        const nodes = aTree.value!.getCheckedNodes();
        console.log('checkedNodes', nodes);
      }
      
      const halfCheckedNodes = () => {
        const nodes = aTree.value!.getHalfCheckedNodes();
        console.log('halfCheckedNodes', nodes);
      }
      
      return {
        list,
        lazyLoad,
        aTree,
        selectedNode,
        checkedNodes,
        halfCheckedNodes,
      }
    }
  });
</script>
