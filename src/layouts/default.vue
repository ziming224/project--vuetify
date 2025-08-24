<template>

  <v-app>
 <!-- 🔹 Lottie Loading 元件畫面 -->
<LoadingOverlay :show="loading" @update:show="loading = $event" />

    <v-app-bar app flat scroll-behavior="fade-image">
      <v-img
        class="fixed-logo"
        contain
        max-height="80"
        max-width="200"
        :src="logoSrc"
        :style="{ position: 'absolute', top: '-20px', left: '20px', zIndex: 10 }"
      />
      <v-spacer />
      <v-container class="d-flex align-center">
        <v-app-bar-title>毛孩救援站</v-app-bar-title>

        <template v-for="item of navItems" :key="item.to">
          <v-btn v-if="item.show" class="nav-btn" :prepend-icon="item.icon" :to="item.to">
            {{ item.title }}
            <v-badge v-if="item.to === '/cart' && user.cartTotal > 0" color="red" :content="user.cartTotal" floating />
          </v-btn>
        </template>
        <v-btn v-if="user.isLoggedIn" prepend-icon="mdi-logout" @click="logout">登出</v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="main-background">
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script setup>
  import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

  const user = useUserStore()
  const createSnackbar = useSnackbar()
  const router = useRouter()
  const logoSrc = '@/assets/logo.png'

  // 🔹 載入動畫狀態
  const loading = ref(true)

  // 模擬載入完成 (可改成 API 完成後再關閉)
  onMounted(() => {
    setTimeout(() => {
      loading.value = false
    }, 2000)
  })

  const navItems = computed(() => [
    { title: 'HOME', to: '/', icon: 'mdi-home', show: true },
    { title: '救援單位', to: '/org', show: true },
    { title: '公益商城', to: '/shop', show: true },
    { title: '登入/註冊', to: '/auth', show: !user.isLoggedIn },
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
.nav-btn {
  position: relative;
  overflow: hidden;
}
.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease-in-out;
}
.nav-btn.v-btn--active::after {
  width: 50%;
}
.v-app-bar {
  position: fixed !important;
  z-index: 1000 !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background-color: var(--v-app-bar-background);
}
</style>
