import { http } from './request'
import { ProdType, ProdTypeResponse } from './types'

/**
 * 查询品类数据
 * @param prodType 品类类型
 * @returns Promise<ProdTypeResponse>
 */
export const queryProdType = (prodType: ProdType): Promise<ProdTypeResponse> => {
  return http.get<ProdTypeResponse>('/query_prodtype', { prodType })
}

/**
 * CSV文件下载类型
 */
export type CsvFileProdType = 'room_card' | 'slipper' | 'umbrella' | 'badge_lanyard' | 'six_small_items' | 'pen'

/**
 * 品类csv下载接口
 * @param prodType 品类
 * @returns Promise<Blob> 文件数据
 */
export const prodtypeDownload = (prodType: CsvFileProdType): Promise<Blob> => {
  return http.get<Blob>(
    '/prodtype-download',
    { prodType },
    {
      responseType: 'blob',
      headers: {
        Accept: 'application/octet-stream'
      }
    }
  )
}

/**
 * 产品类型枚举
 */
export type UploadProdType = 'room_card' | 'slipper' | 'umbrella' | 'badge_lanyard' | 'six_small_items' | 'pen'

/**
 * 上传请求参数类型
 */
export interface UploadParams {
  userId: number
  userName: string
  prodType: UploadProdType
  file: File
}

/**
 * 上传响应类型
 */
export interface UploadResponse {
  code: number
  message: string
  data?: any
}

/**
 * 上传CSV文件
 * @param params 上传参数
 * @returns Promise<UploadResponse>
 */
export const upload = (params: UploadParams): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('userId', params.userId.toString())
  formData.append('userName', params.userName)
  formData.append('prodType', params.prodType)
  formData.append('file', params.file)

  return http.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
