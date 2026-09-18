import '@/app/styles/main.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './providers/router/index.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
