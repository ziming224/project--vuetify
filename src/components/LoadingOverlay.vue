<template>
  <v-overlay
    class="d-flex align-center justify-center"
    v-model="show"
    persistent
    scrim="rgba(255,255,255,1)"
  >
  <!-- persistent遮罩持久scrim遮罩被景色 -->
    <DotLottieVue
      autoplay
      loop
      :src="animationSrc"
      style="height: 600px; width: 600px"
    />
    <!-- 元件來自 @lottiefiles/dotlottie-vue 函式庫，專門用來播放 Lottie 格式的動畫。 -->
     <!-- loop 讓它無限循環播放，直到遮罩消失 -->
  </v-overlay>
</template>

<script setup>
  import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
  import { defineModel, defineProps } from 'vue'

  // 使用語法糖 defineModel 進行雙向綁定。
  const show = defineModel('show', { type: Boolean, default: false })

  // defineProps 專注於處理單向的 prop
  defineProps({
    animationSrc: {
      type: String,
      default: () => `${import.meta.env.BASE_URL}SaladCat.lottie`,
    },
  })
</script>
