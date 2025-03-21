import { http } from './request'
import { LoginParams, LoginResponseData, LogoutParams } from './types'

export const userApi = {
  // 登录
  login: (params: LoginParams) => {
    return http.post<LoginResponseData>('/User/Login', params)
  },

  // 退出登录
  logout: (params: LogoutParams) => {
    return http.post('/User/Exit', params)
  },

  // 获取用户信息
  getUserInfo: (name: string) => http.post('/User/Query', { name })
}
