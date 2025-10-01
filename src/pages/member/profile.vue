<template>
  <h2 class="text-h5 font-weight-bold mb-4">個人資料</h2>
  <v-form v-model="isFormValid" @submit.prevent="submitForm">
    <v-text-field
      v-model="form.account"
      class="mb-4"
      disabled
      label="帳號"
      readonly
      variant="outlined"
    />
    <v-text-field
      v-model="form.email"
      class="mb-4"
      label="變更信箱"
      :rules="[rules.required, rules.email]"
      type="email"
      variant="outlined"
    />
    <v-text-field
      v-model="form.password"
      class="mb-4"
      label="原始密碼"
      :rules="[rules.required, rules.minLength]"
      type="password"
      variant="outlined"
    />
    <v-text-field
      v-model="form.newPassword"
      class="mb-4"
      label="變更密碼"
      :rules="[rules.required, rules.minLength]"
      type="password"
      variant="outlined"
    />
    <div class="text-center">
      <v-btn color="tea" :disabled="!isFormValid" :loading="isLoading" type="submit">
        儲存更新
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const createSnackbar = useSnackbar()

  const isFormValid = ref(false)
  const isLoading = ref(false)

  // 建立一個給表單專用的 ref，並從 user store 取得初始資料。
  // 這樣做的好處是，在使用者按下儲存前，不會直接修改到 store 中的全域狀態。
  const form = ref({
    account: user.account,
    email: user.email,
  })

  const rules = {
    required: value => !!value || '此欄位為必填',
    email: value => {
      const pattern = /.+@.+\..+/
      return pattern.test(value) || '信箱格式不正確'
    },
  }

  const submitForm = async () => {
    if (!isFormValid.value) return

    isLoading.value = true
    try {
      // 假設您的 userService 中有一個 updateProfile 的方法來更新資料
      // 我們只送出可以被使用者修改的欄位，例如 email
      await userService.updateProfile({ email: form.value.email })

      // 後端更新成功後，同步更新 Pinia store 中的資料，讓整個網站的狀態保持一致
      user.email = form.value.email

      createSnackbar({
        text: '個人資料更新成功！',
        snackbarProps: {
          color: 'success',
          location: 'top',
        },
      })
    } catch (error) {
      console.error('更新個人資料失敗', error)
      const text = error.response?.data?.message || '更新失敗，請稍後再試'
      createSnackbar({
        text,
        snackbarProps: {
          color: 'error',
          location: 'top',
        },
      })
    } finally {
      isLoading.value = false
    }
  }
</script>
