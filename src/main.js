import { createApp } from 'vue'

import store from './store';
import router from './router';

import App from './App.vue'
import './index.css'


createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
