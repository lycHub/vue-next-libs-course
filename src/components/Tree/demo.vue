<template>
  <div class="demo-box">
    <h3>tree demo</h3>
    <a-tree :source="list" :lazyLoad="lazyLoad" />
  </div>
</template>

<script lang="tsx">
  import {defineComponent, onMounted, ref} from 'vue';
  import {TreeNodeOptions} from "./types";

  function recursion(path = '0'): TreeNodeOptions[] {
    const list = [];
    for (let i = 0; i < 2; i += 1) {
      const nodeKey = `${path}-${i}`;
      const treeNode: TreeNodeOptions  = {
        nodeKey,
        name: nodeKey,
        // children: [],
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
        for (let i = 0; i < 2; i += 1) {
          const nodeKey = `${node.nodeKey}-${i}`;
          const treeNode: TreeNodeOptions  = {
            nodeKey,
            name: nodeKey,
            children: [],
            hasChildren: true
          };
          result.push(treeNode);
        }
        setTimeout(() => {
          callback(result);
        }, 1000);
      }
      return {
        list,
        lazyLoad
      }
    }
  });
</script>
