<template>
  <v-container fluid>
    <!-- 放大顯示的卡片 -->
    <v-dialog v-model="dialog" width="600">
      <v-card v-if="selectedCard">
        <v-toolbar>
          <v-toolbar-title>{{ selectedCard.region }} - 卡片 {{ selectedCard.card }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" @click="closeDialog" />
        </v-toolbar>
        <v-card-text class="d-flex justify-center align-center" style="height: 400px;">
          <h2 class="text-h2">詳細內容</h2>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 地區與輪播 -->
    <v-row v-for="(region, index) in regions" :key="region.name" class="my-5">

      <!-- 滑動區 -->
      <v-col cols="12">
        <v-slide-group
          :ref="el => slideGroups[index] = el"
          class="pa-2"
          show-arrows
        >
          <v-slide-group-item
            v-for="n in 10"
            :key="n"
          >
            <v-card
              class="ma-2"
              color="#f2f2f2"
              height="290"
              width="400"
              @click="openDialog(region.name, n)"
            >
              <v-card-text class="text-center">卡片 {{ n }}</v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'

  const regions = [
    { name: '北部' },
    { name: '中部' },
    { name: '南部' },
  ]

  const slideGroups = ref([])
  const selectedCard = ref(null)
  const dialog = ref(false)

  function openDialog (region, card) {
    selectedCard.value = { region, card }
    dialog.value = true
  }

  function closeDialog () {
    selectedCard.value = null
    dialog.value = false
  }

</script>

<style scoped>
/* 如果不再需要，可以移除這裡的樣式 */
</style>
