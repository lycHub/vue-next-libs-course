import { App } from 'vue';
import Tabs from './tabs';
import {SFCWithInstall} from "../utils/types";

Tabs.install = (app: App) => {
  app.component(Tabs.name, Tabs);
}

export default Tabs as SFCWithInstall<typeof Tabs>;
