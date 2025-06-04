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
