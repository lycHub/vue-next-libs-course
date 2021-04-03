import {defineComponent, inject} from 'vue';
import './index.scss';
import {FormItemContext, FormItemKey} from "@/components/Form/types";

export default defineComponent({
  name: "AInput",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    type: {
      validator: (value: string) => {
        return ['text', 'password', 'number', 'tel', 'textarea', 'time'].includes(value);
      },
      default: 'text'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const formItemCtx = inject<FormItemContext>(FormItemKey);
    const onInput = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      if (value !== props.modelValue) {
        emit('update:modelValue', value);
        formItemCtx?.handlerControlChange(value)
      }
    }

    const onBlur = () => {
      formItemCtx?.handlerControlBlur(props.modelValue);
    }

    return () => {
      return (
        <div class="ant-field-wrap">
          <input
            class="ant-field"
            autocomplete="new-password"
            type={ props.type }
            placeholder={ attrs.placeholder as string }
            onInput={ onInput }
            onBlur={ onBlur }
            value={ props.modelValue }
          />
        </div>
      );
    }
  }
});
