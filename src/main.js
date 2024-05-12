import { createApp } from 'vue'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import App from './views/App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import toastPlugin from 'vue-toast-notification'

import 'vue-toast-notification/dist/theme-sugar.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

loadFonts()
const store = createPinia()

createApp(App).use(store).use(router).use(vuetify).use(toastPlugin).mount('#app')
