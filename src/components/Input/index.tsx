import {defineComponent, ref} from 'vue';
import './index.scss';

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
        return ['text', 'number', 'tel', 'textarea', 'time'].includes(value);
      },
      default: 'text'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const onInput = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      if (value !== props.modelValue) {
        emit('update:modelValue', value);
      }
    }

    return () => {
      return (
        <div class="ant-field-wrap">
          <input
            class="ant-field"
            type={ props.type }
            placeholder={ attrs.placeholder as string }
            onInput={ onInput }
            value={ props.modelValue }
          />
        </div>
      );
    }
  }
});
