// API 响应类型定义
export interface ApiResponse<T = any> {
  Code: number
  Data: T
  Msg: string // token值
}

// 登录请求参数类型
export interface LoginParams {
  name: string // 修改为和后端一致
  psw: string // 修改为和后端一致
  tokenTime?: number // 可选的token有效期
}

// 登录响应数据类型
export interface LoginResponseData<T = any> {
  Code: number
  Data: T
  Msg: string // token值
}

// 退出登录请求参数类型
export interface LogoutParams {
  uid: number
}
