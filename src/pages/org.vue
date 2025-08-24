<template>
  <v-container>
    <!-- Row 1 -->
    <CardCarousel class="mb-6 parallax-carousel" :items="items1" title="北部" @card-click="openDialog" />

    <!-- Row 2 -->
    <CardCarousel class="mb-6 parallax-carousel" :items="items2" title="中部" @card-click="openDialog" />

    <!-- Row 3 -->
    <CardCarousel class="parallax-carousel" :items="items3" title="南部" @card-click="openDialog" />
    <!-- 點開畫面 -->
    <v-dialog v-model="dialog" max-width="650px">
      <v-card v-if="selected">
        <v-img cover height="300px" :src="selected.image" />
        <v-card-title>{{ selected.title }}</v-card-title>
        <v-card-text>{{ selected.phone }}</v-card-text>
        <v-card-text>{{ selected.address }}</v-card-text>
        <v-card-text>{{ selected.detail }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { nextTick, onMounted, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import CardCarousel from '@/components/CardCarousel.vue'
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
      const { data } = await orgService.get()
      // 後端回傳的資料結構是 { success: true, orgs: [...] }
      // 並且 orgs 陣列中的物件包含 name, description, image 等欄位
      const allOrgs = data.orgs.map(org => ({
        title: org.name, // 將後端的 name 欄位對應到前端的 title
        short: org.description, // 將後端的 description 對應到 short
        detail: org.description, // 將後端的 description 對應到 detail
        image: org.image,
        category: org.category,
        address: org.address,
        phone: org.phone,
      }))

      // 根據 category 欄位將組織分類
      // 請根據您後端的實際分類名稱修改以下字串
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

    carousels.forEach(carousel => {
      // 假設 CardCarousel 元件內部使用 <swiper-container>
      const swiperEl = carousel.querySelector('swiper-container')
      if (swiperEl?.swiper) {
        const swiper = swiperEl.swiper
        swiper.on('progress', () => {
          for (const slide of swiper.slides) {
            const slideProgress = slide.progress
            const imgElement = slide.querySelector('.v-img__img')
            if (imgElement) {
              const parallax = slideProgress * -40 // 視差強度，可調整
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
      } else {
        console.warn('找不到 Swiper 實例來應用視差效果。')
      }
    })
  }

  // 在元件掛載時呼叫 fetchOrgs
  onMounted(fetchOrgs)
</script>

<style scoped></style>
