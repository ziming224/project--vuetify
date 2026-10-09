<template>
  <div />
</template>

<script setup>
  import { useRouter } from 'vue-router'

  // /member 本身沒有內容（側邊選單在 member.vue），直接導到個人資料
  const router = useRouter()
  router.replace('/member/profile')
</script>

<route lang="yaml">
  meta:
    title: '會員中心'
    login: 'login-only'
    admin: false
</route>
