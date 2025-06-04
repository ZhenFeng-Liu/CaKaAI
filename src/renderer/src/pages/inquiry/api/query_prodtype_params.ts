import { http } from './request'
import { ProdType, ProdTypeParamsResponse } from './types'

/**
 * 查询品类参数
 * @param prodType 品类类型
 * @returns Promise<ProdTypeParamsResponse>
 */
export const queryProdTypeParams = (prodType: ProdType): Promise<ProdTypeParamsResponse> => {
  return http.get<ProdTypeParamsResponse>('/query_prodtype_params', { prodType })
}
