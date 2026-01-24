import './assets/main.css'
import 'vuetify/styles'

import { createApp } from 'vue'
import Root from './Root.vue'
import router from './router'
import vuetify from './plugins/vuetify'

createApp(Root).use(router).use(vuetify).mount('#app')
