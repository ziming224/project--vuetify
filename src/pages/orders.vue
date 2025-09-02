<template>
  <v-container class="custom-container" fluid style="margin-top: 50px;margin-bottom: 50px;">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold my-4">我的訂單</h1>
      </v-col>

      <v-col cols="12">
        <div v-if="orders.length === 0" class="text-center pa-16">
          <v-icon color="grey-lighten-1" size="80">mdi-receipt-text-outline</v-icon>
          <h2 class="text-h5 my-4">您目前沒有任何訂單</h2>
          <p class="text-medium-emphasis mb-6">快去商城逛逛吧！</p>
          <v-btn color="primary" to="/shop">前往商城</v-btn>
        </div>

        <v-expansion-panels v-else variant="accordion">
          <v-expansion-panel
            v-for="order in orders"
            :key="order._id"
            elevation="2"
          >
            <v-expansion-panel-title>
              <v-row align="center" class="spacer">
                <v-col cols="12" md="4" sm="5">
                  <div class="text-caption text-medium-emphasis">訂單編號</div>
                  <div class="font-weight-bold text-mono">{{ order._id }}</div>
                </v-col>
                <v-col cols="6" md="3" sm="3">
                  <div class="text-caption text-medium-emphasis">下單日期</div>
                  <div class="font-weight-medium">{{ new Date(order.createdAt).toLocaleDateString() }}</div>
                </v-col>
                <v-col cols="6" md="3" sm="3">
                  <div class="text-caption text-medium-emphasis">總金額</div>
                  <div class="font-weight-bold text-primary">
                    NT$ {{ order.totalPrice.toLocaleString() }}
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="bg-surface-light">
              <v-list class="bg-transparent" lines="two">
                <v-list-item
                  v-for="item in order.cart"
                  :key="item._id"
                  class="mb-2"
                  :title="item.product.name"
                  :to="`/product/${item.product._id}`"
                >
                  <template #prepend>
                    <v-avatar class="mr-4" rounded="lg" size="64">
                      <v-img :alt="item.product.name" :src="item.product.image" />
                    </v-avatar>
                  </template>
                  <v-list-item-subtitle>
                    單價: NT$ {{ item.product.price.toLocaleString() }}
                  </v-list-item-subtitle>
                  <template #append>
                    <div class="text-right">
                      <div>x {{ item.quantity }}</div>
                      <div class="font-weight-bold text-body-1 mt-1">
                        NT$ {{ (item.product.price * item.quantity).toLocaleString() }}
                      </div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
              <v-divider class="my-2" />
              <div class="d-flex justify-end align-center pa-2">
                <span class="text-h6 font-weight-bold">總計：</span>
                <span class="text-h6 font-weight-bold text-primary ml-2">NT$ {{ order.totalPrice.toLocaleString() }}</span>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import orderService from '@/services/order'

  const createSnackbar = useSnackbar()

  const orders = ref([])

  const getOrders = async () => {
    try {
      const { data } = await orderService.getMy()
      orders.value = data.result.map(order => {
        const totalPrice = order.cart.reduce((total, item) => {
          return total + item.product.price * item.quantity
        }, 0)
        return { ...order, totalPrice }
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
      createSnackbar({
        text: '無法載入訂單資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  onMounted(getOrders)
</script>

<style scoped>
.custom-container {
  max-width: calc(100% - 600px); /* 總共左右各 200px */
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
}</style>

<route lang="yaml">
  meta:
    title: '訂單'
    login: 'login-only'
    admin: false
</route>
