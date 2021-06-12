import {computed, defineComponent, PropType, ref, Slot} from 'vue';
import ACheckbox from './Checkbox';
import {CustomEventFuncType, renderFunc, RequiredTreeNodeOptions} from "./types";
import RenderNode from './render';

export default defineComponent({
  name: "ATreeNode",
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    iconSlot: Function as PropType<Slot>,
    render: Function as PropType<renderFunc>,
    onToggleExpand: Function as CustomEventFuncType<RequiredTreeNodeOptions>,
    onSelectChange: Function as CustomEventFuncType<RequiredTreeNodeOptions>,
    onCheckChange: Function as CustomEventFuncType<[boolean, RequiredTreeNodeOptions]>,
  },
  emits: ['toggle-expand', 'select-change', 'check-change'],
  setup(props, { emit, expose }) {
    const { node, render, iconSlot, showCheckbox, checkStrictly } = props;

    const halfChecked = computed(() => {
      let result = false;
      if (!checkStrictly && node.hasChildren) {
        const { children } = node;
        const checkedChildren = children.filter(item => item.checked);
        result = checkedChildren.length > 0 && checkedChildren.length < children.length;
      }
      return result;
    });

    const textCls = computed(() => {
      let result = 'node-title';
      if (node.selected && !showCheckbox) {
        result += ' selected';
      }
      if (node.disabled) {
        result += ' disabled';
      }
      return result;
    });

    const handleExpand = () => {
      emit('toggle-expand', props.node);
    }

    const handleSelect = (event: MouseEvent) => {
      event.stopPropagation();
      if (!node.disabled) {
        emit('select-change', props.node);
      }
    }

    const handleCheckChange = (checked: boolean) => {
      emit('check-change', [checked, props.node]);
    }

    const renderArrow = (): JSX.Element => {
      return <div class={ ['node-arrow', node.expanded ? 'expanded' : ''] }>
        {
          node.hasChildren
            ? iconSlot ? iconSlot(node.loading) : node.loading
            ? <i class="iconfont iconloading ico-loading" />
            : <i class="iconfont iconExpand" />
            : null
        }
      </div>
    }
    const normalContent = (): JSX.Element => {
      return render ? <RenderNode render={ render } node={ node } /> : <span class={textCls.value}>{node.name}</span>;
    }
    const renderContent = (): JSX.Element => {
      if (showCheckbox) {
        return <ACheckbox
          class="node-content node-checkbox"
          disabled={ node.disabled }
          modelValue={ node.checked }
          halfChecked={ halfChecked.value }
          onChange={ handleCheckChange }>
          { normalContent() }
        </ACheckbox>
      }
      return <div class="node-content node-text" onClick={handleSelect}>
        { normalContent() }
      </div>
    }
    expose({
      node,
      halfChecked: () => halfChecked.value
    });
    return () => {
      return (
        <div class="ant-tree-node" onClick={handleExpand} style={{ paddingLeft: node.level * 18 + 'px' }}>
          { renderArrow() }
          { renderContent() }
        </div>
      );
    }
  }
});
