import { ProdType } from '../api/types'

export const PRODUCT_TYPES = [
  // '房卡',
  //  '木卡房卡',
  //   'DND房卡',
  '拖鞋',
  '环保笔',
  '雨伞',
  '胸牌'
  // '六小件',
  // '智慧产品'
] as const
export type ProductType = (typeof PRODUCT_TYPES)[number]

export const PRODUCT_TYPE_MAP: Record<ProductType, ProdType> = {
  // 房卡: 'room_card',
  // 木卡房卡: 'room_card_wc',
  // DND房卡: 'room_card_dnd',
  拖鞋: 'slipper',
  环保笔: 'pen',
  雨伞: 'umbrella',
  胸牌: 'badge_lanyard'
  // 六小件: 'six_small_items',
  // 智慧产品: 'smart_products'
}
