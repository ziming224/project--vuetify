<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-img
          class="rounded-lg"
          contain
          height="500"
          border-radius="16"
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
            :min="1"
            variant="outlined"
            style="max-width: 200px;"
            hide-details
          />
          <v-btn
            size="large"
            color="buttonBackground"
            :disabled="!product.sell"
            prepend-icon="mdi-cart-plus"
            @click="addToCart"
          >
            加入購物車
          </v-btn>
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
  import { ref } from 'vue'
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

      document.title = `${data.product.name} | 購物網站`
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
      console.error('Error adding to cart:', error)
      createSnackbar({
        text: '無法加入購物車',
        snackbarProps: {
          color: 'red',
        },
      })
      router.push('/')
    }
  }
</script>

<route lang="yaml">
  meta:
    # 標題
    title: '商品'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
