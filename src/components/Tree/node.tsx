import {computed, defineComponent, PropType, ref, Slot} from 'vue';
import {renderFunc, RequiredTreeNodeOptions} from "./types";
import RenderNode from './render';

type CustomEventFuncType<T> = PropType<(arg: T) => void>;

export default defineComponent({
  name: "ATreeNode",
  props: {
    node: {
      type: Object as PropType<RequiredTreeNodeOptions>,
      required: true
    },
    iconSlot: Function as PropType<Slot>,
    render: Function as PropType<renderFunc>,
    onToggleExpand: Function as CustomEventFuncType<RequiredTreeNodeOptions>,
    onSelectChange: Function as CustomEventFuncType<RequiredTreeNodeOptions>,
  },
  emits: ['toggle-expand', 'select-change', 'check-change'],
  setup(props, { emit }) {
    const { node, render, iconSlot } = props;

    const textCls = computed(() => {
      let result = 'node-title';
      if (node.selected) {
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
    const renderContent = (): JSX.Element => {
      return <div class="node-content node-text" onClick={handleSelect}>
        {
          render ? <RenderNode render={ render } node={ node } /> : <span class={textCls.value}>{node.name}</span>
        }
      </div>
    }
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
