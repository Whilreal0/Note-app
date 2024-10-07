

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/main.css'
import 'boxicons'

const app = createApp(App)

app.use(router)

app.mount('#app')
