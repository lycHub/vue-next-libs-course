import { Slot } from "vue";
declare const TabsKey = "TabsKey";
interface TabPaneContext {
    name: string;
    titleSlot?: Slot;
    changeShow(visible: boolean): void;
}
interface TabContext {
    addPane(item: TabPaneContext): void;
    removePane(name: string): void;
}
export { TabsKey, TabContext, TabPaneContext };
