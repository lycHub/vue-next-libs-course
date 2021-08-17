import { App } from "vue";
import Input from './Input';
import Form from './Form';
import FormItem from './FormItem';
import Tabs from './Tabs';
import TabPane from './TabPane';
import Tree from './Tree';
import Table from './Table';


const components = [
  Input,
  FormItem,
  Form,
  Tabs,
  TabPane,
  Tree,
  Table
]

export {
  Input,
  FormItem,
  Form,
  Tabs,
  TabPane,
  Tree,
  Table
}

export default function (app: App) {
  components.forEach(item => app.component(item.name, item));
}
