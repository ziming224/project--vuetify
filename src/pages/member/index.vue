<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold my-4">會員中心</h1>
    <v-row>
      <v-col cols="12" md="3">
        <v-card rounded="lg" border>
          <v-list nav>
            <v-list-item
              v-for="(item, i) in navItems"
              :key="i"
              :to="item.to"
              :title="item.title"
              :prepend-icon="item.icon"
              rounded="lg"
            />
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card rounded="lg" border>
          <v-card-text>
            <router-view />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const navItems = [
  { title: '個人資料', to: '/member/profile', icon: 'mdi-account-circle-outline' },
  { title: '我的訂單', to: '/member/orders', icon: 'mdi-receipt-text-outline' },
  { title: '我的收藏', to: '/member/wishlist', icon: 'mdi-heart-outline' },
  // 未來可以新增更多項目，例如：
  // { title: '修改密碼', to: '/member/password', icon: 'mdi-lock-outline' },
]

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.path === '/member') {
    router.replace('/member/profile')
  }
})
</script>
<route lang="yaml">
  meta:
    title: '會員中心'
    login: 'login-only'
    admin: false
</route>