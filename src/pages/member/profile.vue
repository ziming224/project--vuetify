<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">個人資料</h2>
    <v-form>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="profile.account"
            label="帳號"
            readonly
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="profile.email"
            label="Email"
            readonly
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '@/services/user'
import { useSnackbar } from 'vuetify-use-dialog'

const createSnackbar = useSnackbar()
const profile = ref({
  account: '',
  email: ''
})

onMounted(async () => {
  try {
    const { data } = await userService.getProfile()
    profile.value.account = data.result.account
    profile.value.email = data.result.email
  } catch (error) {
    console.error('Failed to fetch profile', error)
    createSnackbar({ text: '無法載入個人資料', snackbarProps: { color: 'red' } })
  }
})
</script>