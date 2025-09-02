<template>
  <v-app>
    <!-- 🔹 Lottie Loading 元件畫面 -->
    <LoadingOverlay :show="loading" @update:show="loading = $event" />

    <v-app-bar app class="position-fixed elevation-4" color="primary" flat>
      <v-container class="d-flex align-center position-relative" fluid>

        <!-- 標題 (純定位用，可隱藏) -->
        <v-app-bar-title class="invisible">毛孩救援站</v-app-bar-title>

        <!-- 用img才好控制大小 -->
        <img alt="logo" class="logo-overlay" :src="logoSrc" @click="router.push('/')">

        <v-spacer />

        <!-- 導覽列 -->
        <template v-if="mdAndUp">
          <template v-for="item of navItems" :key="item.to">
            <v-btn
              v-if="item.show"
              class="nav-btn"
              :prepend-icon="item.icon"
              :to="item.to"
            >
              <span class="nav-btn__text">{{ item.title }}</span>
              <v-badge
                v-if="item.to === '/cart' && user.cartTotal > 0"
                color="red"
                :content="user.cartTotal"
                floating
              />
            </v-btn>
          </template>
          <v-btn
            v-if="user.isLoggedIn"
            prepend-icon="mdi-logout"
            @click="logout"
          >登出</v-btn>
        </template>
      </v-container>

      <!-- 漢堡選單 (小螢幕) -->
      <v-app-bar-nav-icon v-if="!mdAndUp" @click="drawer = !drawer" />
    </v-app-bar>

    <!-- 側邊導覽 (小螢幕) -->
    <v-navigation-drawer
      v-model="drawer"
      class="fixed-drawer"
      location="right"
      temporary
    >
      <v-list nav>
        <template v-for="item in navItems" :key="item.to">
          <v-list-item
            v-if="item.show"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            @click="drawer = false"
          >
            <template #append>
              <v-badge v-if="item.to === '/cart' && user.cartTotal > 0" color="red" :content="user.cartTotal" inline />
            </template>
          </v-list-item>
        </template>
        <v-divider v-if="user.isLoggedIn" />
        <v-list-item v-if="user.isLoggedIn" prepend-icon="mdi-logout" title="登出" @click="logoutAndCloseDrawer" />
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-background">
      <router-view :key="$route.fullPath" />
    </v-main>

    <v-footer class="text-center d-flex flex-column ga-2 py-15" color="footerBackground" padless>
      <div class="d-flex ">
        <v-btn
          v-for="icon in icons"
          :key="icon"
          density="comfortable"
          :icon="icon"
          variant="text"
        />
      </div>
      <v-divider class="my-2" thickness="2" width="50" />
      <div class="text-caption font-weight-regular opacity-60">
        Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
      </div>
      <v-divider />
      <div>
        {{ new Date().getFullYear() }} — <strong>泰山前端網頁設計班</strong>
      </div>
    </v-footer>

  </v-app>
</template>

<script setup>
  // import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { useSnackbar } from 'vuetify-use-dialog'
  import logoSrc from '@/assets/logo7.1.png'
  import LoadingOverlay from '@/components/LoadingOverlay.vue'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const createSnackbar = useSnackbar()
  const router = useRouter()

  // 響應式設計
  const { mdAndUp } = useDisplay()
  const drawer = ref(false)

  // 🔹 載入動畫狀態
  const loading = ref(true)

  // 模擬載入完成 (可改成 API 完成後再關閉)
  onMounted(() => {
    setTimeout(() => {
      loading.value = false
    }, 2000)
  })

  const navItems = computed(() => [
    { title: 'HOME', to: '/', show: true },
    { title: '救援單位', to: '/org', show: true },
    { title: '公益商城', to: '/shop', show: true },
    { title: '登入/註冊', to: '/auth', show: !user.isLoggedIn },
    { title: '購物車', to: '/cart', show: user.isLoggedIn },
    { title: '管理', to: '/admin', show: user.isLoggedIn && user.isAdmin },
    { title: '會員中心', to: '/member', show: user.isLoggedIn },
  ])

  const logout = async () => {
    try {
      await userService.logout()
    } catch (error) {
      console.error(error)
    }
    user.logout()
    router.push('/')
    createSnackbar({
      text: '登出成功！',
      snackbarProps: { color: 'green' },
    })
  }

  const logoutAndCloseDrawer = async () => {
    await logout()
    drawer.value = false
  }
  const icons = [
    'mdi-facebook',
    'mdi-twitter',
    'mdi-linkedin',
    'mdi-instagram',
  ]
</script>

<style scoped>
.main-background {
  background-color: rgb(var(--v-theme-main-background));
}
.mySwiper {
  width: 100%;
  padding: 20px 40px;
  position: relative;
}
@media (max-width: 600px) {
  .fixed-logo {
    max-height: 60px;
    max-width: 150px;
    top: -15px;
    left: 10px;
  }
}
.nav-btn .nav-btn__text {
  text-decoration: none;
  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 6px;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.2s ease-in-out;
}
.nav-btn:hover .nav-btn__text,
.nav-btn.v-btn--active .nav-btn__text {
  text-decoration-color: #6A9C89;
}
.v-application .v-app-bar {
  z-index: 9999;
}

.logo-overlay {
  position: absolute;
  left: 5px; /* 調整水平位置，增加一些邊距 */
  top: -140px; /* 向上偏移更多，讓 Logo 更突出 */
  z-index: 10; /* 確保 Logo 在最上層 */
  width: 400px !important; /* 🔥 您可以在這裡自由調整 Logo 的寬度 */
  height: auto; /* 高度自動，保持比例 */
  transition: all 0.3s ease; /* 加入過渡效果，讓變化更平滑 */
  cursor: pointer;
}
/* logo圖片小螢幕 */
@media (max-width: 600px) {
  .logo-overlay {
    width: 210px !important;
    left: 0;
    top: -55px;
  }
}

/* 讓標題佔位，但看不到 */
.invisible {
  visibility: hidden;
}

/* 讓 App Bar 的內容可以超出範圍 */
:deep(.v-toolbar__content) {
  overflow: visible;
}

.fixed-drawer {
  position: fixed !important; /* 固定 */
  top: 0;
  right: 0;
  height: 100vh !important; /* 滿版 */
  z-index: 2000; /* 確保在上層 */
}

</style>
