<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold my-4">我的購物車</h1>
    <v-alert
      v-model="showAnnouncement"
      border="start"
      variant="tonal"
      closable
      close-label="關閉公告"
      color="info"
      title="本月合作單位"
      class="mb-8"
    >
      全館消費滿千元，即可享有 <strong>免運費</strong> 優惠！快去挑選更多商品吧！
    </v-alert>
    <div v-if="cart.length === 0" class="text-center pa-16 pt-10">
      <v-icon size="80" color="grey-lighten-1">mdi-cart-off</v-icon>
      <h2 class="text-h5 my-4">您的購物車是空的</h2>
      <p class="text-medium-emphasis mb-6">快去尋找您喜歡的商品吧！</p>
      <v-btn color="primary" to="/shop">繼續購物</v-btn>
    </div>

    <v-row v-else>
      <!-- Cart Items -->
      <v-col cols="12" md="8">
        <v-card variant="outlined">
          <v-list lines="three">
            <template v-for="(item, i) in cart" :key="item._id">
              <v-list-item class="py-4" :class="{ 'bg-red-lighten-5': !item.product.sell }">
                <template #prepend>
                  <v-img
                    :src="item.product.image"
                    width="100"
                    height="100"
                    class="rounded-lg mr-4 cursor-pointer"
                    cover
                    @click="$router.push('/product/' + item.product._id)"
                  />
                </template>

                <v-list-item-title class="font-weight-bold mb-1">
                  <router-link class="text-primary text-decoration-none" :to="'/product/' + item.product._id">
                    {{ item.product.name }}
                  </router-link>
                </v-list-item-title>

                <v-list-item-subtitle class="d-flex align-center ga-4">
                  <div class="text-body-1 font-weight-medium">
                    NT$ {{ item.product.price.toLocaleString() }}
                  </div>
                  <v-chip v-if="!item.product.sell" color="red" size="small" label>已下架</v-chip>
                </v-list-item-subtitle>

                <div class="d-flex align-center mt-4">
                  <v-number-input
                    control-variant="split"
                    hide-details
                    :min="1"
                    :model-value="item.quantity"
                    variant="outlined"
                    density="compact"
                    style="max-width: 150px"
                    @update:model-value="updateCart($event, item, i)"
                  />
                  <v-spacer />
                  <v-btn icon="mdi-delete-outline" variant="text" color="grey" @click="removeItem(item, i)" />
                </div>
              </v-list-item>
              <v-divider v-if="i < cart.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Summary -->
      <v-col cols="12" md="4">
        <v-card variant="outlined" class="pa-4" style="position: sticky; top: 88px;">
          <h2 class="text-h6 font-weight-bold mb-4">訂單摘要</h2>
          <div class="d-flex justify-space-between mb-2 text-medium-emphasis">
            <span>小計</span>
            <span>NT$ {{ totalPrice.toLocaleString() }}</span>
          </div>
          <div class="d-flex justify-space-between mb-4 text-medium-emphasis">
            <span>運費</span>
            <span>免費</span>
          </div>
          <v-divider class="my-2" />
          <div class="d-flex justify-space-between font-weight-bold text-h6 my-4">
            <span>總計</span>
            <span>NT$ {{ totalPrice.toLocaleString() }}</span>
          </div>
          <v-btn color="primary" block size="large" :disabled="checkoutDisable" @click="checkout">
            前往結帳
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import orderService from '@/services/order'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const createSnackbar = useSnackbar()
  const user = useUserStore()
  const router = useRouter()

  const cart = ref([])
  const showAnnouncement = ref(true)

  const getCart = async () => {
    try {
      const { data } = await userService.getCart()
      cart.value = data.result
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: '無法獲取購物車資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  onMounted(getCart)

  const updateCart = async (newValue, item, i) => {
    try {
      const { data } = await userService.cart({ // Assuming this is a POST request now
        product: item.product._id,
        quantity: newValue - item.quantity,
      })
      item.quantity = newValue
      if (newValue <= 0) {
        cart.value.splice(i, 1)
      }
      user.cartTotal = data.result
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: '更新購物車失敗',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }

  const removeItem = (item, i) => {
    // Set quantity to 0 to remove it from the cart via the backend logic
    updateCart(0, item, i)
  }

  const totalPrice = computed(() => {
    return cart.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  })

  const checkoutDisable = computed(() => {
    return cart.value.length === 0 || cart.value.some(item => !item.product.sell)
  })

  const checkout = async () => {
    try {
      await orderService.create()
      user.cartTotal = 0
      router.push('/orders')
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: '結帳失敗',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
</script>

<route lang="yaml">
  meta:
    title: '購物車'
    login: 'login-only'
    admin: false
</route>
