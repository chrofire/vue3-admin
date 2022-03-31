import { createApp } from 'vue'

import App from '@/App.vue'
import pinia from '@/stores'
import router from '@/router'
import 'normalize.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.config.globalProperties.console = window.console

app.mount('#app')
