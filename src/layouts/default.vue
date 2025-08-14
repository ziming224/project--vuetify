```vue
<template>
  <v-app>
    <!-- 1. 將 Logo 移到 v-app-bar 外面，作為一個獨立的懸浮元件 -->
    <router-link class="fixed-logo-link" to="/">
      <img alt="毛孩救援站 Logo" class="fixed-logo" src="@/assets/logo.png">
    </router-link>

    <v-app-bar class="translucent-app-bar" flat>
      <!-- 3. 在 v-container 加上 padding-left，為 Logo 留出空間 -->
      <v-container class="d-flex align-center">
        <v-app-bar-title>毛孩救援站</v-app-bar-title>

        <template v-for="item of navItems" :key="item.to">
          <v-btn v-if="item.show" :prepend-icon="item.icon" :to="item.to">
            {{ item.title }}
            <v-badge v-if="item.to === '/cart' && user.cartTotal > 0" color="red" :content="user.cartTotal" floating />
          </v-btn>
        </template>

        <v-btn v-if="user.isLoggedIn" prepend-icon="mdi-logout" @click="logout">登出</v-btn>
      </v-container>
    </v-app-bar>

    <v-main style="background-color: #F5EFE6;">
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const createSnackbar = useSnackbar()
  const router = useRouter()

  const navItems = computed(() => [
    { title: 'HOME', to: '/', icon: 'mbi-home', show: true },
    { title: '救援單位', to: '/org', show: true },
    { title: '公益商城', to: '/shop', show: true },
    { title: '會員登入', to: '/login', show: !user.isLoggedIn },
    { title: '註冊', to: '/register', show: !user.isLoggedIn },
    { title: '購物車', to: '/cart', show: user.isLoggedIn },
    { title: '管理', to: '/admin', show: user.isLoggedIn && user.isAdmin },
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
</script>

<style scoped>
/* 2. 移除所有 overflow 的覆寫，讓 v-app-bar 恢復正常 */
.translucent-app-bar.v-toolbar {
  background-color: rgba(197, 225, 165, 0.8) !important;
  z-index: 1000;
}

/* Logo 連結樣式 (懸浮) */
.fixed-logo-link {
  /* 關鍵：使用 fixed 定位，使其脫離文檔流並相對於視窗定位 */
  position: fixed;
  top: 0;
  left: 24px;
  transform: translateY(-20%); /* 上移一點，製造「突出」效果 */
  /* 設定高於 v-app-bar 的 z-index (Vuetify 的 app-bar 通常在 1000-1006 之間) */
  z-index: 1100;
}

/* Logo 圖片樣式 */
.fixed-logo {
  height: 150px; /* 現在可以自由設定高度，不會被裁切 */
  width: auto; /* 保持比例 */
}
</style>
