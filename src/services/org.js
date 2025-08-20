import apiService from './api'

export default {
  /**
   * 建立組織 (需登入，且為 FormData)
   * @param {FormData} data 組織資料
   * @returns {Promise}
   */
  create (data) {
    return apiService.apiAuth.post('/org', data)
  },
  /**
   * 管理員取得所有組織 (需登入)
   * @returns {Promise}
   */
  getAll () {
    return apiService.apiAuth.get('/org/all')
  },
  /**
   * 取得所有公開的組織 (不需登入)
   * @returns {Promise}
   */
  get () {
    return apiService.api.get('/org')
  },
  /**
   * 取得單一組織資料 (不需登入)
   * @param {string} id 組織 ID
   * @returns {Promise}
   */
  getId (id) {
    return apiService.api.get('/org/' + id)
  },
  /**
   * 更新組織 (需登入，且為 FormData)
   * @param {string} id 組織 ID
   * @param {FormData} data 組織資料
   * @returns {Promise}
   */
  update (id, data) {
    return apiService.apiAuth.patch(`/org/${id}`, data)
  },
}
