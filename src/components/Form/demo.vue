<template>
  <div class="demo-box">
    <a-form :model="formValues" :rules="formRules" ref="AForm" @validate="handleValidate">
      <a-form-item label="姓名：" prop="name">
        <a-input v-model="formValues.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="密码：" prop="password">
        <a-input v-model="formValues.password" type="password" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item>
        <button>提交</button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="tsx">
  import {defineComponent, reactive, ref} from 'vue'
  import {FormContext} from "./types";
  import {ErrorList} from "async-validator";
  export default defineComponent({
    name: "FormDemo",
    setup(props, {emit}) {
      const text = ref('');
      const formValues = reactive({
        name: '',
        password: ''
      });
      const formRules = reactive({
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 6, message: '不能超过6位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少6位', trigger: 'blur' }
        ]
      });
      const AForm = ref<FormContext | null>(null);
      const submit = () => {
        AForm.value!.validate(valid => {
          console.log('valid', valid);
        });
      }
      const handleValidate = (valid: boolean | ErrorList) => {
        console.log('handleValidate', valid);
      }
      return {
        text,
        formValues,
        formRules,
        submit,
        AForm,
        handleValidate
      }
    }
  });
</script>

<style scoped lang="scss">

</style>
