// API 响应类型定义
export interface ApiResponse<T = any> {
  Code: number
  Data: T
  Msg: string
}

// 品类类型
export type ProdType =
  | 'slipper'
  // | 'room_card'
  // | 'room_card_wc'
  // | 'room_card_dnd'
  | 'pen'
  | 'umbrella'
  | 'badge_lanyard'
  | 'six_small_items'

// 品类数据接口响应
export interface ProdTypeResponse {
  // 根据实际返回数据结构定义
  [key: string]: any
}

// 品类参数接口响应
export interface ProdTypeParamsResponse {
  // 根据实际返回数据结构定义
  [key: string]: any
}
