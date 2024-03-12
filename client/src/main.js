import './index.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import  setupInterceptors  from '@/composables/RefreshToken'
setupInterceptors();
createApp(App).use(router).mount('#app')
