/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
import { zhHant } from 'vuetify/locale'

// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light', // 您可以在這裡設定預設主題，例如 'light' 或 'dark'
    themes: {
      light: {
        dark: false, // 標示這不是深色主題
        colors: {
          // --- Vuetify 預設顏色 ---
          'primary': '#1867C0',
          'secondary': '#5CBBF6',
          // --- 您自訂的顏色 ---
          'app-bar-scrolled-bg': '#C5E1A5', // 捲動後導覽列的背景色 (來自您 CSS 的 rgba(197, 225, 165, 0.8))
          'app-bar-bg': '#C5E1A5', // 捲動後導覽列的背景色 (來自您 CSS 的 rgba(197, 225, 165, 0.8))
          'nav-text': '#4E4E4E', // 導覽列文字顏色
          'main-background': '#F5EFE6', // 主要內容區的背景色
        },
      },
      dark: {
        dark: true, // 標示這是深色主題
        colors: {
          'primary': '#2196F3',
          'secondary': '#54B6B2',
          // --- 您自訂的顏色 (深色版本) ---
          'app-bar-scrolled-bg': '#2E401E', // 深色模式下的導覽列背景
          'nav-text': '#E0E0E0', // 深色模式下的導覽列文字
          'main-background': '#121212', // 深色模式下的主要背景
        },
      },
    },
  },
  locale: {
    locale: 'zhHant',
    messages: { zhHant },
  },
})
