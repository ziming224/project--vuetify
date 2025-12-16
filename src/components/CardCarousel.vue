<template>
  <div>
    <h2 v-if="title" class="text-h5 mb-2">{{ title }}</h2>
<!-- v-if="title" 在 title 這個屬性 (prop) 有值的情況下，渲染 <h2> 標題 -->
    <swiper
      :breakpoints="breakpoints"
      class="mySwiper"
      :modules="[Navigation, Pagination]"
      navigation
      pagination
      :slides-per-view="3"
      :space-between="20"
      watch-slides-progress
      @progress="onProgress"
      @setTransition="onSetTransition"
    >
    <!-- navigation & pagination: 導航箭頭&底部分頁圓點。 -->
    <!-- setTransition滾動時會持續觸發 progress 事件 -->
    <!-- watch-slides-progress關鍵：啟用 progress 計算 -->
      <swiper-slide
        v-for="(item, i) in items"
        :key="i"
      >
      <!-- 每張卡片 -->

    <v-card
      class="d-flex flex-column h-100"
      hover
      @click="$emit('card-click', item)"
    >
    <!-- 點卡片會通知父元件 -->
    <div class="img-wrapper">
      <!-- 裁切畫面 -->
      <div class="parallax-img">
      <!-- 唯一被 transform 的元素 -->
        <v-img
          cover
          height="200"
          :src="item.image"
        />
        <!-- Vuetify 控制比例 -->
      </div>

            <v-btn
              class="favorite-btn"
              :color="favorites.includes(item._id) ? 'red' : '#BDBDBD'"
              :icon="favorites.includes(item._id) ? 'mdi-heart' : 'mdi-heart-outline'"
              size="small"
              variant="text"
              @click.stop="$emit('favorite-click', item)"
            />
          </div>
          <v-card-title class="pt-4">{{ item.title }}</v-card-title>
          <v-card-subtitle>{{ item.short }}</v-card-subtitle>
          <v-card-text class="card-info-text">
            <div class="truncate-text">地址：{{ item.address }}</div>
            <div class="truncate-text">聯繫方式：{{ item.phone }}</div>
          </v-card-text>
          <v-spacer />
          <v-card-actions>
            <v-spacer />
            <v-btn @click.stop="$emit('card-click', item)">查看更多</v-btn>
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

  // 宣告父組件傳入子組件的資料，設定類型、是否必填及預設值
  defineProps({
    // 陣列，包含所有要在輪播中顯示的卡片資料
    items: { type: Array, required: true },
    // 輪播上方的標題
    title: { type: String, default: '' },
    // 接收使用者已收藏項目的 ID
    favorites: {
      type: Array,
      default: () => [],
    },
  })

// 聲明 card-click 事件
  defineEmits(['card-click', 'favorite-click'])

//  Swipe卡片響應式
  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 10 },
    600: { slidesPerView: 2, spaceBetween: 20 },
    960: { slidesPerView: 3, spaceBetween: 30 },
    1280: { slidesPerView: 3, spaceBetween: 30 },
  }

  // 視差效果-使用者拖動輪播時被持續觸發
  const onProgress = swiper => {
    // 遍歷所有幻燈片來應用視差效果
    for (const slide of swiper.slides) {
      // -1 到 1 之間，代表幻燈片相對於中心的偏移量
      const progress = slide.progress 
      const img = slide.querySelector('.parallax-img')
      if (img) {
        const parallax = progress * -40 // 視差強度，可調整此數值。負值表示與滑動方向相反。
        // 保留 Vuetify 的置中 transform，並疊加我們的位移效果
        img.style.transform = `translate3d(${parallax}px, 0, 0)`
      }
    }
  }
// 同步動畫速度跟 Swiper 滑動速度一致
  const onSetTransition = (swiper, transition) => {
    for (const slide of swiper.slides) {
      const img = slide.querySelector('.parallax-img')
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
  position: relative;
}

.parallax-img {
  width: 130%;
  height: 100%;
  will-change: transform;
  transform: translateX(0);
}

.mySwiper :deep(.v-img) {
  overflow: hidden;
}


.card-info-text {
  font-size: 1.1rem;
  padding-bottom: 0.5rem; /* 稍微留一點底部空間 */
}

/* CSS 截斷樣式 */
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  font-size: 20px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.7));
}

 /* 懸停時放大效果 */
.favorite-btn:hover {
  transform: scale(1.1);
}
</style>
