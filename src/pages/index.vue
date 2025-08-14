<template>
  <v-container class="pa-0 hero-section" fluid>
    <!-- Hero 圖 -->
    <v-img
      class="hero-image"
      cover
      src="../assets/田園小道上的三隻貓.png"
    >
      <div class="d-flex align-center justify-center fill-height text-white">
        <!-- <h1 class="display-1">毛孩救援網</h1> -->
      </div>
    </v-img>

    <!-- 雲朵遮蓋圖 -->
    <img alt="雲朵遮蓋" class="cloud-divider" src="../assets/cloud.png">

    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn density="compact">Compact Button</v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn density="comfortable">Comfortable Button</v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn density="default">Default Button</v-btn>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>

</script>

<style scoped>d
.hero-section {
  position: relative;
  overflow: hidden;
}

.cloud-divider {
  position: absolute;
  bottom: -5px; /* 可以調整雲朵遮住多少 */
  left: 0;
  width: 100%;
  z-index: 2;
  pointer-events: none; /* 讓滑鼠事件穿透 */
}
</style>

<route lang="yaml">
  meta:
    # 標題
    title: '首頁'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
