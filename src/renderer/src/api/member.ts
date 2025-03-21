import { http } from './request'

// 用户相关类型定义
export interface MemberParams {
  name?: string // 用户名称，查询时可选
}

export interface MemberData {
  enable: number
  exited: number
  name: string
  psw: string
  roleList: []
  tokenTime: number
  uid: number
}

export interface AddMemberParams {
  name: string // 用户名称
  psw: string // 用户密码
}

export interface UpdateMemberParams {
  uid: number
  name?: string
  enable?: number // 添加可选的 enable 参数
  psw?: string // 同时添加可选的 psw 参数，用于密码重置
  roleIds?: number[] // 添加可选的 roleIds 参数，用于角色分配
}

export interface DeleteMemberParams {
  uid: number // 用户ID
}

// 添加分配角色参数接口
export interface AssignRoleParams {
  userId: number
  roleIdStr: string
}

// 用户相关 API 请求
export const memberApi = {
  // 查询用户列表
  query: (params?: MemberParams) => {
    return http.post<{ records: MemberData[] }>('/User/Query', params)
  },

  // 新增用户
  add: (params: AddMemberParams) => {
    return http.post('/User/Add', params)
  },

  // 更新用户
  update: (params: UpdateMemberParams) => {
    return http.post('/User/Update', params)
  },

  // 删除用户
  delete: (params: DeleteMemberParams) => {
    return http.post('/User/Delete', params)
  },

  // 分配角色
  assignRole: (params: AssignRoleParams) => {
    return http.post('/UserRole/AssignRole', params)
  }
}
