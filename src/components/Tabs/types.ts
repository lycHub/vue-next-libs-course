const TabsKey = 'TabsKey';

interface TabPaneContext {
  name: string;
  changeShow(visible: boolean): void;
}

interface TabContext {
  addPane(item: TabPaneContext): void;
  removePane(name: string): void;
}

export { TabsKey, TabContext, TabPaneContext };
