import { App } from 'vue';
import FormItem from '../Form/FormItem';
import {SFCWithInstall} from "../utils/types";

FormItem.install = (app: App) => {
  app.component(FormItem.name, FormItem);
}

export default FormItem as SFCWithInstall<typeof FormItem>;
