import { http } from './request'

// 基础请求参数接口
export interface BaseEnquiryParams {
  user_id: number
  user_name: string
  prod_type: string
  filter: Record<string, any>
}

// 房卡询价参数
export interface RoomCardFilter {
  material: string
  thickness: string
  length: string
  width: string
  craft: string
  chip: string
  encrypt: string
}

// 拖鞋询价参数
export interface SlipperFilter {
  texture: string
  size: string
  craft: string
  packaging: string
}

// 环保笔询价参数
export interface PenFilter {
  texture: string
  size: string
  craft: string
}

// 伞询价参数
export interface UmbrellaFilter {
  name: string
  texture: string
  size: string
  boneNum: string
  handShank: string
  craft: string
}

// 胸牌询价参数
export interface BadgeLanyardFilter {
  name: string
  size: string
  craft: string
}

// 六小件询价参数
export interface SixSmallItemsFilter {
  name: string
  texture: string
  thickness: string
  length: string
  width: string
  weight: string
  craft: string
}

// 产品类型枚举
export enum ProductType {
  ROOM_CARD = 'room_card',
  SLIPPER = 'slipper',
  PEN = 'pen',
  UMBRELLA = 'umbrella',
  BADGE_LANYARD = 'badge_lanyard',
  SIX_SMALL_ITEMS = 'six_small_items'
}

/**
 * 通用询价函数
 * @param prodType 产品类型
 * @param filter 产品特定的过滤参数
 * @returns Promise<any>
 */
export const enquiry = async (prodType: ProductType, filter: Record<string, any>): Promise<any> => {
  // 从 localStorage 获取用户信息
  const userInfoStr = localStorage.getItem('userInfo')
  if (!userInfoStr) {
    throw new Error('未找到用户信息')
  }

  const userInfo = JSON.parse(userInfoStr)
  const params: BaseEnquiryParams = {
    user_id: userInfo.uid,
    user_name: userInfo.name,
    prod_type: prodType,
    filter
  }

  return http.post('/enquiry', params)
}

/**
 * 房卡询价
 * @param filter 房卡询价参数
 * @returns Promise<any>
 */
export const roomCardEnquiry = async (filter: RoomCardFilter): Promise<any> => {
  return enquiry(ProductType.ROOM_CARD, filter)
}

/**
 * 拖鞋询价
 * @param filter 拖鞋询价参数
 * @returns Promise<any>
 */
export const slipperEnquiry = async (filter: SlipperFilter): Promise<any> => {
  return enquiry(ProductType.SLIPPER, filter)
}

/**
 * 环保笔询价
 * @param filter 环保笔询价参数
 * @returns Promise<any>
 */
export const penEnquiry = async (filter: PenFilter): Promise<any> => {
  return enquiry(ProductType.PEN, filter)
}

/**
 * 伞询价
 * @param filter 伞询价参数
 * @returns Promise<any>
 */
export const umbrellaEnquiry = async (filter: UmbrellaFilter): Promise<any> => {
  return enquiry(ProductType.UMBRELLA, filter)
}

/**
 * 胸牌询价
 * @param filter 胸牌询价参数
 * @returns Promise<any>
 */
export const badgeLanyardEnquiry = async (filter: BadgeLanyardFilter): Promise<any> => {
  return enquiry(ProductType.BADGE_LANYARD, filter)
}

/**
 * 六小件询价
 * @param filter 六小件询价参数
 * @returns Promise<any>
 */
export const sixSmallItemsEnquiry = async (filter: SixSmallItemsFilter): Promise<any> => {
  return enquiry(ProductType.SIX_SMALL_ITEMS, filter)
}
