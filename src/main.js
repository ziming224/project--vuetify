/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// import vuetify from './plugins/vuetify'

import './assets/main.css'
// Styles
import 'unfonts.css'
import 'vuetify/styles'

const app = createApp(App)

// Pinia（含 persistedstate）在 plugins/index.js 裡註冊
registerPlugins(app)
app.mount('#app')
