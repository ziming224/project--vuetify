/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-duplicates
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router/auto'
// eslint-disable-next-line import/no-duplicates
import { routes } from 'vue-router/auto-routes'
import userService from '@/services/user'
import { useUserStore } from '@/stores/user'

// createRouter({...})建立一個新的 Vue Router 實例，讓整個 Vue 應用能支援「分頁跳轉」、「網址管理」等功能。
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
  scrollBehavior (to, from, savedPosition) {
    // 總是在頁面切換時捲動到最頂部
    // behavior: 'smooth'，捲動平滑動畫效果
    return { top: 0, behavior: 'smooth' }
  },
})

// 在每次路由跳轉前執行一些檢查或邏輯
router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  // 第一次進入網站初始導航時，如果有 token，取使用者資料
  if (from === START_LOCATION && user.isLoggedIn) {
    try {
      const { data } = await userService.profile()
      user.login(data.user)
    } catch (error) {
      console.error(error)
      user.token = ''
    }
  }

  // 根據登入狀態和頁面路徑進行導航守衛
  if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
    // 去未登入限定頁面，註冊頁和登入頁，且使用者有登入，導航回首頁
    next('/')
  } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
    // 去登入限定頁面，且使用者沒有登入，導航到登入頁
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    // 去管理員限定頁面，且使用者不是管理員，導航回首頁
    next('/')
  } else {
    // 不阻擋
    next()
  }
})
// 進到頁面改標題
router.afterEach(to => {
  const baseTitle = '毛孩救援站'
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
