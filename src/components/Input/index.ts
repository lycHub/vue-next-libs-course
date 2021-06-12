import { App } from 'vue';
import Input from './input';
import {SFCWithInstall} from "../utils/types";

Input.install = (app: App) => {
  app.component(Input.name, Input);
}

export default Input as SFCWithInstall<typeof Input>;
