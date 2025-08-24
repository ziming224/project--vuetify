<template>
  <v-overlay
    :model-value="show"
    class="d-flex align-center justify-center"
    persistent
    scrim="rgba(255,255,255,1)"
    @update:model-value="$emit('update:show', $event)"
  >
    <DotLottieVue
      style="height: 600px; width: 600px"
      autoplay
      loop
      :src="animationSrc"
    />
  </v-overlay>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { defineProps } from 'vue'

const props = defineProps({
  show: Boolean,
  animationSrc: {
    type: String,
    default: '/animations/SaladCat.lottie'
  }
})
</script>
