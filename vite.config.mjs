import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Fonts from 'unplugin-fonts/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
// Utilities
import { defineConfig } from 'vite'

import { VitePWA } from 'vite-plugin-pwa'
import Layouts from 'vite-plugin-vue-layouts-next'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    VitePWA({
      devOptions: {
        enabled: true,
      },
      // 設定自動更新
      registerType: 'autoUpdate',
      //
      workbox: {
        // 清除已過期快取
        cleanupOutdatedCaches: true,
        // 快取檔案的路徑，現在是設定所有檔案
        globPatterns: ['**/*'],
        // 忽略網址參數，不同參數當作相同檔案
        // a.jpg = a.jpg?fbclid=1234
        ignoreURLParametersMatching: [/.*/],
      },
      // 網站設定
      manifest: {
        name: 'MyWebSite',
        short_name: 'MySite',
        icons: [
          {
            src: '/web-app-manifest-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        theme_color: '#f7ebd8',
        background_color: '#f2fff9',
        // 顯示模式
        display: 'standalone',
        start_url: './',
        // 應用程式範圍 超出會開啟瀏覽器
        scope: './',
      },
    }),
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    Fonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        {
          pinia: ['defineStore', 'storeToRefs'],
        },
      ],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
