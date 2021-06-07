import { App } from "vue";
import Input from './components/Input';
import Form from './components/Form';
import FormItem from './components/Form/FormItem';
import Tabs from './components/Tabs';
import TabPane from './components/Tabs/TabPane';
import ATree from './components/Tree';


const components = [
  Input,
  FormItem,
  Form,
  Tabs,
  TabPane,
  ATree
]

export default function (app: App) {
  components.forEach(item => app.component(item.name, item));
}
