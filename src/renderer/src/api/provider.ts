import { http } from './request'

// AI提供商相关类型定义
export interface ProviderParams {
  name?: string // AI提供商名称，查询时可选
}

export const providerApi = {
  query: (params?: ProviderParams) => http.post('/Brand/Query', params),
  getProviderTypes: (params?: any) => http.post('/Provider/Query', params),
  add: (params: any) => http.post('/Brand/Add', params),
  update: (params: any) => http.post('/Brand/Update', params),
  delete: (params: any) => http.post('/Brand/Delete', params)
}
