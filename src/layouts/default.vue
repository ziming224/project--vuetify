<template>
  <v-app-bar style="background-color: #E9FEEF; color: #00132B; ">
    <v-contaioer class="d-flex align-center">
      <v-app-bar-title class="px-5">毛孩救援站</v-app-bar-title>
      <template v-for="item of navItems" :key="item.to">
        <v-btn v-if="item.show" :prepend-icon="item.icon" :to="item.to">
          {{ item.title }}
          <!-- 購物車數量點 -->
          <v-badge v-if="item.to === '/cart' && user.cartTotal > 0" color="red" :content="user.cartTotal" floating />
        </v-btn>
      </template>
      <!-- 登出 -->
      <v-btn v-if="user.isLoggedIn" prepend-icon="mdi-logout" @click="logout">登出</v-btn>
    </v-contaioer>
  </v-app-bar>
  <v-main style="background-color: #F5EFE6;">
    <router-view :key="$route.fullPath" />
  </v-main>
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

  // 導覽連結，用v-for一次印
  const navItems = computed(() => [
    { title: 'HOME', to: '/', icon: 'mbi-home', show: true },
    { title: '救援單位', to: '/org', show: true },
    // { title: '協尋公告', to: '/post', show: true },
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
    // 登出回首頁
    router.push('/')
    createSnackbar({
      text: '登出成功！',
      snackbarProps: {
        color: 'green',
      },
    })
  }
</script>
