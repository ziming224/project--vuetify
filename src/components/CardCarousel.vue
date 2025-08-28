<template>
  <div>
    <h2 v-if="title" class="text-h5 mb-2">{{ title }}</h2>

    <swiper
      :breakpoints="breakpoints"
      class="mySwiper"
      :modules="[Navigation, Pagination]"
      navigation
      pagination
      :slides-per-view="3"
      :space-between="20"
      @progress="onProgress"
      @set-transition="onSetTransition"
    >
      <swiper-slide
        v-for="(item, i) in items"
        :key="i"
        class="parallax-slide"
      >
        <v-card
          class="d-flex flex-column h-100"
          elevation="4"
          hover
          @click="$emit('card-click', item)"
        >
          <div class="img-wrapper">
            <v-img
              cover=""
              height="200px"
              :src="item.image"
            />
          </div>
          <v-card-title class="pt-4">{{ item.title }}</v-card-title>
          <v-card-subtitle>{{ item.short }}</v-card-subtitle>
          <v-card-text class="flex-grow-1" style="font-size: 1.1rem;">
            地址：{{ item.address }}
          </v-card-text>
          <v-card-text class="flex-grow-1" style="font-size: 1.1rem;">
            聯繫方式：{{ item.phone }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn>查看更多</v-btn>
          </v-card-actions>
        </v-card>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
  import { Navigation, Pagination } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { ref } from 'vue'

  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'

  defineProps({
    items: { type: Array, required: true },
    title: { type: String, default: '' },
  })

  defineEmits(['card-click'])

  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 10 },
    600: { slidesPerView: 2, spaceBetween: 20 },
    960: { slidesPerView: 3, spaceBetween: 30 },
    1280: { slidesPerView: 3, spaceBetween: 30 },
  }

  const onProgress = swiper => {
    // 遍歷所有幻燈片來應用視差效果
    for (const slide of swiper.slides) {
      const progress = slide.progress // -1 到 1 之間，代表幻燈片相對於中心的偏移量
      const img = slide.querySelector('.v-img__img') // 直接選取幻燈片內的圖片元素
      if (img) {
        const parallax = progress * -40 // 視差強度，可調整此數值。負值表示與滑動方向相反。
        // 保留 Vuetify 的置中 transform，並疊加我們的位移效果
        img.style.transform = `translate(-50%, -50%) translateX(${parallax}px)`
      }
    }
  }

  const onSetTransition = (swiper, transition) => {
    for (const slide of swiper.slides) {
      const img = slide.querySelector('.v-img__img')
      if (img) {
        img.style.transitionDuration = `${transition}ms`
      }
    }
  }
</script>

<style scoped>
.mySwiper {
  width: 100%;
  padding: 20px 40px;
  position: relative;
}

.img-wrapper {
  overflow: hidden;
  /* v-card 已經有圓角，這裡可以移除，避免樣式衝突 */
}

/* 使用 :deep() 來影響子元件 v-img 的內部樣式 */
.mySwiper :deep(.v-img__img) {
  /* 讓圖片寬度大於容器，創造可移動的空間 */
  width: 130%;
  max-width: none; /* 覆蓋 Vuetify 可能的 max-width 限制 */
  will-change: transform;
}
</style>
