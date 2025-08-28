/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { zhHant } from 'vuetify/locale'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#F5EFE6', // 主題色
          secondary: '#424242', // 次要主題色（輔助元素）
          accent: '#A7D7C5', // 輔助色（強調元素）
          error: '#FF5252', // 錯誤狀態（錯誤訊息）
          info: '#2196F3', // 資訊通知
          success: '#4CAF50', // 成功狀態
          warning: '#FFC107', // 警告狀態
          background: '#F5EFE6', // 全局背景色
          appBarBackground: '#fffde8c3', // 導覽列背景色
          mainBackground: '#ffc46cff', // 主內容背景色
          footerBackground: '#D0E0D0',
          // sectionOrg: '#f2ffecff',
          // 救援單位卡片顏色 (使用 accent)
          // sectionShop: '#e6f5f0ff',
          // 公益商城卡片顏色 (使用 primary)
          // sectionLost: '#f7f6ffff',
          // 遺失啟示卡片顏色 (使用 warning)
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#90CAF9',
          secondary: '#B0BEC5',
          accent: '#8C9EFF',
          error: '#CF6679',
          info: '#0288D1',
          success: '#66BB6A',
          warning: '#FFA726',
          background: '#121212',
          appBarBackground: '#1E1E1E',
          mainBackground: '#121212',
        },
      },
    },
  },
  locale: {
    locale: 'zhHant',
    messages: { zhHant },
  },
})
