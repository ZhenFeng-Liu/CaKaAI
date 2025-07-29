import { message } from 'antd'

// API 配置
export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.123:9919/api/v1', // 正式环境，统一使用API文档中的基础URL
  // BASE_URL: 'http://192.168.0.111:9919/api/v1', // 本地环境，统一使用API文档中的基础URL
  TIMEOUT: 300000 // 增加到5分钟
}

// API 错误码
export const API_ERROR_CODE = {
  SUCCESS: 0,
  SERVER_ERROR: 500
}

// 统一错误处理
export const handleApiError = (error: any) => {
  if (error.response) {
    const { status } = error.response
    switch (status) {
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
