import { http } from './request'

// 询价记录查询参数
export interface QueryEnquiryParams {
  userId: number
}

/**
 * 查询询价记录
 * @returns Promise<any>
 */
export const queryEnquiry = async (): Promise<any> => {
  // 从 localStorage 获取用户信息
  const userInfoStr = localStorage.getItem('userInfo')
  if (!userInfoStr) {
    throw new Error('未找到用户信息')
  }

  const userInfo = JSON.parse(userInfoStr)
  const params: QueryEnquiryParams = {
    userId: userInfo.uid
  }

  return http.get('/query-enquiry', params)
}
