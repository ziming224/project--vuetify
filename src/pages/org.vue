<template>
  <v-container class="hero-section d-flex align-center justify-center" fluid>
    <div class="overlay" />
    <!-- 毛玻璃層 -->
    <!-- 文字內容 -->
    <div class="text-center content">
      <h1 class="text-h2 font-weight-bold mb-5">民間貓狗救援團體</h1>
      <p class="text-h5 font-weight-regular">
        遇見受傷嚴重貓狗可以參考以下救援團體 <br>
        若無明顯外傷需要安置能撥打1959台灣全國統一的動物保護專線，或1999市民服務熱線
      </p>

    </div>
  </v-container>

  <v-container>
    <!-- Row 1: 北部 -->
    <div class="text-center my-8 my-md-12">
      <h2 class="text-h4 font-weight-bold text-secondary">北部</h2>
      <v-responsive class="mx-auto mt-2" max-width="120">
        <v-divider />
      </v-responsive>
    </div>
    <CardCarousel class="mb-6 parallax-carousel" :items="items1" @card-click="openDialog" />

    <!-- Row 2: 中部 -->
    <div class="text-center my-8 my-md-12">
      <h2 class="text-h4 font-weight-bold text-secondary">中部</h2>
      <v-responsive class="mx-auto mt-2" max-width="120">
        <v-divider />
      </v-responsive>
    </div>
    <CardCarousel class="mb-6 parallax-carousel" :items="items2" @card-click="openDialog" />

    <!-- Row 3: 南部 -->
    <div class="text-center my-8 my-md-12">
      <h2 class="text-h4 font-weight-bold text-secondary">南部</h2>
      <v-responsive class="mx-auto mt-2" max-width="120">
        <v-divider />
      </v-responsive>
    </div>
    <CardCarousel class="parallax-carousel" :items="items3" @card-click="openDialog" />
    <!-- 點開畫面 -->
    <v-dialog v-model="dialog" max-width="600px" scrollable>
      <v-card v-if="selected" class="org-dialog-card">
        <v-img
          class="align-end"
          cover
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="250px"
          :src="selected.image"
        >
          <v-card-title class="text-white text-h5" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.7);">
            {{ selected.title }}
          </v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
          <v-icon class="mr-1" icon="mdi-map-marker" size="small" />
          {{ selected.address }}
        </v-card-subtitle>

        <v-card-text class="pt-2 pb-0">
          <p class="text-body-1" style="white-space: pre-line;">
            {{ selected.detail }}
          </p>
        </v-card-text>

        <v-list class="py-0" density="compact">
          <v-divider class="mx-4 my-2" />
          <v-list-subheader>聯絡資訊</v-list-subheader>
          <!-- 點擊撥號 -->
          <v-list-item
            v-if="selected.phone"
            class="link-item"
            :href="`tel:${selected.phone}`"
            prepend-icon="mdi-phone"
            rel="noopener noreferrer"
            target="_blank"
            :title="selected.phone"
          />          <v-list-item
            v-if="selected.fb"
            class="link-item"
            :href="selected.fb"
            prepend-icon="mdi-facebook"
            rel="noopener noreferrer"
            target="_blank"
            title="Facebook 粉專"
          />
          <v-list-item
            v-if="selected.website"
            class="link-item"
            :href="selected.website"
            prepend-icon="mdi-web"
            rel="noopener noreferrer"
            target="_blank"
            title="官方網站"
          />
          <!-- 點擊寄信 -->
          <v-list-item
            v-if="selected.mail"
            class="link-item"
            :href="`mailto:${selected.mail}`"
            prepend-icon="mdi-email"
            rel="noopener noreferrer"
            target="_blank"
            :title="selected.mail"
          />
          <v-divider v-if="selected.openingHours" class="mx-4 my-2" />
          <v-list-subheader v-if="selected.openingHours">
            營運時間
          </v-list-subheader>
          <v-list-item v-if="selected.openingHours" prepend-icon="mdi-clock-outline">
            <v-list-item-title style="white-space: pre-line; line-height: 1.6;">
              {{ selected.openingHours || '尚未提供' }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="dialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { nextTick, onMounted, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import heroImage from '@/assets/hero-org2.jpg'
  import CardCarousel from '@/components/CardCarousel.vue'
  import HeroSection from '@/components/HeroSection.vue'
  import orgService from '@/services/org'

  const createSnackbar = useSnackbar()

  const dialog = ref(false)
  const selected = ref(null)

  // 將 items1, items2, items3 初始化為空陣列，等待從後端獲取資料
  const items1 = ref([])
  const items2 = ref([])
  const items3 = ref([])

  const openDialog = item => {
    selected.value = item
    dialog.value = true
  }

  // 獲取並處理組織資料的函式
  const fetchOrgs = async () => {
    try {
      // 步驟 1: 透過 orgService 向後端 API 發送請求，獲取原始資料
      const { data } = await orgService.get()
      // 步驟 2: 使用 .map() 將後端回傳的資料 (data.orgs) 轉換為前端元件所需的格式
      const allOrgs = data.orgs.map(org => {
        // 為了讓卡片高度一致，我們需要截斷描述文字。
        // 這裡我們取前 40 個字元，如果原始描述更長，則在後面加上 "..."
        const shortDescription = org.description.length > 40
          ? org.description.substring(0, 40) + '...'
          : org.description

        return {
          // 將後端欄位 (如 org.name) 映射到前端屬性 (如 title)
          title: org.name,
          short: shortDescription, // 卡片上顯示的簡短描述
          detail: org.description, // 彈出視窗中顯示的完整描述
          image: org.image,
          category: org.category,
          address: org.address,
          phone: org.phone,
          mail: org.mail,
          fb: org.fb,
          website: org.website,
          openingHours: org.openingHours
        }
      })

      // 步驟 3: 根據分類將處理好的資料分配到不同的輪播圖中
      items1.value = allOrgs.filter(org => org.category === '北部')
      items2.value = allOrgs.filter(org => org.category === '中部')
      items3.value = allOrgs.filter(org => org.category === '南部')

      // 等待 DOM 更新後再設定視差效果
      await nextTick()
      setupCarouselParallax()
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '無法載入組織資料，請稍後再試',
        snackbarProps: { color: 'red' },
      })
    }
  }

  // 設定輪播圖圖片水平視差滾動效果的函式
  const setupCarouselParallax = () => {
    // 選取所有指定了視差效果的輪播圖
    const carousels = document.querySelectorAll('.parallax-carousel')

    for (const carousel of carousels) {
      // 假設 CardCarousel 元件內部使用 <swiper-container>
      const swiperEl = carousel.querySelector('swiper-container')
      if (!swiperEl) {
        console.warn('在 .parallax-carousel 中找不到 swiper-container 元素。')
        continue
      }

      const setupEvents = swiper => {
        swiper.on('progress', () => {
          for (const slide of swiper.slides) {
            const slideProgress = slide.progress
            const imgElement = slide.querySelector('.v-img__img')
            if (imgElement) {
              // 視差強度，可調整 -40 這個數值
              const parallax = slideProgress * -40
              imgElement.style.transform = `translateX(${parallax}px)`
            }
          }
        })

        swiper.on('setTransition', (swiper, transition) => {
          for (const slide of swiper.slides) {
            const imgElement = slide.querySelector('.v-img__img')
            if (imgElement) {
              imgElement.style.transition = `${transition}ms`
            }
          }
        })
      }

      // 處理 Swiper 實例可能尚未初始化的情況。
      // 如果已經初始化，直接設定事件。
      if (swiperEl.swiper) {
        setupEvents(swiperEl.swiper)
      } else {
        // 否則，監聽 'swiperinit' 事件，確保在初始化後才設定。
        swiperEl.addEventListener('swiperinit', e => {
          const [swiper] = e.detail
          setupEvents(swiper)
        }, { once: true })
      }
    }
  }

  // 在元件掛載時呼叫 fetchOrgs
  onMounted(fetchOrgs)
</script>

<style scoped>
  .link-item :deep(.v-list-item-title) {
    color: rgb(var(--v-theme-secondary));
    font-weight: 500;
    transition: opacity 0.2s ease-in-out;
  }

  .link-item:hover :deep(.v-list-item-title) {
    opacity: 0.8;
    text-decoration: underline;
  }

.hero-section {
  position: relative;
  min-height: 80vh;
  background: url('@/assets/hero-org.jpg') no-repeat center center;
  background-size: cover;
  color: white;
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
   /* 半透明黑，讓文字更清楚 */
  backdrop-filter: blur(3px); /* 毛玻璃模糊 */
}

.content {
  position: relative; /* 確保文字在 overlay 上面 */
  z-index: 1;
}

.content h1, .content p {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 1s ease forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
p {
  line-height: 1.7;
}
</style>
