import { createApp } from 'vue';
import App from './App.vue';
import LibUses from './components';
import './assets/styles/index.scss';
createApp(App).use(LibUses).mount('#app')
