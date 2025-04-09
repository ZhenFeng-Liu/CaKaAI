import { message } from 'antd'

// API 配置
export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.123:9019/ServCaka', // 正式环境
  // BASE_URL: 'http://192.168.0.111:9019/ServCaka', // 本地环境
  TIMEOUT: 10000
}

// API 错误码
export const API_ERROR_CODE = {
  SUCCESS: 0,
  TOKEN_EXPIRED: 401,
  SERVER_ERROR: 500
}

// 统一错误处理
export const handleApiError = (error: any) => {
  if (error.response) {
    const { status } = error.response
    switch (status) {
      case 401:
        message.error('登录已过期,请重新登录')
        // 清除token并跳转登录页
        localStorage.removeItem('token')
        break
      case 500:
        message.error('服务器错误,请稍后重试')
        break
      default:
        message.error(error.message || '请求失败')
    }
  } else {
    message.error('网络错误,请检查网络连接')
  }
  return Promise.reject(error)
}
