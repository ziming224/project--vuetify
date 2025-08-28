<template>
  <!-- Hero Banner -->
  <HeroSection
    :image-src="heroImage"
    subtitle="您的每一次消費，都在為毛孩們累積幸福"
    title="公益商城"
  />

  <v-container>
    <!-- Page Title -->
    <!-- <v-row class="my-5">
      <v-col class="text-center" cols="12">
        <h1 class="text-h3 font-weight-bold">公益商城</h1>
        <h4 class="text-h6 font-weight-light text-medium-emphasis">您的每一次消費，都在為毛孩們累積幸福</h4>
      </v-col>
    </v-row>
    -->

    <!-- Filters and Sorting -->
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="8">
        <v-chip-group v-model="selectedCategory" mandatory selected-class="text-primary" @update:model-value="page = 1">
          <v-chip filter :value="''" variant="outlined">
            全部
          </v-chip>
          <v-chip
            v-for="option in categoryOptions"
            :key="option"
            filter
            :value="option"
            variant="outlined"
          >
            {{ option }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col class="d-flex align-center" cols="12" md="4">
        <v-text-field
          v-model="search"
          class="mr-2"
          clearable
          density="compact"
          flat
          hide-details
          placeholder="搜尋商品"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          @update:model-value="page = 1"
        />
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-sort"
              :ripple="false"
              variant="text"
            />
            {{ sortOptions[selectedSort].text }}
          </template>
          <v-list>
            <v-list-item
              v-for="(option, i) in sortOptions"
              :key="option.text"
              :active="selectedSort === i"
              @click="selectedSort = i; page = 1"
            >
              <v-list-item-title>{{ option.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-divider class="mb-8" />

    <!-- Products Grid -->
    <v-row v-if="filteredProducts.length > 0">
      <v-col
        v-for="product in currentPageProducts"
        :key="product._id"
        cols="12"
        lg="4"
        md="6"
      >
        <!-- <ProductCard v-bind="product" /> -->
        <ProductCard
          v-bind="product"
          @add-to-cart="handleAddToCart(product._id)"
        />
      </v-col>
      <v-col cols="12">
        <v-pagination
          v-model="page"
          circle
          :length="totalPages"
          :total-visible="5"
        />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col cols="12">
        <v-empty-state
          headline="噢！找不到商品"
          icon="mdi-magnify-remove-outline"
          text="試試看更換篩選條件或關鍵字吧！"
          title="無符合條件的商品"
        />
      </v-col>
    </v-row>

    <!-- Pagination -->
    <!-- <v-row v-if="totalPages > 1" class="mt-8">
      <v-col>
        <v-pagination
          v-model="page"
          circle
          :length="totalPages"
          :total-visible="5"
        />
      </v-col>
    </v-row> -->

  </v-container>
</template>

<script setup>
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import heroImage from '@/assets/dog-face.jpg'
  import HeroSection from '@/components/HeroSection.vue'
  import ProductCard from '@/components/ProductCard.vue'
  import productService from '@/services/product'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const heroSection = ref(null)
  const createSnackbar = useSnackbar()
  const user = useUserStore()
  const router = useRouter()

  const products = ref([])
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.value.toLowerCase())
      const matchesCategory = selectedCategory.value ? product.category === selectedCategory.value : true
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      // .sort()
      // return 0 順序不變
      // return < 0     a 在前
      // return > 0     b 在前
      // return a - b   正序
      // return b - a   倒序
      // 根據選擇的排序選項進行排序
      // sortOptions[selectedSort.value] 會是選到的排序選項
      // { text: '名稱', key: 'name', direction: 1 }
      const sortOption = sortOptions[selectedSort.value]
      // 如果是日期的排序
      if (sortOption.key === 'createdAt' || sortOption.key === 'updatedAt') {
        // 使用 new Date() 轉換日期字串為日期物件，然後進行比較
        return sortOption.direction * (new Date(a[sortOption.key]) - new Date(b[sortOption.key]))
      }
      return sortOption.direction * (a[sortOption.key] > b[sortOption.key] ? 1 : -1)
    })
  })

  const ITEMS_PER_PAGE = 9
  const page = ref(1)
  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE)
  })
  const currentPageProducts = computed(() => {
    // .slice(開始索引, 結束索引)
    // 從開始索引取到結束索引，不包含結束
    // 一頁 12 筆
    // 第 1 頁 = 0 ~ 11 = .slice(0, 12)
    // 第 2 頁 = 12 ~ 23 = .slice(12, 24)
    // 第 3 頁 = 24 ~ 35 = .slice(24, 36)
    return filteredProducts.value.slice((page.value - 1) * ITEMS_PER_PAGE, page.value * ITEMS_PER_PAGE)
  })

  const search = ref('')

  const selectedCategory = ref('')
  const categoryOptions = ['貓用', '狗用']

  // 選擇的排序選項索引
  const selectedSort = ref(0)
  // 排序選項
  // text: 顯示的文字
  // key: 排序的鍵
  // direction: 排序方向，1 為升序，-1 為降序
  // 使用 key 和 direction 來排序 products
  const sortOptions = [
    { text: '名稱', key: 'name', direction: 1 },
    { text: '價格：低到高', key: 'price', direction: 1 },
    { text: '價格：高到低', key: 'price', direction: -1 },
    { text: '最新商品', key: 'createdAt', direction: -1 },
    { text: '最舊商品', key: 'createdAt', direction: 1 },
  ]

  const getProducts = async () => {
    try {
      const { data } = await productService.get()
      products.value = data.products
    } catch (error) {
      console.error('Error fetching products:', error)
      createSnackbar({
        text: '無法載入商品資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  getProducts()

  const handleAddToCart = async productId => {
    if (!user.isLogin) {
      router.push('/auth')
      return
    }
    try {
      await userService.cart({ product: productId, quantity: 1 })
      createSnackbar({
        text: '已加入購物車',
        snackbarProps: { color: 'success' },
      })
    } catch (error) {
      createSnackbar({
        text: error.response?.data?.message || '加入購物車失敗',
        snackbarProps: { color: 'red' },
      })
    }
  }

  gsap.registerPlugin(ScrollTrigger)
  onMounted(() => {
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
          pin: true, // 🚀 這裡關鍵，會固定在上方
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
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}
</style>

<route lang="yaml">
  meta:
    # 標題
    title: '公益商城'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
