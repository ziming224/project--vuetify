<template>
  <v-card
    class="d-flex flex-column product-card"
    height="100%"
    hover
    name
    @click="goToProduct"
  >
    <v-img
      class="text-white align-end"
      cover
      height="450"
      :src="image"
    >
      <v-toolbar
        color="rgba(0, 0, 0, 0.4)"
        theme="dark"
      >
        <v-toolbar-title class="text-body-1 font-weight-bold">
          {{ name }}
        </v-toolbar-title>
      </v-toolbar>
    </v-img>

    <v-card-text class="pt-4 flex-grow-1">

      <div class="text-h6 font-weight-bold text-secondary my-2">
        NT$ {{ price.toLocaleString() }}
      </div>

      <div class="text-body-2 product-description">
        {{ description }}
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-3">
      <v-spacer />
      <v-btn
        color="secondary"
        prepend-icon="mdi-cart-plus"
        text="加入購物車"
        variant="tonal" 
        @click.prevent="addToCart"
      /> 

    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'

  // 使用物件語法來定義 props，提供更強的型別檢查和可讀性
  const props = defineProps({
    _id: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true }
  })

  const emit = defineEmits(['add-to-cart']) 
  const router = useRouter()
  const user = useUserStore()

  const addToCart = () => {
    // 將產品 ID 傳遞出去，讓父層更容易處理
    emit('add-to-cart', props._id)
  }

  const goToProduct = () => {
    router.push('/product/' + props._id)
  }
</script>

<style scoped>
.product-card {
  transition: all 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important;
}

.product-description {
  /* 啟用舊版的 Flexbox 模型 */
  display: -webkit-box;
  /* 標準語法，應放在前面 */
  line-clamp: 3;
  /* 舊的、帶前綴的語法，作為後備 */
  -webkit-line-clamp: 3;
  /* 讓盒子內容垂直排列 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.5em; 
  line-height: 1.5em;
}

/* :deep()  取消 scoped 限制，讓樣式「穿透」進子元件 */
.product-card :deep(.v-img__img) {
  transition: transform 0.3s ease-in-out;
}

.product-card:hover :deep(.v-img__img) {
  transform: scale(1.08);
}

</style>
