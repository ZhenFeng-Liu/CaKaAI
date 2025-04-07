import { http } from './request'

// 按钮项类型定义
interface ButtonItem {
  enable: number
  info: string
  name: string
  uid: number
}

// 菜单项类型定义
interface MenuItem {
  buttonList: (ButtonItem[] | null)[]
  enable: number
  menu: string
  uid: number
}

// API 响应类型定义
interface MenuResponse {
  Code: number
  Data: {
    records: MenuItem[]
  }
  Msg: string
}

// 菜单相关 API
export const menuApi = {
  /**
   * 查询菜单列表
   * @returns Promise<MenuResponse>
   */
  query: () => {
    return http.post<MenuResponse>('/Menu/Query', {})
  },

  /**
   * 将原始菜单数据转换为更易用的格式
   * @param menuData 原始菜单数据
   */
  transformMenuData: (menuData: any) => {
    return menuData.map((item) => ({
      key: item.uid,
      label: item.menu,
      enable: item.enable === 1,
      buttons:
        item.buttonList?.[0]?.map((btn) => ({
          key: btn.uid,
          label: btn.name,
          enable: btn.enable === 1,
          info: btn.info
        })) || []
    }))
  }
}

// 导出类型定义供其他文件使用
export type { ButtonItem, MenuItem, MenuResponse }
