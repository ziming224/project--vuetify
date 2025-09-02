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

<style scoped>
.custom-container {
  max-width: calc(100% - 600px); /* 總共左右各 200px */
  margin: 0 auto;               /* 置中 */
  padding-left: 0 !important;   /* 移除 container 預設 padding */
  padding-right: 0 !important;
}

/* 大於 960px (md breakpoint) 才套用 */
@media (max-width: 959px) {
  .custom-container {
    max-width: 100%;
    margin: 0;
  }
}</style>
