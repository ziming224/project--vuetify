<template>
  <v-container fluid>
    <!-- 放大顯示的卡片 -->
    <v-container v-if="selectedCard" class="top-card">
      <v-card
        class="ma-4 enlarged-card"
        color="#e0e0e0"
        height="400"
        width="600"
        @click="closeEnlargedCard"
      >
        <v-card-text class="text-center text-h4">
          {{ selectedCard.region }} - 卡片 {{ selectedCard.card }}
        </v-card-text>
      </v-card>
    </v-container>

    <!-- 地區與輪播 -->
    <v-row v-for="(region, index) in regions" :key="region.name" class="my-5">
      <!-- 左側地區與箭頭 -->
      <v-col class="d-flex flex-column align-center justify-center" cols="1">
        <div class="text-center">{{ region.name }}</div>
        <v-btn icon style="background-color: #F9A825;" @click="scrollLeft(index)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>

      <!-- 滑動區 -->
      <v-col cols="10">
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
              @click="selectCard(region.name, n)"
            >
              <v-card-text class="text-center">卡片 {{ n }}</v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>

      <!-- 右側箭頭 -->
      <v-col class="d-flex align-center justify-center" cols="1">
        <v-btn icon style="background-color: #F9A825;" @click="scrollRight(index)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
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

  function selectCard (region, card) {
    selectedCard.value = { region, card }
    // 滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeEnlargedCard () {
    selectedCard.value = null
  }

  function scrollLeft (index) {
    const group = slideGroups.value[index]
    if (group) group.scrollTo('prev')
  }

  function scrollRight (index) {
    const group = slideGroups.value[index]
    if (group) group.scrollTo('next')
  }
</script>

<style scoped>
.top-card {
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.enlarged-card {
  transition: all 0.3s ease-in-out;
}
</style>
