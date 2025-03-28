import { userApi } from '@renderer/api/user' // 请根据实际路径调整
import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
import { message } from 'antd'
import { useState } from 'react'

interface UseUserInfoOptions {
  showMessage?: boolean
  redirectAfterSuccess?: boolean
  redirectUrl?: string
  onSuccess?: (userInfo: any) => void
  onError?: (error: any) => void
  setIsAuthenticated?: (value: boolean) => void
}

/**
 * 用户信息处理Hook
 * 用于获取、处理和缓存用户信息及权限
 */
export const useUserInfo = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const { checkIsAdmin } = useAdminCheck() // 添加这行
  /**
   * 获取并处理用户信息
   * @param uid 用户ID
   * @param options 配置选项
   */
  const fetchAndProcessUserInfo = async (uid: string, options: UseUserInfoOptions = {}) => {
    const {
      showMessage = true,
      redirectAfterSuccess = false,
      redirectUrl = '/#/',
      onSuccess,
      onError,
      setIsAuthenticated
    } = options

    setLoading(true)
    setError(null)

    try {
      if (showMessage) {
        message.loading('正在获取用户信息...', 0.5)
      }

      // 获取最新的用户信息
      const userInfoResponse = await userApi.getUserInfo(uid)

      if (userInfoResponse.Code === 0) {
        const userInfo = userInfoResponse.Data?.records[0]
        console.log('原始用户信息', userInfo)
        console.log('原始用户信息', userInfoResponse.Data)

        // 检查是否为管理员（假设checkIsAdmin是一个外部函数）
        // if (typeof window.checkIsAdmin === 'function') {
        //   window.checkIsAdmin(userInfo)
        // }
        // 使用 hook 检查管理员权限
        checkIsAdmin(userInfo)

        // 提取权限信息
        const menuPermissions =
          userInfo.roleList?.reduce(
            (acc, role) => {
              const roleMenus =
                role.menuList?.map((menu) => ({
                  menu: menu,
                  buttons: menu.buttonList || []
                })) || []
              return [...acc, ...roleMenus]
            },
            [] as Array<{ menu: any; buttons: any[] }>
          ) || []

        // 使用 Map 去重，以 menu.uid 为 key
        const uniqueMenus = Array.from(new Map(menuPermissions.map((item) => [item.menu.uid, item])).values())
        console.log('处理后的权限信息', uniqueMenus)

        // 存储用户信息和权限
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('menuPermissions', JSON.stringify(uniqueMenus))

        // 显示成功消息
        if (showMessage) {
          message.success({
            content: `欢迎回来，${userInfo.name || '用户'}`,
            duration: 2
          })
        }

        // 登录成功后跳转
        if (redirectAfterSuccess) {
          window.location.href = redirectUrl
        }

        // 更新认证状态
        if (setIsAuthenticated) {
          setIsAuthenticated(true)
        }

        // 调用成功回调
        if (onSuccess) {
          onSuccess(userInfo)
        }

        return { userInfo, menuPermissions: uniqueMenus }
      } else {
        const errorMsg = '获取用户信息失败，请重试'
        if (showMessage) {
          message.error({
            content: errorMsg,
            duration: 3
          })
        }

        setError(errorMsg)
        if (onError) {
          onError(errorMsg)
        }
        return null
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      const errorMsg = '获取用户信息失败，请检查网络连接'

      if (showMessage) {
        message.error({
          content: errorMsg,
          duration: 3
        })
      }

      setError(error)
      if (onError) {
        onError(error)
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchAndProcessUserInfo,
    loading,
    error
  }
}

export default useUserInfo
