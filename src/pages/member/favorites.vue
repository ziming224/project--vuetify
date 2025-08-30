<!-- <template>
  <div>
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
        <v-card :to="`/org/${item._id}`" hover border>
          <v-img :src="item.image" height="200px" cover class="align-end text-white">
             <v-card-title class="pt-0">{{ item.name }}</v-card-title>
          </v-img>
          <v-card-subtitle class="pt-4">
            {{ item.category }}
          </v-card-subtitle>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text">查看單位</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import userService from '@/services/user'

const createSnackbar = useSnackbar()

const favorites = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await userService.getFavorites()
    favorites.value = data.result
  } catch (error) {
    console.error('Error fetching favorites:', error)
    createSnackbar({
      text: '無法載入收藏列表',
      snackbarProps: { color: 'red' },
    })
  } finally {
    loading.value = false
  }
})
</script> -->