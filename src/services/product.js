import apiService from './api'

export default {
  // 建立商品(需登入)
  create (data) {
    return apiService.apiAuth.post('/product', data)
  },
  // 管理員取所有商品(需登入)
  getAll () {
    return apiService.apiAuth.get('/product/all')
  },
  // 呈現商品(不登入也能看)
  get () {
    return apiService.api.get('/product')
  },
  getId (id) {
    return apiService.api.get('/product/' + id)
  },
  // 新增
  update (id, data) {
    return apiService.apiAuth.patch(`/product/${id}`, data)
  },
}
