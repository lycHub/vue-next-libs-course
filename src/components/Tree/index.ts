import { App } from 'vue';
import Tree from './tree';
import {SFCWithInstall} from "../utils/types";

Tree.install = (app: App) => {
  app.component(Tree.name, Tree);
}

export default Tree as SFCWithInstall<typeof Tree>;
