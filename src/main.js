import { createApp } from 'vue'

import App from '@/App.vue'
import pinia from '@/stores'
import router from '@/router'
import 'normalize.css'
import 'uno.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

import { catchErrorMessage } from '@/utils/message'
window.catchErrorMessage = catchErrorMessage

import directives from '@/directives'
app.use(directives)

app.config.globalProperties.console = window.console

app.mount('#app')
