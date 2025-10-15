<template>
  <div>
    <v-overlay
      v-model="loadingOverlay"
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-overlay>

    <h2 class="text-h5 font-weight-bold mb-6">我的收藏</h2>

    <v-row v-if="loading">
      <v-col v-for="n in 3" :key="n" cols="12" md="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <div v-else-if="favorites.length === 0" class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1">mdi-heart-off-outline</v-icon>
      <h3 class="text-h6 my-4">您尚未收藏任何單位</h3>
      <p class="text-medium-emphasis mb-6">在單位頁面點擊愛心即可加入收藏！</p>
      <v-btn color="primary" to="/org">前往救援單位</v-btn>
    </div>

    <v-row v-else>
      <v-col
        v-for="item in favorites"
        :key="item._id"
        cols="12"
        sm="6"
         md="4"
      >
        <v-card @click="openDialog(item)" hover border>
          <v-img :src="item.image" height="200px" cover class="align-end text-white">
          </v-img>
          <v-card-subtitle class="pt-4">
            {{ item.category }}
          </v-card-subtitle>
         <v-card-title class="pt-0 text-h6 font-weight-bold" style="white-space: normal; word-break: break-word;">{{ item.title }}</v-card-title>
          <v-card-actions>
            <v-btn
              icon="mdi-heart"
              color="red"
              size="small"
              variant="text"
              @click.stop="handleFavorite(item)"
            ></v-btn>
            <!-- click.stop阻止取消收藏點擊愛心繼續向上冒泡跳出詳細資訊視窗 -->
            <v-spacer />
            <v-btn color="secondary" variant="text">查看詳情</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 點開畫面 -->
    <v-dialog v-model="dialog" max-width="600px" scrollable>
      <v-card v-if="selected" class="org-dialog-card">
        <v-img
          class="align-end"
          cover
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="250px"
          :src="selected.image"
        >
          <v-card-title class="text-white text-h5" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.7);">
            {{ selected.title }}
          </v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
          <v-icon class="mr-1" icon="mdi-map-marker" size="small" />
          {{ selected.address }}
        </v-card-subtitle>

        <v-card-text class="pt-2 pb-0">
          <p class="text-body-1" style="white-space: pre-line;">
            {{ selected.detail }}
          </p>
        </v-card-text>

        <v-list class="py-0" density="compact">
          <v-divider class="mx-4 my-2" />
          <v-list-subheader>聯絡資訊</v-list-subheader>
          <v-list-item
            v-if="selected.phone"
            class="link-item"
            :href="`tel:${selected.phone}`"
            prepend-icon="mdi-phone"
            rel="noopener noreferrer"
            target="_blank"
            :title="selected.phone"
          />
          <v-list-item
            v-if="selected.fb"
            class="link-item"
            :href="selected.fb"
            prepend-icon="mdi-facebook"
            rel="noopener noreferrer"
            target="_blank"
            title="Facebook 粉專"
          />
          <v-list-item
            v-if="selected.website"
            class="link-item"
            :href="selected.website"
            prepend-icon="mdi-web"
            rel="noopener noreferrer"
            target="_blank"
            title="官方網站"
          />
          <v-list-item
            v-if="selected.mail"
            class="link-item"
            :href="`mailto:${selected.mail}`"
            prepend-icon="mdi-email"
            rel="noopener noreferrer"
            target="_blank"
            :title="selected.mail"
          />
          <v-divider v-if="selected.openingHours" class="mx-4 my-2" />
          <v-list-subheader v-if="selected.openingHours">
            營運時間
          </v-list-subheader>
          <v-list-item v-if="selected.openingHours" prepend-icon="mdi-clock-outline">
            <v-list-item-title style="white-space: pre-line; line-height: 1.6;">
              <span v-html="(!selected.openingHours || selected.openingHours === 'undefined') ? '尚未提供' : selected.openingHours.replace(/\n/g, '<br>')"></span>
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" variant="text" @click="dialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import userService from '@/services/user'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const createSnackbar = useSnackbar()
const user = useUserStore()
const { isLoggedIn } = storeToRefs(user)

const favorites = ref([])
const favoriteIds = ref([])
const loading = ref(true)
const loadingOverlay = ref(false)
const dialog = ref(false)
const selected = ref(null)

const openDialog = item => {
  selected.value = item
  dialog.value = true
}
const fetchFavorites = async () => {
  try {
    const { data } = await userService.getFavorites()
    // 後端回傳的資料結構可能與 org.vue 不同，這裡直接使用 result
    // 並將其轉換為與 org.vue 相同的格式以利 v-dialog 重用
    favorites.value = data.result.map(org => ({
      _id: org._id,
      title: org.name,
      short: org.description.slice(0, 40) + '...',
      detail: org.description,
      short: org.description ? org.description.slice(0, 40) + '...' : '',
      detail: org.description || '',
      image: org.image,
      category: org.category,
      address: org.address,
      phone: org.phone,
      mail: org.mail,
      fb: org.fb,
      website: org.website,
      openingHours: org.openingHours,
    }))
    // 同步 Pinia store 中的 favoriteIds
    favoriteIds.value = data.result.map(fav => fav._id)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    createSnackbar({
      text: '無法載入收藏列表',
      snackbarProps: { color: 'red' },
    })
  } finally {
    loading.value = false
  }
}

const handleFavorite = async (item) => {
  loadingOverlay.value = true
  try {
    await userService.addFavorite({ org: item._id })
    // 操作成功後，重新獲取最新的收藏列表
    await fetchFavorites()
    createSnackbar({ text: '已取消收藏', snackbarProps: { color: 'success', timeout: 2000 } })
  } catch (error) {
    console.error('收藏操作失敗:', error)
    createSnackbar({ text: error?.response?.data?.message || '操作失敗，請稍後再試', snackbarProps: { color: 'red', timeout: 2000 } })
  } finally {
    loadingOverlay.value = false
  }
}

watch(isLoggedIn, (newValue) => {
  if (newValue) {
    fetchFavorites()
  } else {
    favorites.value = []
    favoriteIds.value = []
  }
})

onMounted(fetchFavorites)
</script>

<route lang="yaml">
  meta:
    title: '我的收藏'
    login: 'login-only'
    admin: false
</route>