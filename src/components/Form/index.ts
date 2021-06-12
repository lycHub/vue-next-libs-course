import { App } from 'vue';
import Form from './form';
import {SFCWithInstall} from "../utils/types";

Form.install = (app: App) => {
  app.component(Form.name, Form);
}

export default Form as SFCWithInstall<typeof Form>;
