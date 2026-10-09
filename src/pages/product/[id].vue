<template>
  <v-container class="custom-container" fluid style="margin-top: 50px;margin-bottom: 50px;">
    <v-row>
      <v-col cols="12" md="6">
        <v-img
          border-radius="16"
          class="rounded-lg"
          contain
          height="500"
          :src="product.image"
        />
      </v-col>
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold mb-2">{{ product.name }}</h1>
        <p class="text-body-1 my-6" style="white-space: pre-wrap;">{{ product.description }}</p>

        <div class="text-h5 font-weight-bold mb-6">
          NT$ {{ product.price.toLocaleString() }}
        </div>
        <p>數量</p>
        <div class="d-flex align-center ga-4">
          <v-number-input
            v-model="quantity"
            control-variant="split"
            hide-details
            :max="product.stock"
            :min="1"
            style="max-width: 200px;"
            variant="outlined"
          />
          <v-btn
            v-if="user.isLoggedIn"
            color="buttonBackground"
            :disabled="!product.sell || soldOut"
            prepend-icon="mdi-cart-plus"
            size="large"
            @click="addToCart"
          >
            {{ soldOut ? '已售完' : '加入購物車' }}
          </v-btn>
          <v-btn
            v-else
            color="buttonBackground"
            prepend-icon="mdi-login"
            size="large"
            to="/auth"
          >
            請先登入
          </v-btn>
        </div>
        <div class="mt-6">
          <p class="text-subtitle-1 font-weight-bold">分享給朋友</p>
          <v-btn
            color="blue-darken-2"
            :href="shareLinks.facebook"
            icon="mdi-facebook"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          />
          <v-btn
            color="blue-lighten-1"
            :href="shareLinks.twitter"
            icon="mdi-twitter"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          />
          <v-btn color="purple-lighten-1" icon="mdi-instagram" variant="text" @click="copyLink" />
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-overlay
    class="align-center justify-center text-center"
    :model-value="!product.sell"
    persistent
    scrim="black"
  >
    <h1 class="text-h2 font-weight-bold mb-4">已下架</h1>
    <p class="text-h6 mb-8">這個商品已經下架，無法購買。</p>
    <v-btn
      color="accent"
      to="/"
    >
      返回首頁
    </v-btn>
  </v-overlay>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import productService from '@/services/product'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const createSnackbar = useSnackbar()
  const router = useRouter()
  const route = useRoute()
  const user = useUserStore()

  const product = ref({
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: true,
    image: '',
  })

  const getProduct = async () => {
    try {
      const { data } = await productService.getId(route.params.id)
      Object.assign(product.value, data.product)

      document.title = `${data.product.name} | 毛孩救援站`
    } catch (error) {
      console.error('Error fetching product:', error)
      createSnackbar({
        text: '無法載入商品資料',
        snackbarProps: {
          color: 'red',
        },
      })
      router.push('/')
    }
  }
  getProduct()

  // 有庫存資料且為 0 才算售完（舊商品可能沒有 stock 欄位）
  const soldOut = computed(() => typeof product.value.stock === 'number' && product.value.stock < 1)

  // 分享：Facebook、Twitter 開啟分享網址；Instagram 沒有網頁分享功能，改成複製連結
  const shareLinks = computed(() => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`${product.value.name} | 毛孩救援站`)
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    }
  })
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      createSnackbar({
        text: '已複製商品連結，可以貼到 Instagram 分享',
        snackbarProps: {
          color: 'green',
        },
      })
    } catch {
      createSnackbar({
        text: '複製失敗，請手動複製網址',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }

  const quantity = ref(1)
  const addToCart = async () => {
    try {
      const { data } = await userService.cart({
        product: route.params.id,
        quantity: quantity.value,
      })
      user.cartTotal = data.result
      createSnackbar({
        text: '已加入購物車',
        snackbarProps: {
          color: 'green',
        },
      })
    } catch (error) {
      const errorMessage = error?.response?.data?.message || '無法加入購物車，請稍後再試'
      console.error('Error adding to cart:', error)
      createSnackbar({
        text: errorMessage,
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
</script>

<style scoped>
.custom-container {
  max-width: calc(100% - 400px); /* 總共左右各 200px */
  margin: 0 auto;               /* 置中 */
  padding-left: 0 !important;   /* 移除 container 預設 padding */
  padding-right: 0 !important;
}

/* 大於 960px (md breakpoint) 才套用 */
@media (max-width: 959px) {
  .custom-container {
    max-width: 100%;
    margin: 0;
  }
}
</style>

<route lang="yaml">
  meta:
    # 標題
    title: '商品'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
