<template>
  <div>
    <v-parallax
      height="600"
      src="@/assets/dogcat.jpg"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1
          ref="titleRef"
          class="text-h2 font-weight-thin mb-4"
        >
          毛孩救援站
        </h1>
        <h4 ref="subtitleRef" class="subheading text-h5">
          給他們一個溫暖的家
        </h4>
      </div>
    </v-parallax>
    <!-- 分頁連結 -->
    <v-container class="my-12">
      <v-row>
        <v-col v-for="section in sections" :key="section.to" cols="12" md="4">
          <v-card
            class="d-flex flex-column align-center justify-center text-center pa-6"
            height="250"
            hover
            :href="section.href"
            :to="section.to"
          >
            <v-icon class="mb-4" :icon="section.icon" size="64" />
            <v-card-title class="text-h5">{{ section.title }}</v-card-title>
            <v-card-subtitle>{{ section.subtitle }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- SOP -->
    <v-container class="my-12">
      <v-row justify="center">
        <v-col cols="12">
          <h2 class="text-h4 text-center mb-8">受傷貓狗的緊急應對SOP</h2>
        </v-col>
        <v-col cols="12">
          <v-timeline align="start" direction="horizontal" side="end">
            <v-timeline-item
              v-for="item in sopItems"
              :key="item.title"
              :dot-color="item.color"
              fill-dot
              :icon="item.icon"
            >
              <v-card width="400">
                <v-img
                  cover
                  height="200"
                  :src="item.image"
                />
                <v-card-title :class="['text-h6', `bg-${item.color}`]">
                  {{ item.title }}
                </v-card-title>
                <v-card-text class="bg-white text--primary" style="height: 220px; overflow-y: auto;">
                  <p class="mt-2" style="white-space: pre-line;">
                    {{ item.text }}
                  </p>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
  import gsap from 'gsap'
  import { onMounted, ref } from 'vue'
  import sopImage1 from '@/assets/sop/1.png'
  import sopImage2 from '@/assets/sop/2.png'
  import sopImage3 from '@/assets/sop/3.png'
  import sopImage4 from '@/assets/sop/4.png'

  const titleRef = ref(null)
  const subtitleRef = ref(null)

  onMounted(() => {
    // 使用 GSAP 建立動畫
    gsap.from(titleRef.value, {
      duration: 1.5, // 動畫持續時間 1.5 秒
      y: -50, // 從上方 50px 的位置開始
      opacity: 0, // 從透明度 0 開始
      ease: 'power3.out', // 動畫緩動效果
    })

    gsap.from(subtitleRef.value, {
      duration: 1.5, y: 50, opacity: 0, ease: 'power3.out', delay: 0.5, // 延遲 0.5 秒開始
    })
  })
  const sections = ref([
    { title: '救援單位', subtitle: '查看所有合作的救援單位', icon: 'mdi-home-heart', to: '/org' },
    { title: '公益商城', subtitle: '購物同時做公益', icon: 'mdi-store', to: '/shop' },
    { title: '遺失啟示', subtitle: '寵物登記管理資訊網', icon: 'mdi-account-group', href: 'https://www.pet.gov.tw/Web/O203.aspx?PG=1' },
  ])

  const sopItems = ref([
    {
      title: '第一步：確保自身和動物的安全',
      text: '評估環境： 觀察周圍，確認沒有交通危險（如來往車輛）。如果動物在馬路中間，請先確保沒有來車，再嘗試接近。\n\n保持安全距離： 受傷的動物可能因為疼痛、害怕而有攻擊性。不要直接伸手觸摸或安撫牠。\n\n準備防護： 如果您有手套、外套、毛巾等物品，可以先用這些物品保護自己，再輕輕靠近。',
      icon: 'mdi-shield-check-outline',
      color: 'primary',
      image: sopImage1,
    },
    {
      title: '第二步：評估狀況與尋求協助',
      text: '初步評估： 觀察動物的傷勢，如是否有明顯骨折、出血或呼吸困難，但切勿過度干擾。\n\n聯繫專業單位： 立即撥打當地動物保護處（如1999市民專線）或動物救援組織的電話。\n\n提供資訊： 清楚告知您的確切位置、動物的種類、大小與傷勢。',
      icon: 'mdi-phone-outline',
      color: 'secondary',
      image: sopImage2,
    },
    {
      title: '第三步：提供基本協助（安全前提下）',
      text: '提供飲水： 如果動物意識清楚且不會攻擊，可以在牠面前放置一小碗清水，不要強行灌食。\n\n保暖與安撫： 若天氣寒冷，可用毛巾或外套輕輕蓋在動物身上保暖。\n\n避免移動： 除非動物處於立即的危險中，否則盡量不要移動牠，以免加重傷勢。',
      icon: 'mdi-first-aid',
      color: 'primary',
      image: sopImage3,
    },
    {
      title: '第四步：等待專業人員並協助引導',
      text: '保持距離等待： 在安全的地方等待專業救援人員到達，同時留意動物的動向。\n\n引導救援： 當救援人員到達時，向他們說明動物的位置和狀況，協助他們順利接近動物。\n\n您的耐心是關鍵： 您的守護是救援成功的第一步。',
      icon: 'mdi-account-hard-hat',
      color: 'secondary',
      image: sopImage4,
    },
  ])
</script>

<route lang="yaml">
  meta:
    # 標題
    title: '首頁'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
