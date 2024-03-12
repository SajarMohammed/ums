import './index.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import  setupInterceptors  from '@/composables/RefreshToken'
import VueAwesomePaginate from 'vue-awesome-paginate';
setupInterceptors();

createApp(App).component('vue-awesome-paginate', VueAwesomePaginate).use(router).mount('#app')
