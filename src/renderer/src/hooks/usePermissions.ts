import { useMemo } from 'react'

interface MenuPermission {
  menu: any
  buttons: Array<any>
}

export const usePermissions = () => {
  const permissions = useMemo(() => {
    const permissionsStr = localStorage.getItem('menuPermissions')
    return permissionsStr ? (JSON.parse(permissionsStr) as MenuPermission[]) : []
  }, [])
  const checkMenuPermission = (menuName: string) => {
    return permissions.some((p) => p.menu.menu === menuName)
  }

  const checkButtonPermission = (menuName: string, buttonName: string) => {
    const menu = permissions.find((p) => p.menu.menu === menuName)
    return menu?.buttons.some((b) => b.name === buttonName && b.enable === 1) ?? false
  }

  return {
    checkMenuPermission,
    checkButtonPermission
  }
}
