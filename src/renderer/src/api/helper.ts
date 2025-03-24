import { http } from './request'

export const helperApi = {
  // 查询助手列表
  query: (params?: any) => {
    return http.post('/Helper/Query', params)
  },
  // 新增助手
  add: (params: any) => {
    return http.post('/Helper/Add', params)
  },
  // 更新助手
  update: (params: any) => {
    return http.post('/Helper/Update', params)
  },
  // 删除助手
  delete: (params: any) => {
    return http.post('/Helper/Delete', params)
  },
  // 获取助手详情
  getDetail: (params: any) => {
    return http.post('/Helper/GetDetail', params)
  }
}
