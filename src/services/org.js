import apiService from './api'

export default {
  // 建立單位(需登入)
  create (data) {
    return apiService.apiAuth.post('/org', data)
  },
  // 管理員取所有單位(需登入)
  getAll () {
    return apiService.apiAuth.get('/org/all')
  },
  // 呈現單位(不登入也能看)
  get () {
    return apiService.api.get('/org')
  },
  getId (id) {
    return apiService.api.get('/org/' + id)
  },
  // 新增
  update (id, data) {
    return apiService.apiAuth.patch(`/org/${id}`, data)
  },
}
