<template>
  <v-app>
    <v-app-bar app :class="appBarClass" flat scroll-behavior="elevate">
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
  import { debounce } from 'lodash' // 需要安裝 lodash
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import AnimatedUnderline from '@/components/AnimatedUnderline.vue'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const createSnackbar = useSnackbar()
  const router = useRouter()

  const logoSrc = '@/assets/logo.png'

  const isScrolled = ref(false)

  const handleScroll = debounce(() => {
    isScrolled.value = window.scrollY > 50
  }, 100)

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const appBarClass = computed(() => (isScrolled.value ? 'scrolled-app-bar' : 'top-app-bar'))

  const navItems = computed(() => [
    { title: 'HOME', to: '/', icon: 'mbi-home', show: true },
    { title: '救援單位', to: '/org', show: true },
    { title: '公益商城', to: '/shop', show: true },
    { title: '登入/註冊', to: '/auth', show: !user.isLoggedIn },
    // { title: '註冊', to: '/register', show: !user.isLoggedIn },
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
.v-app-bar.v-toolbar {
  transition: background-color 0.4s ease, box-shadow 0.4s ease !important;
  z-index: 1000 !important; /* 確保導覽列在最上層 */
}

.top-app-bar {
  background-color: transparent !important;
}

.scrolled-app-bar {
  background-color: rgba(var(--v-theme-app-bar-scrolled-bg-rgb), 0.8) !important;
}

.main-background {
  background-color: rgb(var(--v-theme-main-background));
}

.fixed-logo {
  padding: 10px;
  border-radius: 10px;
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
</style>
