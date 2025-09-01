<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 text-center">單位管理</h1>
      </v-col>
      <v-divider />
      <v-col cols="12">
        <v-data-table :filter-keys="filterKeys" :headers="headers" :items="orgs" :search="search">
          <template #top>
            <v-toolbar>
              <div class="px-4">
                <v-btn variant="outlined" @click="openDialog(null)">新增單位</v-btn>
              </div>
              <v-spacer />
              <div class="px-4">
                <v-text-field
                  v-model="search"
                  density="compact"
                  flat
                  hide-details
                  placeholder="搜尋單位"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo"
                  width="400"
                />
              </div>
            </v-toolbar>
          </template>
          <template #[`item.image`]="{ value }">
            <v-img :src="value" width="75" />
          </template>
          <template #[`item.sell`]="{ value }">
            <v-icon v-if="value" icon="mdi-check" />
          </template>
          <template #[`item.action`]="{ item }">
            <v-btn icon="mdi-pencil" variant="text" @click="openDialog(item)" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="dialog.open" persistent width="600">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card>
        <v-card-title>{{ dialog.id.length > 0 ? '編輯單位' : '新增單位' }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="單位名稱"
          />
          <v-select
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
            :items="categoryOptions"
            label="分類"
          />
          <v-textarea
            v-model="address.value.value"
            :error-messages="address.errorMessage.value"
            label="地址"
          />
          <v-text-field
            v-model="phone.value.value"
            :error-messages="phone.errorMessage.value"
            label="電話"
          />
          <v-text-field
            v-model="mail.value.value"
            :error-messages="mail.errorMessage.value"
            label="電子信箱"
          />
          <v-text-field
            v-model="fb.value.value"
            :error-messages="fb.errorMessage.value"
            label="Facebook網站"
          />
          <v-text-field
            v-model="website.value.value"
            :error-messages="website.errorMessage.value"
            label="官方網站"
          />
          <v-text-field
            v-model="openingHours.value.value"
            :error-messages="openingHours.errorMessage.value"
            label="營業狀況"
          />
          <v-textarea
            v-model="description.value.value"
            :error-messages="description.errorMessage.value"
            label="描述"
          />
          <VueFileAgent
            ref="fileAgent"
            v-model="fileRecords"
            v-model:raw-model-value="rawFileRecords"
            accept="image/jpeg,image/png"
            deletable
            :error-text="{ type: '檔案格式不正確', size: '檔案大小不得超過 1MB' }"
            help-text="選擇或拖拽檔案"
            max-size="1MB"
          />
          <v-checkbox
            v-model="sell.value.value"
            :error-messages="sell.errorMessage.value"
            hide-details
            label="上架"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" :disabled="isSubmitting" @click="closeDialog">取消</v-btn>
          <v-btn color="green" :loading="isSubmitting" type="submit">
            {{ dialog.id.length > 0 ? '編輯' : '新增' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
  import { useField, useForm } from 'vee-validate'
  import { ref, useTemplateRef } from 'vue'
  import { useSnackbar } from 'vuetify-use-dialog'
  import * as yup from 'yup'
  import orgService from '@/services/org'

  const createSnackbar = useSnackbar()

  const orgs = ref([])
  const search = ref('')

  // ************************
  // *       表格顯示        *
  // ************************
  const headers = [
    { title: 'ID', key: '_id' },
    { title: '圖片', key: 'image', sortable: false },
    { title: '名稱', key: 'name' },
    { title: '分類', key: 'category' },
    { title: '地址', key: 'address' },
    { title: '電話', key: 'phone' },
    { title: '描述', key: 'description' },
    { title: '上架', key: 'sell' },
    { title: '建立日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
    { title: '更新日期', key: 'updatedAt', value: item => new Date(item.updatedAt).toLocaleString() },
    { title: '操作', key: 'action', sortable: false },
  ]
  const filterKeys = ['_id', 'name', 'category', 'description', 'createdAt', 'updatedAt', 'address', 'phone']

  // 從後端 API 獲取產品資料的非同步函數
  const getOrgs = async () => {
    try {
      const { data } = await orgService.getAll()
      orgs.value = data.orgs
    } catch (error) {
      console.error('Error fetching orgs:', error)
      createSnackbar({
        text: '無法載入單位資料',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  }
  getOrgs()

  // ************************
  // *         表單          *
  // ************************
  const fileAgent = useTemplateRef('fileAgent')
  const dialog = ref({
    // 控制對話框開關
    open: false,
    // 當前操作的單位 ID
    // 如果是新增單位，則為空字串
    // 如果是編輯單位，則為該單位的 ID
    id: '',
  })

  // 打開表單對話框
  // 如果是編輯，會傳入 item，表單欄位填入該單位的資料
  // 如果是新增，不會有 item
  const openDialog = item => {
    if (item) {
      dialog.value.id = item._id
      name.value.value = item.name
      category.value.value = item.category
      address.value.value = item.address
      phone.value.value = item.phone
      mail.value.value = item.mail
      fb.value.value = item.fb
      website.value.value = item.website
      openingHours.value.value = item.openingHours
      description.value.value = item.description
      sell.value.value = item.sell
    }
    dialog.value.open = true
  }
  // 關閉表單對話框
  // 重置表單欄位
  // 刪除圖片欄位的檔案
  const closeDialog = () => {
    dialog.value.open = false
    dialog.value.id = ''
    resetForm()
    fileAgent.value.deleteFileRecord()
  }
  const categoryOptions = ['北部', '中部', '南部']
  const { handleSubmit, resetForm, isSubmitting } = useForm({
    validationSchema: yup.object({
      name: yup
        .string()
        .required('單位名稱是必填的')
        .max(100, '單位名稱最多只能有 100 個字元'),
      category: yup
        .string()
        .required('分類是必填的')
        .oneOf(categoryOptions, '請選擇有效的分類'),
      address: yup
        .string()
        .required('地址是必填的')
        .max(100, '地址多只能有 100 個字元'),
      phone: yup
        .string()
        .typeError('電話是必填的')
        .required('電話是必填的'),
      description: yup
        .string()
        .max(500, '描述最多只能有 500 個字元'),
      sell: yup
        .boolean()
        .required('是否上架是必填的'),
    }),
    initialValues: {
      name: '',
      category: '',
      description: '',
      sell: false,
    },
  })
  const name = useField('name')
  const category = useField('category')
  const address = useField('address')
  const mail = useField('mail')
  const fb = useField('fb')
  const website = useField('website')
  const openingHours = useField('openingHours')
  const phone = useField('phone')
  const description = useField('description')
  const sell = useField('sell')
  const fileRecords = ref([])
  const rawFileRecords = ref([])

  const submit = handleSubmit(async values => {
    // 如果圖片欄位有錯誤，不執行
    if (fileRecords.value[0]?.error) {
      createSnackbar({
        text: '請選擇有效的圖片檔案',
        snackbarProps: {
          color: 'red',
        },
      })
      return
    }
    // 新增單位必須有圖片
    // 編輯單位沒有圖片就是沿用舊的圖片
    if (dialog.value.id.length === 0 && fileRecords.value.length === 0) {
      createSnackbar({
        text: '請上傳單位圖片',
        snackbarProps: {
          color: 'red',
        },
      })
      return
    }

    // 送出
    try {
      // 建立 FormData 格式資料
      // fd.append(欄位名稱, 欄位值)
      const fd = new FormData()
      fd.append('name', values.name)
      fd.append('category', values.category)
      fd.append('address', values.address)
      fd.append('mail', values.mail)
      fd.append('fb', values.fb)
      fd.append('website', values.website)
      fd.append('openingHours', values.openingHours)
      fd.append('addres', values.addres)
      fd.append('phone', values.phone)
      fd.append('description', values.description)
      fd.append('sell', values.sell)

      // 有圖片才放圖片
      if (fileRecords.value.length > 0) {
        fd.append('image', fileRecords.value[0].file)
      }

      // 根據動作是新增還是編輯，呼叫不同的 API
      await (dialog.value.id.length === 0 ? orgService.create(fd) : orgService.update(dialog.value.id, fd))

      createSnackbar({
        text: '操作成功！',
        snackbarProps: {
          color: 'green',
        },
      })
      // 關閉對話框
      closeDialog()
      // 重新載入單位列表
      getOrgs()
    } catch (error) {
      console.error(error)
      createSnackbar({
        text: error?.response?.data?.message || '操作失敗，請稍後再試',
        snackbarProps: {
          color: 'red',
        },
      })
    }
  })
</script>

<route lang="yaml">
  meta:
    layout: 'admin'
    # 標題
    title: '單位管理'
    # 只能在登入的情況下看
    login: 'login-only'
    # 只有管理員能看
    admin: true
</route>
