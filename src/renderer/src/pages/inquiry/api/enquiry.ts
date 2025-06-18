import { http } from './request'

// 基础请求参数接口
export interface BaseEnquiryParams {
  user_id: number
  user_name: string
  prod_type: string
  filter: Record<string, any>
}

// 流式询价响应类型
export interface StreamEnquiryResponse {
  data: any
  type: 'data' | 'error' | 'complete'
  message?: string
}

// 流式询价配置接口
export interface StreamEnquiryConfig {
  onMessage?: (data: any) => void
  onError?: (error: Event) => void
  onComplete?: () => void
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

// 木卡房卡询价参数
export interface WoodenRoomCardFilter {
  prod_length: string
  prod_width: string
  material: string
  thickness: string
  craft: string //若干个用+拼接
  chip_material_code: string
  encrypt: string
}

// DND房卡询价参数
export interface DNDRoomCardFilter {
  prod_length: string
  prod_width: string
  material: string
  thickness: string
  craft: string //若干个用+拼接
}

// 产品类型枚举
export enum ProductType {
  ROOM_CARD = 'room_card',
  ROOM_CARD_WC = 'room_card_wc',
  ROOM_CARD_DND = 'room_card_dnd',
  SLIPPER = 'slipper',
  PEN = 'pen',
  UMBRELLA = 'umbrella',
  BADGE_LANYARD = 'badge_lanyard',
  SIX_SMALL_ITEMS = 'six_small_items'
}

// 导出询价记录参数接口
export interface DownloadEnquiryParams {
  unique_id: string
}

// 导出询价记录响应类型
export interface DownloadEnquiryResponse {
  data: Blob
  filename?: string
}

// 导出询价记录配置接口
export interface DownloadEnquiryConfig {
  filename?: string
  onProgress?: (progress: number) => void
  onSuccess?: (data: Blob, filename: string) => void
  onError?: (error: Error) => void
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
 * 木卡房卡询价
 * @param filter 房卡询价参数
 * @returns Promise<any>
 */
export const WoodenRoomCardEnquiry = async (filter: WoodenRoomCardFilter): Promise<any> => {
  return enquiry(ProductType.ROOM_CARD_WC, filter)
}

/**
 * DND房卡询价
 * @param filter 房卡询价参数
 * @returns Promise<any>
 */
export const DNDRoomCardEnquiry = async (filter: DNDRoomCardFilter): Promise<any> => {
  return enquiry(ProductType.ROOM_CARD_DND, filter)
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

/**
 * 流式询价函数
 * @param prodType 产品类型
 * @param filter 产品特定的过滤参数
 * @param config 流式询价配置
 * @returns EventSource 实例
 */
export const streamEnquiry = (
  prodType: ProductType,
  filter: Record<string, any>,
  config?: StreamEnquiryConfig
): EventSource => {
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

  // 构建查询字符串
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(JSON.stringify(value))}`)
    .join('&')

  // 创建 EventSource 实例
  const eventSource = new EventSource(`http://192.168.0.111:9919/api/v1/enquiry?${queryString}`)

  // 设置事件处理器
  eventSource.onmessage = (event) => {
    try {
      const response: StreamEnquiryResponse = JSON.parse(event.data)
      if (response.type === 'data' && config?.onMessage) {
        config.onMessage(response.data)
      } else if (response.type === 'error') {
        eventSource.close()
        if (config?.onError) {
          config.onError(new CustomEvent('error', { detail: response.message }))
        }
      } else if (response.type === 'complete') {
        eventSource.close()
        if (config?.onComplete) {
          config.onComplete()
        }
      }
    } catch (error) {
      eventSource.close()
      if (config?.onError) {
        config.onError(new CustomEvent('error', { detail: '解析响应数据失败' }))
      }
    }
  }

  eventSource.onerror = (error) => {
    eventSource.close()
    if (config?.onError) {
      config.onError(error)
    }
  }

  return eventSource
}

/**
 * 房卡流式询价
 * @param filter 房卡询价参数
 * @param config 流式询价配置
 * @returns EventSource 实例
 */
export const streamRoomCardEnquiry = (filter: RoomCardFilter, config?: StreamEnquiryConfig): EventSource => {
  return streamEnquiry(ProductType.ROOM_CARD, filter, config)
}

/**
 * 拖鞋流式询价
 * @param filter 拖鞋询价参数
 * @param config 流式询价配置
 * @returns EventSource 实例
 */
export const streamSlipperEnquiry = (filter: SlipperFilter, config?: StreamEnquiryConfig): EventSource => {
  return streamEnquiry(ProductType.SLIPPER, filter, config)
}

/**
 * 环保笔流式询价
 * @param filter 环保笔询价参数
 * @param config 流式询价配置
 * @returns EventSource 实例
 */
export const streamPenEnquiry = (filter: PenFilter, config?: StreamEnquiryConfig): EventSource => {
  return streamEnquiry(ProductType.PEN, filter, config)
}

/**
 * 伞流式询价
 * @param filter 伞询价参数
 * @param config 流式询价配置
 * @returns EventSource 实例
 */
export const streamUmbrellaEnquiry = (filter: UmbrellaFilter, config?: StreamEnquiryConfig): EventSource => {
  return streamEnquiry(ProductType.UMBRELLA, filter, config)
}

/**
 * 胸牌流式询价
 * @param filter 胸牌询价参数
 * @param config 流式询价配置
 * @returns EventSource 实例
 */
export const streamBadgeLanyardEnquiry = (filter: BadgeLanyardFilter, config?: StreamEnquiryConfig): EventSource => {
  return streamEnquiry(ProductType.BADGE_LANYARD, filter, config)
}

/**
 * 六小件流式询价
 * @param filter 六小件询价参数
 * @param config 流式询价配置
 * @returns EventSource 实例
 */
export const streamSixSmallItemsEnquiry = (filter: SixSmallItemsFilter, config?: StreamEnquiryConfig): EventSource => {
  return streamEnquiry(ProductType.SIX_SMALL_ITEMS, filter, config)
}

/**
 * 基础导出询价记录函数
 * @param uniqueId 询价记录的唯一标识
 * @returns Promise<Blob> 返回文件blob数据
 */
export const downloadEnquiry = async (uniqueId: string): Promise<Blob> => {
  if (!uniqueId) {
    throw new Error('询价记录ID不能为空')
  }

  try {
    const response = await http.get<Blob>(
      '/download-enquiry',
      { unique_id: uniqueId },
      {
        responseType: 'blob'
      }
    )
    return response
  } catch (error) {
    throw new Error(`导出询价记录失败: ${error}`)
  }
}

/**
 * 高级导出询价记录函数（支持进度回调和自动保存）
 * @param uniqueId 询价记录的唯一标识
 * @param config 下载配置选项
 * @returns Promise<void>
 */
export const downloadEnquiryWithProgress = async (uniqueId: string, config?: DownloadEnquiryConfig): Promise<void> => {
  if (!uniqueId) {
    const error = new Error('询价记录ID不能为空')
    config?.onError?.(error)
    throw error
  }

  try {
    // 获取文件数据
    const blob = await downloadEnquiry(uniqueId)

    // 生成文件名
    const defaultFilename = `enquiry_${uniqueId}_${new Date().toISOString().split('T')[0]}.xlsx`
    const filename = config?.filename || defaultFilename

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'

    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 清理URL对象
    window.URL.revokeObjectURL(url)

    // 调用成功回调
    config?.onSuccess?.(blob, filename)
  } catch (error) {
    const downloadError = error instanceof Error ? error : new Error(String(error))
    config?.onError?.(downloadError)
    throw downloadError
  }
}

/**
 * 便捷导出询价记录函数（推荐使用）
 * @param uniqueId 询价记录的唯一标识
 * @param filename 可选的文件名
 * @returns Promise<void>
 */
export const exportEnquiry = async (uniqueId: string, filename?: string): Promise<void> => {
  return downloadEnquiryWithProgress(uniqueId, {
    filename,
    onSuccess: (blob, filename) => {
      console.log(`询价记录导出成功: ${filename}`)
    },
    onError: (error) => {
      console.error('询价记录导出失败:', error.message)
    }
  })
}

/*
导出询价记录接口 get请求 http://192.168.0.111:9919/api/v1/download-enquiry?unique_id=f78b7146
*/
