import { http } from './request'

// 角色相关类型定义
export interface RoleParams {
  name?: string // 角色名称，查询时可选
  pageSize?: number // 每页条数，查询时可选
  pageNum?: number // 当前页码，查询时可选
}

export interface RoleData {
  admin: number
  buttonList: Array<{
    enable: number
    info: string
    name: string
    uid: number
  }>
  enable: number
  helperList: Array<any>
  info: string
  knowledgeList: Array<any>
  menuList: Array<{
    enable: number
    menu: string
    uid: number
  }>
  modelList: Array<any>
  name: string
  uid: number
}

export interface AddRoleParams {
  name?: string // 角色名称
  admin?: number // 是否管理员
  info?: string // 角色说明
  enable?: number // 是否启用
}

export interface UpdateRoleParams extends AddRoleParams {
  uid?: number // 角色ID
}

export interface DeleteRoleParams {
  uid?: number // 角色ID
}

export interface RoleMenuButtonParams {
  roleId: number // 角色ID
  menuIdStr: string // 菜单ID，用分号字符串拼接
  buttonIdStr: string // 按钮ID数组，用分号字符串拼接
}

// 角色相关 API 请求
export const roleApi = {
  // 查询角色列表
  query: (params?: RoleParams) => {
    return http.post<{ records: RoleData[] }>('/Role/Query', params)
  },

  // 新增角色
  add: (params: AddRoleParams) => {
    return http.post('/Role/Add', params)
  },

  // 更新角色
  update: (params: UpdateRoleParams) => {
    return http.post('/Role/Update', params)
  },

  // 删除角色
  delete: (params: DeleteRoleParams) => {
    return http.post('/Role/Delete', params)
  },

  // 角色菜单按钮授权
  rolemenubutton: (params: RoleMenuButtonParams) => {
    return http.post('/RoleMenuButton/AssignMenuButton', params)
  }
}
