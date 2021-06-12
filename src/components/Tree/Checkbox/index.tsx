import {defineComponent, computed} from 'vue';
import './index.scss';
import {CustomEventFuncType} from "../../utils/types";

export default defineComponent({
  name: 'ACheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    halfChecked: { // 是否半选
      type: Boolean,
      default: false
    },
    onChange: Function as CustomEventFuncType<boolean>
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const rootCls = computed(() => {
      let result = 'ant-checkbox';
      if (props.modelValue) {
        result += ' checked';
      } else if (props.halfChecked) {
        result += ' half-checked';
      }
      if (props.disabled) {
        result += ' disabled';
      }
      return result;
    });
    const handleClick = (event: MouseEvent) => {
      event.stopPropagation();
      if (!props.disabled) {
        emit('update:modelValue', !props.modelValue);
        emit('change', !props.modelValue);
      }
    }
    return () => {
      return (
        <div
          class={ rootCls.value }
          onClick={ handleClick }>
          <div class="inner" />
          <div class="content">{ slots.default && slots.default() }</div>
        </div>
      );
    }
  }
});
