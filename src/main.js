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

// 新增：Pinia 初始化
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'  // 調整路徑，如果 stores 在 src/stores/

const app = createApp(App)

// 新增：創建 Pinia 並註冊到 app
const pinia = createPinia()
app.use(pinia)

// 新增：初始化 User Store（確保登入狀態從 persist 恢復）
const user = useUserStore()

registerPlugins(app)
app.mount('#app')
