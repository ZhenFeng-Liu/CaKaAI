import { useCallback } from 'react'

interface MenuPermission {
  menu: any
  buttons: Array<any>
}

export const usePermissions = () => {
  // 每次调用都读取最新的localStorage.menuPermissions
  const getPermissions = () => {
    const permissionsStr = localStorage.getItem('menuPermissions')
    return permissionsStr ? (JSON.parse(permissionsStr) as MenuPermission[]) : []
  }

  const checkMenuPermission = useCallback((menuName: string) => {
    const permissions = getPermissions()
    return permissions.some((p) => p.menu.menu === menuName)
  }, [])

  const checkButtonPermission = useCallback((menuName: string, buttonName: string) => {
    const permissions = getPermissions()
    const menu = permissions.find((p) => p.menu.menu === menuName)
    return menu?.buttons.some((b) => b.name === buttonName && b.enable === 1) ?? false
  }, [])

  return {
    checkMenuPermission,
    checkButtonPermission
  }
}
