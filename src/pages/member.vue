<template>
  <v-container class="custom-container" fluid style="margin-top: 50px;margin-bottom: 50px;">
    <h1 class="text-h4 font-weight-bold my-4">會員中心</h1>
    <v-row>
      <v-col cols="12" md="3">
        <v-card border rounded="lg">
          <v-list nav>
            <v-list-item
              v-for="(item, i) in navItems"
              :key="i"
              :prepend-icon="item.icon"
              rounded="lg"
              :title="item.title"
              :to="item.to"
            />
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card border rounded="lg">
          <v-card-text>
            <!-- 子頁面將會顯示在這裡 -->
            <router-view />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  const navItems = [
    { title: '個人資料', to: '/member/profile', icon: 'mdi-account-circle-outline' },
    { title: '我的訂單', to: '/member/orders', icon: 'mdi-receipt-text-outline' },
    { title: '我的收藏', to: '/member/favorites', icon: 'mdi-heart-outline' },
  // { title: '修改密碼', to: '/member/password', icon: 'mdi-lock-outline' },
  ]
</script>
