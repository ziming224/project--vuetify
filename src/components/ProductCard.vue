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
      height="550"
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
      <div class="text-subtitle-1 font-weight-medium text-medium-emphasis">
        {{ category }}
      </div>

      <div class="text-h6 font-weight-bold text-primary my-2">
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
        color="primary"
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

  const props = defineProps(['_id', 'image', 'name', 'category', 'price', 'description'])
  // Props definition assuming product object structure

  // Emits definition for component events
  const emit = defineEmits(['add-to-cart'])
  const router = useRouter()
  const user = useUserStore()

  const addToCart = () => {
    emit('add-to-cart')
  }

  const goToProduct = () => {
    if (user.isLogin) {
      router.push(`/product/${props._id}`)
    } else {
      router.push('/auth')
    }
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
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.5em; /* Fallback for height (3 * 1.5em line-height) */
  line-height: 1.5em;
}

/* --- Image Zoom on Hover --- */
.product-card :deep(.v-img__img) {
  transition: transform 0.3s ease-in-out;
}

.product-card:hover :deep(.v-img__img) {
  transform: scale(1.08);
}

</style>
