import { App } from 'vue';
import Table from './table.vue';
import {SFCWithInstall} from "../utils/types";
Table.install = (app: App) => {
  app.component(Table.name, Table);
}

export default Table as SFCWithInstall<typeof Table>;
