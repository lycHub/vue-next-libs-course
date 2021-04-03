import { App } from "vue";
import Input from './components/Input/index';
import FormItem from './components/Form/FormItem';


const components = [
  Input,
  FormItem
]

export default function (app: App) {
  components.forEach(item => app.component(item.name, item));
}
