<template>
  <div class="demo-box">
    <a-form :model="formValues" :rules="formRules" ref="AForm">
      <a-form-item label="姓名：" prop="name">
        <a-input v-model="formValues.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="密码：" prop="password">
        <a-input v-model="formValues.password" type="password" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item>
        <button @click="submit">提交</button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="tsx">
  import {defineComponent, reactive, ref} from 'vue';
  import {RuleItem} from "async-validator";
  import {AntRuleItem, FormContext} from "@/components/Form/types";
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
        password: { min: 6, message: '最少6位', trigger: 'blur' }
      });
      const AForm = ref<FormContext | null>(null);
      const submit = () => {
        AForm.value!.validate(valid => {
          console.log('valid', valid);
        });
      }
      return {
        text,
        formValues,
        formRules,
        submit,
        AForm
      }
    }
  });
</script>

<style scoped lang="scss">

</style>
