import { App } from "vue";
import Input from './components/Input';
import AForm from './components/Form';
import FormItem from './components/Form/FormItem';


const components = [
  Input,
  FormItem,
  AForm
]

export default function (app: App) {
  components.forEach(item => app.component(item.name, item));
}
