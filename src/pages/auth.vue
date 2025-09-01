<template>
  <v-parallax
    height="calc(100vh - 64px)"
    :src="authBg"
  >
    <div class="d-flex flex-column fill-height justify-center align-center">
      <v-card class="auth-card" max-width="550px" width="100%">
        <!-- <v-toolbar
          color="rgba(0, 0, 0, 0.3)"
          dark
          flat
        >
          <v-toolbar-title class="text-center text-h5 font-weight-light">
            毛孩救援站
          </v-toolbar-title>
        </v-toolbar> -->
        <v-tabs v-model="tab" background-color="transparent" color="secondary" grow>
          <v-tab value="login">登入</v-tab>
          <v-tab value="register">註冊</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <!-- 登入表單 -->
          <v-window-item value="login">
            <v-card-text class="px-6 py-8">
              <v-form :disabled="loginForm.isSubmitting.value" @submit.prevent="login">
                <v-text-field
                  v-model="loginAccount.value.value"
                  :error-messages="loginAccount.errorMessage.value"
                  label="帳號或信箱"
                  required
                  variant="underlined"
                />
                <v-text-field
                  v-model="loginPassword.value.value"
                  counter
                  :error-messages="loginPassword.errorMessage.value"
                  label="密碼"
                  maxlength="20"
                  minlength="4"
                  required
                  type="password"
                  variant="underlined"
                />
                <v-btn
                  block
                  class="mt-6"
                  color="tea"
                  :loading="loginForm.isSubmitting.value"
                  size="large"
                  type="submit"
                >登入</v-btn>
              </v-form>
            </v-card-text>
          </v-window-item>

          <!-- 註冊表單 -->
          <v-window-item value="register">
            <v-card-text class="px-6 py-8">
              <v-form :disabled="registerForm.isSubmitting.value" @submit.prevent="register">
                <v-text-field
                  v-model="registerAccount.value.value"
                  counter
                  :error-messages="registerAccount.errorMessage.value"
                  label="帳號"
                  maxlength="20"
                  minlength="4"
                  required
                  variant="underlined"
                />
                <v-text-field
                  v-model="email.value.value"
                  :error-messages="email.errorMessage.value"
                  label="信箱"
                  required
                  variant="underlined"
                />
                <v-text-field
                  v-model="registerPassword.value.value"
                  counter
                  :error-messages="registerPassword.errorMessage.value"
                  label="密碼"
                  maxlength="20"
                  minlength="4"
                  required
                  type="password"
                  variant="underlined"
                />
                <v-text-field
                  v-model="confirmPassword.value.value"
                  counter
                  :error-messages="confirmPassword.errorMessage.value"
                  label="確認密碼"
                  maxlength="20"
                  minlength="4"
                  required
                  type="password"
                  variant="underlined"
                />
                <v-btn
                  block
                  class="mt-6"
                  color="tea"
                  :loading="registerForm.isSubmitting.value"
                  size="large"
                  type="submit"
                >註冊</v-btn>
              </v-form>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </div>
  </v-parallax>
</template>

<script setup>
  import validator from 'validator'
  import { useField, useForm } from 'vee-validate'
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import * as yup from 'yup'
  import authBg from '@/assets/auth-bg.jpg'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const createSnackbar = useSnackbar()
  const router = useRouter()
  const route = useRoute()
  const user = useUserStore()

  const tab = ref('login')

  // --- 登入邏輯 ---
  const loginSchema = yup.object({
    account: yup.string().required('帳號或電子郵件是必填的'),
    password: yup.string().required('密碼是必填的').min(4, '密碼至少需要 4 個字元').max(20, '密碼最多只能有 20 個字元'),
  })
  const loginForm = useForm({ validationSchema: loginSchema })
  const loginAccount = useField('account', loginSchema)
  const loginPassword = useField('password', loginSchema)

  const login = loginForm.handleSubmit(async values => {
    try {
      const { data } = await userService.login({ account: values.account, password: values.password })
      user.login(data.user)
      createSnackbar({ text: '登入成功！', snackbarProps: { color: 'green' } })
      router.push('/')
    } catch (error) {
      console.error(error)
      createSnackbar({ text: error?.response?.data?.message || '登入失敗，請稍後再試！', snackbarProps: { color: 'red' } })
    }
  })

  // --- 註冊邏輯 ---
  const registerSchema = yup.object({
    account: yup.string().required('帳號是必填的').min(4, '帳號至少需要 4 個字元').max(20, '帳號最多只能有 20 個字元').test('isAlphanumeric', '帳號只能包含英文字母和數字', value => validator.isAlphanumeric(value)),
    email: yup.string().required('電子郵件是必填的').test('isEmail', '請輸入有效的電子郵件地址', value => validator.isEmail(value)),
    password: yup.string().required('密碼是必填的').min(4, '密碼至少需要 4 個字元').max(20, '密碼最多只能有 20 個字元'),
    confirmPassword: yup.string().required('確認密碼是必填的').oneOf([yup.ref('password')], '密碼和確認密碼必須相同'),
  })
  const registerForm = useForm({ validationSchema: registerSchema })
  const registerAccount = useField('account', registerSchema)
  const email = useField('email', registerSchema)
  const registerPassword = useField('password', registerSchema)
  const confirmPassword = useField('confirmPassword', registerSchema)

  const register = registerForm.handleSubmit(async values => {
    try {
      await userService.create({ account: values.account, email: values.email, password: values.password })
      createSnackbar({ text: '註冊成功！', snackbarProps: { color: 'green' } })
      // 註冊成功後，切換到登入頁籤
      tab.value = 'login'
    } catch (error) {
      console.error(error)
      createSnackbar({ text: error?.response?.data?.message || '註冊失敗，請稍後再試！', snackbarProps: { color: 'red' } })
    }
  })

  // 監聽路由 query 變化，切換頁籤
  watch(() => route.query.tab,
        newTab => {
          if (newTab === 'register' || newTab === 'login') {
            tab.value = newTab
          }
        },
        { immediate: true },
  )
</script>

<style scoped>
.auth-card {
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.8) !important;
}
</style>

<route lang="yaml">
meta:
  title: '登入 / 註冊'
  login: 'no-login-only'
  admin: false
</route>
