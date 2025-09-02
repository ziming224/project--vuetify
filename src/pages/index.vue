<template>
  <div>
    <!-- ... v-parallax ... -->
    <v-parallax
      height="900"
      src="@/assets/dogcat.jpg"
    >
      <div class="hero-overlay" />
      <div class="d-flex flex-column fill-height justify-center align-center text-white" style="position: relative">
        <h1
          ref="titleRef"
          class="text-h2 font-weight-bold mb-4 hero-text-shadow"
        >
          毛孩救援站
        </h1>
        <h4
          ref="subtitleRef"
          class="subheading text-h5 font-weight-bold hero-text-shadow"
        >
          我們無法拯救全世界所有的毛孩，但我們可以改變一個毛孩的全世界。
        </h4>
        <p
          ref="descriptionRef"
          class=" text-h6 mt-6 hero-text-shadow"
          style=" opacity: 0.9;"
        >
          專為您整合各地區動物救援單位資訊，並提供緊急應對SOP，讓我們一起成為牠們的希望。
        </p>
      </div>
    </v-parallax>
    <!-- 分頁連結 -->

    <v-container class="my-12">
      <v-row>
        <v-col v-for="section in sections" :key="section.to" cols="12" md="4">
          <v-Card
            class="d-flex flex-column justify-center align-center text-center section-card"
            :color="section.color"
            height="250"
            hover
            :href="section.href"
            :to="section.to"
          >
            <v-icon class="mb-4" :icon="section.icon" size="64" />
            <v-card-title class="text-h5">{{ section.title }}</v-card-title>
            <v-card-subtitle>{{ section.subtitle }}</v-card-subtitle>
          </v-Card>
        </v-col>
      </v-row>
    </v-container>

    <!-- SOP -->
    <v-container class="custom-container">
      <v-row justify="center">
        <v-col class="text-center" cols="12">
          <div class="d-inline-block sop-title">
            <h2 class="text-h4 text-md-h3 font-weight-black wavy-underline">受傷貓狗的緊急應對SOP</h2>
            <v-divider class="my-4 mx-auto border-opacity-100" color="secondary" length="200" thickness="4" />
          </div>
          <p class="text-h6 text-medium-emphasis mt-4">當您遇到需要幫助的牠，請保持冷靜，參考以下步驟</p>
        </v-col>
      </v-row>
      <template v-for="(item, index) in sopItems" :key="item.title">
        <v-row class="align-center my-8 my-md-12 sop-row">
          <v-col class="pa-4 pa-md-10" cols="12" md="6" :order="mdAndUp ? (index % 2 === 0 ? 1 : 2) : 1">
            <v-img
              aspect-ratio="1"
              class="blob-shape elevation-8"
              cover
              :src="item.image"
            />
          </v-col>
          <v-col cols="12" md="6" :order="mdAndUp ? (index % 2 === 0 ? 2 : 1) : 2">
            <div class="pa-md-8 py-4">
              <div class="d-flex align-center mb-4">
                <v-avatar class="mr-4 elevation-4" :color="item.color" size="64">
                  <v-icon v-if="item.icon" color="white" :icon="item.icon" size="40" />
                  <span v-else class="text-h5 font-weight-bold text-white">{{ index + 1 }}</span>
                </v-avatar>
                <div>
                  <div class="text-overline" :class="`text-${item.color}`">STEP {{ index + 1 }}</div>
                  <h3 class="text-h5 font-weight-bold">{{ item.title }}</h3>
                </div>
              </div>
              <div class="mt-4">
                <div
                  v-for="(point, pointIndex) in item.text.split('\n\n')"
                  :key="pointIndex"
                  class="d-flex align-start mb-4"
                >
                  <v-icon class="mr-3 mt-1 flex-shrink-0" :color="item.color" icon="mdi-paw" size="small" />
                  <p class="text-body-1" style="line-height: 1.75;">
                    <!-- 冒號前字體為粗體 -->
                    <template v-if="point.includes('：')">
                      <strong>{{ point.split('：')[0] }}：</strong>
                      <span>{{ point.split('：').slice(1).join('：') }}</span>
                    </template>
                    <template v-else>
                      {{ point }}
                    </template>
                  </p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-divider v-if="index < sopItems.length - 1" class="my-4" />
      </template>
    </v-container>
  </div>
</template>

<script setup>
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { onMounted, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import sopImage1 from '@/assets/sop/1.png'
  import sopImage2 from '@/assets/sop/2.png'
  import sopImage3 from '@/assets/sop/3.png'
  import sopImage4 from '@/assets/sop/4.png'

  gsap.registerPlugin(ScrollTrigger)

  const titleRef = ref(null)
  const subtitleRef = ref(null)
  const descriptionRef = ref(null)
  const { mdAndUp } = useDisplay()

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

    gsap.from(descriptionRef.value, {
      duration: 1.5, y: 50, opacity: 0, ease: 'power3.out', delay: 1,
    })

    // 分頁連結卡片動畫
    gsap.from('.section-card', {
      scrollTrigger: {
        trigger: '.section-card',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      // y: 50,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
    })

    // SOP 標題動畫
    gsap.from('.sop-title', {
      scrollTrigger: {
        trigger: '.sop-title',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power3.out',
    })

    // SOP 區塊動畫
    const sopRows = gsap.utils.toArray('.sop-row')
    for (const row of sopRows) {
      gsap.from(row.children, {
        scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 50, duration: 1.5, stagger: 0.2, ease: 'power3.out',
      })
    }
  })
  const sections = ref([
    { title: '救援單位', subtitle: '查看所有救援單位', icon: 'mdi-home-heart', to: '/org', color: 'sectionOrg' },
    { title: '公益商城', subtitle: '購物同時做公益', icon: 'mdi-store', to: '/shop', color: 'sectionShop' },
    { title: '遺失啟示', subtitle: '寵物登記管理資訊網', icon: 'mdi-heart-search', href: 'https://www.pet.gov.tw/Web/O203.aspx?PG=1' },
  ])

  const sopItems = ref([
    {
      title: '第一步：確保自身和動物的安全',
      text: '評估環境： 觀察周圍，確認沒有交通危險（如來往車輛）。如果動物在馬路中間，請先確保沒有來車，再嘗試接近。\n\n保持安全距離： 受傷的動物可能因為疼痛、害怕而有攻擊性。不要直接伸手觸摸或安撫牠。\n\n準備防護： 如果您有手套、外套、毛巾等物品，可以先用這些物品保護自己，再輕輕靠近。',
      icon: 'mdi-bus-alert',
      color: 'tea',
      image: sopImage1,
    },
    {
      title: '第二步：評估狀況與尋求協助',
      text: '初步評估： 觀察動物的傷勢，如是否有明顯骨折、出血或呼吸困難，但切勿過度干擾。\n\n聯繫專業單位： 立即撥打當地動物保護處（如1999市民專線）或動物救援組織的電話。\n\n提供資訊： 清楚告知您的確切位置、動物的種類、大小與傷勢。',
      icon: 'mdi-phone-classic',
      color: 'secondary',
      image: sopImage2,
    },
    {
      title: '第三步：提供基本協助（安全前提下）',
      text: '提供飲水： 如果動物意識清楚且不會攻擊，可以在牠面前放置一小碗清水，不要強行灌食。\n\n保暖與安撫： 若天氣寒冷，可用毛巾或外套輕輕蓋在動物身上保暖。\n\n避免移動： 除非動物處於立即的危險中，否則盡量不要移動牠，以免加重傷勢。',
      icon: 'mdi-dog-side',
      color: 'tea',
      image: sopImage3,
    },
    {
      title: '第四步：等待專業人員並協助引導',
      text: '保持距離等待： 在安全的地方等待專業救援人員到達，同時留意動物的動向。\n\n引導救援： 當救援人員到達時，向他們說明動物的位置和狀況，協助他們順利接近動物。\n\n您的耐心是關鍵： 您的守護是救援成功的第一步。',
      icon: 'mdi-account-child',
      color: 'secondary',
      image: sopImage4,
    },
  ])

</script>

<style scoped>
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.hero-text-shadow {
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
}

.section-card {
  transition: transform 0.2s ease-in-out;
  border-top-right-radius: 50px;
  border-bottom-left-radius: 50px;
}
.section-card:hover {
  transform: translateY(-10px);
}

.blob-shape {
  border:20px double #A7D7C5;
border-radius: 40% 40% 30% 30%;
 transition: all 0.5s ease-in-out;
}

/* .sop-row:hover .blob-shape {
  border-radius: 37% 63% 46% 54% / 48% 55% 45% 52%;
  transform: rotate(3deg);
} */
.custom-container {
  max-width: calc(100% - 600px); /* 總共左右各 200px */
  margin-block: 48px;           /* 增加上下邊距，取代 my-12 */
  margin-inline: auto;          /* 置中 */
  padding-inline: 0 !important; /* 移除 container 預設 padding */
}

.wavy-underline {
  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-thickness: 5px;
  text-underline-offset: 15px; /* 調整波浪線與文字的距離 */
  text-decoration-color: #FF9B00; /* 🔥 您可以在這裡更換為您喜歡的顏色 */
}

/* 大於 960px (md breakpoint) 才套用 */
@media (max-width: 959px) {
  .custom-container {
    max-width: 100%;
    /* 移除會造成問題的 margin: 0，讓 margin-block 生效 */
    /* 在小螢幕上恢復 v-container 的預設左右內距 */
    padding-inline: 16px !important;
  }
}

</style>

<route lang="yaml">
  meta:
    # 標題
    title: '首頁'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
