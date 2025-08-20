<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <!-- 商品搜尋輸入框 -->
        <v-text-field
          v-model="search"
          flat
          hide-details
          placeholder="搜尋商品"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          @update:model-value="page = 1"
        />
        <!-- 商品分類與排序控制項 -->
        <v-chip-group v-model="selectedCategory" mandatory @update:model-value="page = 1">
          <!-- "全部" 分類按鈕 -->
          <v-chip
            filter
            text="全部"
            :value="''"
            variant="outlined"
          />
          <!-- 動態生成其他分類按鈕 -->
          <v-chip
            v-for="option in categoryOptions"
            :key="option"
            filter
            :text="option"
            :value="option"
            variant="outlined"
          />
          <v-spacer />
          <!-- 排序選項選單 -->
          <v-menu>
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
              <v-list-item
                v-for="(option, i) in sortOptions"
                :key="option.text"
                @click="selectedSort = i; page = 1"
              >
                {{ option.text }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-chip-group>
      </v-col>
      <!-- 商品卡片列表 -->
      <v-col
        v-for="product in currentPageProducts"
        :key="product._id"
        cols="12"
        lg="4"
        md="6"
      >
        <ProductCard v-bind="product" />
      </v-col>
      <!-- 分頁控制項 -->
      <v-col cols="12">
        <v-pagination
          v-model="page"
          circle
          :length="totalPages"
          :total-visible="5"
        />
      </v-col></v-row>
  </v-container>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import ProductCard from '@/components/ProductCard.vue'
  import productService from '@/services/product'

  // 建立 snackbar 實例，用於顯示通知
  const createSnackbar = useSnackbar()

  // 響應式變數，儲存從 API 獲取的所有商品
  const products = ref([])

  // 過濾後的商品列表 (computed)
  // 這個 computed property 會根據搜尋、分類和排序選項動態更新
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      // 根據搜尋文字過濾商品名稱
      const matchesSearch = product.name.toLowerCase().includes(search.value.toLowerCase())
      // 根據選擇的分類過濾
      const matchesCategory = selectedCategory.value ? product.category === selectedCategory.value : true
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      // .sort()
      // return 0  => 順序不變
      // return < 0 => a 在前
      // return > 0 => b 在前
      // return a - b => 正序
      // return b - a => 倒序

      // 根據選擇的排序選項進行排序
      // sortOptions[selectedSort.value] 會是選到的排序選項，例如 { text: '名稱', key: 'name', direction: 1 }
      const sortOption = sortOptions[selectedSort.value]

      // 如果是日期的排序
      if (sortOption.key === 'createdAt' || sortOption.key === 'updatedAt') {
        // 使用 new Date() 轉換日期字串為日期物件，然後進行比較
        return sortOption.direction * (new Date(a[sortOption.key]) - new Date(b[sortOption.key]))
      }
      // 其他情況（名稱、價格）直接比較
      return sortOption.direction * (a[sortOption.key] > b[sortOption.key] ? 1 : -1)
    })
  })

  // --- 分頁邏輯 ---
  // 每頁顯示的商品數量
  const ITEMS_PER_PAGE = 12
  // 當前頁碼
  const page = ref(1)
  // 總頁數 (computed)
  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE)
  })
  // 當前頁面應顯示的商品 (computed)
  const currentPageProducts = computed(() => {
    // .slice(開始索引, 結束索引)
    // 從開始索引取到結束索引，不包含結束
    // 一頁 10 筆
    // 第 1 頁 = 0 ~ 9 = .slice(0, 10)
    // 第 2 頁 = 10 ~ 19 = .slice(10, 20)
    // 第 3 頁 = 20 ~ 29 = .slice(20, 30)
    return filteredProducts.value.slice((page.value - 1) * ITEMS_PER_PAGE, page.value * ITEMS_PER_PAGE)
  })

  // --- 篩選與排序邏輯 ---
  // 搜尋文字
  const search = ref('')

  // 已選擇的分類
  const selectedCategory = ref('')
  // 分類選項
  const categoryOptions = ['貓用', '狗用']

  // 已選擇的排序選項索引
  const selectedSort = ref(0)
  // 排序選項陣列
  // text: 顯示的文字
  // key: 用於排序的商品物件屬性
  // direction: 排序方向，1 為升序 (asc)，-1 為降序 (desc)
  const sortOptions = [
    { text: '名稱', key: 'name', direction: 1 },
    { text: '價格：低到高', key: 'price', direction: 1 },
    { text: '價格：高到低', key: 'price', direction: -1 },
    { text: '最新商品', key: 'createdAt', direction: -1 },
    { text: '最舊商品', key: 'createdAt', direction: 1 },
  ]

  // --- API 請求 ---
  // 異步函式，用於獲取所有商品資料
  const getProducts = async () => {
    try {
      // 呼叫 product service 的 get 方法
      const { data } = await productService.get()
      // 將獲取的商品資料存入 products ref
      products.value = data.products
    } catch (error) {
      // 處理錯誤情況
      console.error('Error fetching products:', error)
      createSnackbar({
        text: '無法載入商品資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  // 元件建立時立即獲取商品資料
  getProducts()
</script>

<route lang="yaml">
  meta:
    # 標題
    title: '公益商城'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
