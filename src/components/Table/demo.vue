<template>
  <div class="demo-box">
    <a-table :columns="columns" />
  </div>
</template>

<script lang="tsx">
  import {defineComponent, ref} from 'vue';
  export default defineComponent({
    name: "TableDemo",
    setup() {
      return {
        columns: [
          {
            title: 'Name',
            key: 'name',
            width: 200,
            fixed: 'left'
          },
          {
            title: 'Age',
            slot: 'age',
            width: 200,
            fixed: 'left'
          },
          {
            title: 'Province',
            key: 'province',
            width: 200
          },
          {
            title: 'City',
            key: 'city',
            width: 200
          },
          {
            title: 'Address',
            key: 'address',
            width: 200
          },
          {
            title: 'Postcode',
            key: 'zip',
            width: 200,
            fixed: 'right',
          }
        ]
      }
    }
  });
</script>
