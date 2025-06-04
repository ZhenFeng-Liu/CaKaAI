import type { ColumnsType } from 'antd/es/table'

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 产品数据类型
export interface ProductData {
  key: string
  index: number
  productNo: string
  category: string
  material: string
  thickness: string
  length: string
  width: string
  process: string
  chip: string
  encrypted: string
  sampleLead: string
  bulkLead: string
  ladderPrice: string
  proofingFee: string
  invoice: string
  tax: string
}

// 原始API返回的产品数据类型
export interface RawProductData {
  id: string
  material: string
  thickness: string
  length: string
  width: string
  craft: string
  chip: string
  encrypt: string
  proofingNum: string
  sampleDelTime: string
  prodDelTime: string
  stepNum: string
  sampleCharge: string
  invoices: string
  tax: string
}

// 拖鞋原始数据接口
export interface RawSlipperData {
  serial: string
  id: string
  material_code: string
  texture: string
  size: string
  craft: string
  packaging: string
  price: string
  proofingNum: string
  sampleDelTime: string
  prodDelTime: string
  sampleCharge: string
  invoices: string
  tax: string
}

// 拖鞋表格数据接口
export interface SlipperData {
  key: string
  serial: string
  productNo: string
  materialCode: string
  texture: string
  size: string
  craft: string
  packaging: string
  price: string
  proofingNum: string
  sampleLead: string
  bulkLead: string
  proofingFee: string
  invoice: string
  tax: string
}

// 环保笔原始数据接口
export interface RawEcoPenData {
  serial: string
  id: string
  material_code: string
  texture: string
  size: string
  craft: string
  proofingNum: string
  sampleDelTime: string
  prodDelTime: string
  stepNum: string
  sampleCharge: string
  invoices: string
  tax: string
}

// 环保笔表格数据接口
export interface EcoPenData {
  key: string
  serial: string
  productNo: string
  materialCode: string
  texture: string
  size: string
  craft: string
  proofingNum: string
  sampleLead: string
  bulkLead: string
  ladderPrice: string
  proofingFee: string
  invoice: string
  tax: string
}

// 雨伞原始数据接口
export interface RawUmbrellaData {
  serial: string
  id: string
  material_code: string
  name: string
  texture: string
  size: string
  boneNum: string
  handShank: string
  craft: string
  proofingNum: string
  sampleDelTime: string
  prodDelTime: string
  stepNum: string
  sampleCharge: string
  invoices: string
  tax: string
}

// 雨伞表格数据接口
export interface UmbrellaData {
  key: string
  serial: string
  productNo: string
  materialCode: string
  name: string
  texture: string
  size: string
  boneNum: string
  handShank: string
  craft: string
  proofingNum: string
  sampleLead: string
  bulkLead: string
  ladderPrice: string
  proofingFee: string
  invoice: string
  tax: string
}

// 胸牌原始数据接口
export interface RawBadgeData {
  serial: string
  id: string
  material_code: string
  name: string
  size: string
  craft: string
  proofingNum: string
  sampleDelTime: string
  prodDelTime: string
  stepNum: string
  sampleCharge: string
  invoices: string
  tax: string
  toolCharge: string
}

// 胸牌表格数据接口
export interface BadgeData {
  key: string
  serial: string
  productNo: string
  materialCode: string
  name: string
  size: string
  craft: string
  proofingNum: string
  sampleLead: string
  bulkLead: string
  ladderPrice: string
  proofingFee: string
  toolCharge: string
  invoice: string
  tax: string
}

// 六小件原始数据接口
export interface RawSixPieceData {
  serial: string
  id: string
  material_code: string
  name: string
  texture: string
  thickness: string
  length: string
  width: string
  weight: string
  craft: string
  proofingNum: string
  sampleDelTime: string
  prodDelTime: string
  stepNum: string
  sampleCharge: string
  invoices: string
  tax: string
}

// 六小件表格数据接口
export interface SixPieceData {
  key: string
  serial: string
  productNo: string
  materialCode: string
  name: string
  texture: string
  thickness: string
  length: string
  width: string
  weight: string
  craft: string
  proofingNum: string
  sampleLead: string
  bulkLead: string
  ladderPrice: string
  proofingFee: string
  invoice: string
  tax: string
}

// 通用表格数据类型
export type TableData = ProductData | SlipperData | EcoPenData | UmbrellaData | BadgeData | SixPieceData

// 通用表格列类型
export type TableColumns = ColumnsType<TableData>
