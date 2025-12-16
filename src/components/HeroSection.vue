<template>
  <div ref="heroSection" class="hero-section">
    <v-img
      class="hero-img"
      cover
      :src="imageSrc"
    >
      <div class="hero-text">
        <h1 class="text-h2 font-weight-bold">{{ title }}</h1>
        <p class="text-h5 font-weight-bold">{{ subtitle }}</p>
      </div>
    </v-img>
  </div>
</template>

<script setup>
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { onMounted, ref } from 'vue'

  const heroSection = ref(null)

  defineProps({
    imageSrc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '公益商城',
    },
    subtitle: {
      type: String,
      default: '每月與不同單位合作您下的一筆訂單能讓毛孩們多一份溫飽',
    },
  })

  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)

    const el = heroSection.value

    gsap.fromTo(
      el,
      { scale: 1, y: 0 },
      {
        scale: 0.5, // 縮小到一半
        y: -200, // 上移
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: true, // 關鍵，會固定在上方
          pinSpacing: false, // 避免多餘空白
        },
      },
    )
  })

</script>

<style scoped>
.hero-section {
  height: 100vh;
  overflow: hidden;
}

.hero-img {
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
}

.hero-text {
  text-align: center;
  color: white;
  text-shadow: 5px 3px 6px rgba(0, 0, 0, 0.6);
  margin-top: -50px;
}
</style>
