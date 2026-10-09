<template>
  <!-- Hero Banner -->
  <HeroSection
    :image-src="heroImage"
    subtitle="每月與不同單位合作您下的一筆訂單能讓毛孩們多一份溫飽"
    title="公益商城"
  />

  <!-- 公告懸浮按鈕與提示 -->
  <div class="announcement-fab-container">
    <div class="fab-tip">點擊查看本月合作單位</div>
    <v-btn
      class="announcement-fab"
      color="#EDA35A"
      elevation="8"
      icon="mdi-bullhorn-outline"
      size="x-large"
      @click="announcementDialog = true"
    />
  </div>

  <!-- 公告彈窗 -->
  <v-dialog v-model="announcementDialog" max-width="800px">
    <v-card class="announcement-card-dialog">
      <v-card-text class="pa-8">
        <v-row align="center"no-gutters justify="center">
          <v-col cols="12" sm="9" >
            <h2 class="mb-4 text-h5 text-md-h4 font-weight-bold">💝 本月商品將捐贈給 <strong class="text-secondary">{{ donationUnit.name }}</strong></h2>
            <p class="text-body-1">
              在本賣場消費之商品都會捐贈與該月合作單位，每月合作對象以公告單位為準。<br>
              這是一個讓愛不流浪的機會。您的每一筆消費，都將直接轉化為浪浪們的伙食、醫療與棲身之所。讓牠們不再於街頭流浪，而是能擁有一個充滿愛與希望的家。<br>
              讓我們一起，用行動來支持這些無助的生命。您的消費，是浪浪們重獲新生的希望。<br>
              感謝您的每一次善舉，讓愛的力量，在我們的世界裡循環不息。<br>
            </p>
            <p class="text-medium-emphasis mb-0">
              {{ donationUnit.description }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="secondary" variant="text" @click="announcementDialog = false">
          我知道了
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container class="my-8 custom-container">
    <v-row align="center">
      <!-- 搜尋 -->
      <v-col cols="12" md="10">
        <v-text-field
          v-model="search"
          clearable
          density="compact"
          flat
          hide-details
          placeholder="搜尋商品"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          @update:model-value="page = 1"
        />
      </v-col>

      <!-- 排序按鈕 -->
        <v-menu>
          <!-- 插槽 -->
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              append-icon="mdi-chevron-down"
              :ripple="false"
              variant="text"
            >
            {{ sortOptions[selectedSort].text }}
              </v-btn>
          </template>
          <v-list>
            <!-- 每個項目跑回圈，點擊每個選項後去換索引，頁面重置到第一頁 -->
            <v-list-item
              v-for="(option, i) in sortOptions"
              :key="option.text"
              @click="selectedSort = i; page = 1"
            >
              <v-list-item-title>{{ option.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-row>
    
  <!-- 篩選 -->
          <v-col cols="12" md="4">
        <v-chip-group v-model="selectedCategory" mandatory selected-class="text-secondary" @update:model-value="page = 1">
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



    <v-row v-if="filteredProducts.length > 0">
      <v-col
        v-for="product in currentPageProducts"
        :key="product._id"
        cols="12"
        lg="4"
        md="6"
      >
        <ProductCard
          v-bind="product"
          @add-to-cart="handleAddToCart(product._id)"
        />
      </v-col>
      
      <!-- 頁碼 -->
      <v-col cols="12">
        <v-pagination
          v-model="page"
          circle
          :length="totalPages"
          :total-visible="5"
        />
      </v-col>
    </v-row>

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


  </v-container>
</template>

<script setup>
  import gsap from 'gsap'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import heroImage from '@/assets/dog-face.jpg'
  import HeroSection from '@/components/HeroSection.vue'
  import ProductCard from '@/components/ProductCard.vue'
  import { donationUnit } from '@/lib/donation'
  import productService from '@/services/product'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const announcementDialog = ref(false)
  const createSnackbar = useSnackbar()
  const user = useUserStore()
  const { isLogin } = storeToRefs(user)
  const router = useRouter()

  const products = ref([])
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      // 搜尋框按 ✕ 清除時 search 會變成 null，所以用 || '' 保護
      const matchesSearch = product.name.toLowerCase().includes((search.value || '').toLowerCase())
      // 有無符合搜尋的東西=商品名字轉小寫.包括(搜尋關鍵字轉小寫)
      const matchesCategory = selectedCategory.value ? product.category === selectedCategory.value : true
      // 符合的分類=如有選到分類 判斷商品分類是否=選到的分類，無的話true
      return matchesSearch && matchesCategory
      // 用&&合併再return出來
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

  // 一頁幾個
  const ITEMS_PER_PAGE = 12
  // 目前第幾頁
  const page = ref(1)
  // 全部頁數
  const totalPages = computed(() => {
    // 過濾後的東西總數/一頁有幾個 無條件進位
    return Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE)
  })
  // 目前頁面商品(用slice計算這一頁要顯示的商品)
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
// 全部為空
  const selectedCategory = ref('')
  const categoryOptions = ['貓用', '犬用']

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
    if (!isLogin.value) {
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

  onMounted(() => {
    // 强制滚动到页面顶部，解决 GSAP pin 与 Vue Router scrollBehavior 的冲突
    window.scrollTo(0, 0)
  })
</script>

<style scoped>

/* 公告懸浮按鈕與提示容器 */
.announcement-fab-container {
  position: fixed;
  bottom: 90px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
}

/* 提示文字泡泡 */
.fab-tip {
  position: absolute;
  right: 72px; /* 按鈕寬度 (56) + 間距 (16) */
  padding: 8px 16px;
  background-color: #FFF9BD;
  color: rgb(6, 6, 6);
  border-radius: 16px;
  white-space: nowrap;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  pointer-events: none; /* 讓滑鼠可以穿透點擊按鈕 */
  opacity: 0;
  transform: translateX(10px);
  animation: fab-tip-animation 10s ease-in-out infinite;
  animation-delay: 1s;
   /* 延遲2秒後開始動畫 */
}

/* 提示文字的箭頭 */
.fab-tip::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid rgba(var(--v-theme-primary-rgb), 0.95);
}

/* 公告懸浮按鈕 */
.announcement-fab {
  /* 移除定位屬性，由父容器 .announcement-fab-container 控制 */
  animation: fab-pulse 2s infinite;
}

@keyframes fab-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary-rgb), 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(var(--v-theme-primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary-rgb), 0);
  }
}

/* 提示文字的動畫 */
@keyframes fab-tip-animation {
  0%, 100% {
    opacity: 0;
    transform: translateX(10px);
  }
  10%, 50% {
    opacity: 1;
    transform: translateX(0);
  }
  60% {
    opacity: 0;
    transform: translateX(10px);
  }
}

/* 公告彈窗卡片樣式 */
.announcement-card-dialog {
  border-radius: 24px !important; /* 圓角加大，更現代 */
  border: 2px solid transparent;
  /* 關鍵：用兩層背景實現漸變邊框 */
  background: linear-gradient(white, white) padding-box,
              linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) border-box;
}

/* 讓 icon 有呼吸和輕微搖擺的效果 */
.announcement-card-dialog .v-icon {
  animation: gentle-ring 5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes gentle-ring {
  0% { transform: rotate(0deg) scale(1); }
  15% { transform: rotate(10deg) scale(1.1); }
  30% { transform: rotate(-8deg) scale(1.1); }
  45% { transform: rotate(5deg) scale(1.1); }
  60% { transform: rotate(-2deg) scale(1.1); }
  75% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(0deg) scale(1); }
}

/* 讓 strong 標籤的文字有漸變效果 */
.announcement-card-dialog .text-secondary {
  background: linear-gradient(45deg, #48A9A6, #2196F3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
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
