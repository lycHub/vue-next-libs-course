import { App } from 'vue';
import TabPane from '../Tabs/TabPane';
import {SFCWithInstall} from "../utils/types";

TabPane.install = (app: App) => {
  app.component(TabPane.name, TabPane);
}

export default TabPane as SFCWithInstall<typeof TabPane>;
