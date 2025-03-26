import { useState } from 'react'

interface UserInfo {
  roleList?: Array<{
    admin?: number
  }>
}

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(() => {
    // 从 localStorage 读取初始值
    return localStorage.getItem('isAdmin') === 'true'
  })

  const checkIsAdmin = (userInfo: UserInfo) => {
    // 判断是否为超级管理员
    const isAdminUser = userInfo?.roleList?.[0]?.admin === 1
    setIsAdmin(isAdminUser)

    // 存储到 localStorage
    localStorage.setItem('isAdmin', String(isAdminUser))

    return isAdminUser
  }

  return {
    isAdmin,
    checkIsAdmin
  }
}
