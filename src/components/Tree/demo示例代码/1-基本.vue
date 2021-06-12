<template>
  <div class="demo-box">
    <h3>tree demo</h3>
    <a-tree :source="list" />
  </div>
</template>

<script lang="tsx">
  import {defineComponent, onMounted, ref} from 'vue';
  import {TreeNodeOptions} from "./types";

  function recursion(path = '0', level = 2): TreeNodeOptions[] {
    const list = [];
    for (let i = 0; i < 5; i += 1) {
      const nodeKey = `${path}-${i}`;
      const treeNode: TreeNodeOptions  = {
        nodeKey,
        name: nodeKey,
        children: [],
        hasChildren: true,
        // expanded: true
        // disabled: i % 2 === 0
      };

      if (level > 0) {
        treeNode.children = recursion(nodeKey, level - 1);
      } else {
        treeNode.hasChildren = false;
      }

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
      return {
        list
      }
    }
  });
</script>
