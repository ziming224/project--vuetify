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
    >
      <swiper-slide v-for="(item, i) in items" :key="i" style="height: auto">
        <v-card
          class="d-flex flex-column h-100"
          elevation="4"
          hover
          @click="$emit('card-click', item)"
        >
          <v-img height="200px" :src="item.image" />
          <v-card-title class="pt-4">{{ item.title }}</v-card-title>
          <v-card-subtitle>{{ item.short }}</v-card-subtitle>
          <v-card-text class="flex-grow-1" style="font-size: 1.1rem;">地址：{{ item.address }}</v-card-text>
          <v-card-text class="flex-grow-1" style="font-size: 1.1rem;">聯繫方式：{{ item.phone }}</v-card-text>
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

  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'

  defineProps({
    items: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  })

  defineEmits(['card-click'])

  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 10 },
    // 在寬度大於 600px 的螢幕上，顯示 2 張卡片
    600: { slidesPerView: 2, spaceBetween: 20 },
    // 在寬度大於 960px 的螢幕上，顯示 3 張卡片
    960: { slidesPerView: 3, spaceBetween: 30 },
  }
</script>

<style scoped>
.mySwiper {
  width: 100%;
  padding: 20px 40px;
  position: relative;
}

.swiper-button-prev,
.swiper-button-next {
  color: #72a835;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 18px;
  font-weight: bold;
}

.swiper-button-prev {
  left: 0;
}

.swiper-button-next {
  right: 0;
}
</style>
