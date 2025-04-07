import { useState } from 'react'

interface UserInfo {
  Roles?: Array<{
    admin?: number
  }>
}

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(() => {
    // 从 localStorage 读取初始值
    return localStorage.getItem('isAdmin') === 'true'
  })

  const checkIsAdmin = (userInfo: UserInfo) => {
    // // 判断是否为超级管理员
    // const isAdminUser = userInfo?.roleList?.[0]?.admin === 1
    // 遍历角色数组，只要有一个角色的 admin 为 1，就是管理员
    const isAdminUser = userInfo?.Roles?.some((role) => role.admin === 1) || false
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
