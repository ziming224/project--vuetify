<template>
  <!-- permanent會一直顯示 -->
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item :prepend-avatar="`https://api.dicebear.com/9.x/thumbs/png/seed=${user.account}`" :title="user.account" />
    </v-list>
    <v-divider />
    <v-list>
      <v-list-item
        v-for="item of navItems"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
      />
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup>
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()

  const navItems = [
    { title: '首頁', to: '/', icon: 'mdi-home' },
    { title: '救援單位管理', to: '/admin/orgs' },
    { title: '商城管理', to: '/admin/products' },
    { title: '訂單資料', to: '/admin/orders' },
    { title: '會員管理', to: '/admin' },
  ]
</script>
