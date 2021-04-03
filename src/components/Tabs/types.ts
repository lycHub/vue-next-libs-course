const TabsKey = 'TabsKey';

interface TabPaneContext {
  name: string;
}

interface TabContext {
  addPane(item: TabPaneContext): void;
  removePane(name: string): void;
}

export { TabsKey, TabContext, TabPaneContext };
