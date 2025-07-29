import { useTheme } from '@renderer/context/ThemeProvider'
import { ThemeMode } from '@renderer/types'
import { Button, message, Radio, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

// 通用的空值处理函数
const renderCell = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return '/'
  }
  return value
}

import { CsvFileProdType, prodtypeDownload, queryProdType, upload, UploadProdType } from '../api/query_prodtype'
import { PRODUCT_TYPE_MAP, PRODUCT_TYPES, ProductType } from './constants'
import {
  BadgeData,
  EcoPenData,
  ProductData,
  RawBadgeData,
  RawEcoPenData,
  // RawProductData,
  RawSixPieceData,
  RawSlipperData,
  RawSmartProductsData,
  RawUmbrellaData,
  SixPieceData,
  SlipperData,
  SmartProductsData,
  UmbrellaData
} from './types'

// 公共表格列定义
const publicColumns = [
  {
    title: '每箱数量',
    dataIndex: 'qty_per_carton',
    width: 120,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  {
    title: '装箱尺寸',
    dataIndex: 'packing_size',
    width: 120,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  {
    title: '每箱毛重kgs',
    dataIndex: 'rough_weight_per_carton',
    width: 120,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  {
    title: '每箱净重kgs',
    dataIndex: 'suttle_weight_per_carton',
    width: 120,
    align: 'center' as const,
    render: (value) => renderCell(value)
  }
]

// 房卡表格列定义
const roomCardColumns: ColumnsType<ProductData> = [
  { title: '序号', dataIndex: 'index', width: 60, align: 'center' as const, fixed: 'left' },
  { title: '产品编号', dataIndex: 'productNo', width: 90, align: 'center' as const, fixed: 'left' },
  { title: '品类', dataIndex: 'category', width: 70, align: 'center' as const, fixed: 'left' },
  { title: '材质', dataIndex: 'material', width: 70, align: 'center' as const, fixed: 'left' },
  { title: '厚度mm', dataIndex: 'thickness', width: 70, align: 'center' as const, fixed: 'left' },
  { title: '长度mm', dataIndex: 'length', width: 70, align: 'center' as const, fixed: 'left' },
  { title: '宽度mm', dataIndex: 'width', width: 70, align: 'center' as const, fixed: 'left' },
  { title: '产品工艺', dataIndex: 'process', width: 100, align: 'center' as const },
  { title: '芯片', dataIndex: 'chip', width: 100, align: 'center' as const },
  { title: '是否加密', dataIndex: 'encrypted', width: 70, align: 'center' as const },
  { title: '样品交期（工作日）', dataIndex: 'sampleLead', width: 110, align: 'center' as const },
  { title: '大货交期（工作日）', dataIndex: 'bulkLead', width: 110, align: 'center' as const },
  { title: '阶梯报价', dataIndex: 'ladderPrice', width: 180, align: 'center' as const, fixed: 'left' },
  {
    title: '打样费用',
    dataIndex: 'proofingFee',
    width: 180,
    align: 'center' as const,
    fixed: 'left',
    render: (value) => renderCell(value)
  },
  {
    title: '发票',
    dataIndex: 'invoice',
    width: 60,
    align: 'center' as const,
    fixed: 'left',
    render: (value) => renderCell(value)
  },
  {
    title: '税率',
    dataIndex: 'tax',
    width: 60,
    align: 'center' as const,
    fixed: 'left',
    render: (value) => renderCell(value)
  }
]

// 拖鞋表格列定义
const slipperColumns: ColumnsType<SlipperData> = [
  { title: '序号', dataIndex: 'serial', width: 80, align: 'center' as const, fixed: 'left' },
  { title: '产品编号', dataIndex: 'id', width: 120, align: 'center' as const, fixed: 'left' },
  { title: '物料编码', dataIndex: 'material_code', width: 120, align: 'center' as const },
  { title: '材质', dataIndex: 'texture', width: 150, align: 'center' as const },
  { title: '长*宽mm', dataIndex: 'size', width: 100, align: 'center' as const },
  { title: '产品工艺', dataIndex: 'craft', width: 100, align: 'center' as const },
  { title: '包装', dataIndex: 'packaging', width: 100, align: 'center' as const },
  { title: '阶梯数量/报价', dataIndex: 'price', width: 600, align: 'center' as const },
  { title: '打样数量', dataIndex: 'proofingNum', width: 90, align: 'center' as const },
  { title: '样品交期（工作日）', dataIndex: 'sampleDelTime', width: 180, align: 'center' as const },
  { title: '大货交期（工作日）', dataIndex: 'prodDelTime', width: 180, align: 'center' as const },
  { title: '打样费用', dataIndex: 'sampleCharge', width: 180, align: 'center' as const },
  { title: '专票/普票', dataIndex: 'invoices', width: 120, align: 'center' as const },
  { title: '税率', dataIndex: 'tax', width: 80, align: 'center' as const },
  ...publicColumns
]

// 环保笔表格列定义
const ecoPenColumns: ColumnsType<EcoPenData> = [
  { title: '序号', dataIndex: 'serial', width: 80, align: 'center' as const, fixed: 'left' },
  { title: '产品编号', dataIndex: 'id', width: 120, align: 'center' as const, fixed: 'left' },
  { title: '物料编码（C.L）', dataIndex: 'material_code', width: 150, align: 'center' as const },
  { title: '物料编码（C.P）', dataIndex: 'material_code2', width: 150, align: 'center' as const },
  { title: '材质', dataIndex: 'texture', width: 150, align: 'center' as const },
  { title: '长*宽mm', dataIndex: 'size', width: 250, align: 'center' as const },
  { title: '产品工艺', dataIndex: 'craft', width: 100, align: 'center' as const },
  { title: '打样数量', dataIndex: 'proofingNum', width: 90, align: 'center' as const },
  { title: '样品交期（工作日）', dataIndex: 'sampleDelTime', width: 180, align: 'center' as const },
  { title: '大货交期（工作日）', dataIndex: 'prodDelTime', width: 180, align: 'center' as const },
  { title: '阶梯数量/报价', dataIndex: 'stepNum', width: 600, align: 'center' as const },
  {
    title: '打样费用',
    dataIndex: 'sampleCharge',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  {
    title: '专票/普票',
    dataIndex: 'invoices',
    width: 120,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  { title: '税率', dataIndex: 'tax', width: 80, align: 'center' as const, render: (value) => renderCell(value) },
  ...publicColumns
]

// 雨伞表格列定义
const umbrellaColumns: ColumnsType<UmbrellaData> = [
  { title: '序号', dataIndex: 'serial', width: 80, align: 'center' as const, fixed: 'left' },
  { title: '产品编号', dataIndex: 'id', width: 120, align: 'center' as const, fixed: 'left' },
  { title: '物料编码', dataIndex: 'material_code', width: 120, align: 'center' as const },
  { title: '产品名称', dataIndex: 'name', width: 500, align: 'center' as const },
  { title: '伞珠材质', dataIndex: 'texture', width: 100, align: 'center' as const },
  { title: '雨伞尺寸', dataIndex: 'size', width: 100, align: 'center' as const },
  { title: '雨伞骨数', dataIndex: 'boneNum', width: 100, align: 'center' as const },
  { title: '雨伞手柄', dataIndex: 'handShank', width: 150, align: 'center' as const },
  { title: '产品工艺', dataIndex: 'craft', width: 120, align: 'center' as const },
  { title: '打样数量', dataIndex: 'proofingNum', width: 90, align: 'center' as const },
  { title: '样品交期（工作日）', dataIndex: 'sampleDelTime', width: 180, align: 'center' as const },
  { title: '大货交期（工作日）', dataIndex: 'prodDelTime', width: 180, align: 'center' as const },
  { title: '阶梯数量/报价', dataIndex: 'stepNum', width: 600, align: 'center' as const },
  {
    title: '打样费用',
    dataIndex: 'sampleCharge',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  {
    title: '专票/普票',
    dataIndex: 'invoices',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  { title: '税率', dataIndex: 'tax', width: 80, align: 'center' as const, render: (value) => renderCell(value) },
  ...publicColumns
]

// 胸牌表格列定义
const badgeColumns: ColumnsType<BadgeData> = [
  { title: '序号', dataIndex: 'serial', width: 80, align: 'center' as const, fixed: 'left' },
  { title: '产品编号', dataIndex: 'id', width: 90, align: 'center' as const, fixed: 'left' },
  { title: '物料编码', dataIndex: 'material_code', width: 120, align: 'center' as const },
  { title: '产品名称', dataIndex: 'name', width: 400, align: 'center' as const },
  { title: '尺寸', dataIndex: 'size', width: 100, align: 'center' as const },
  { title: '产品工艺', dataIndex: 'craft', width: 200, align: 'center' as const },
  { title: '打样数量', dataIndex: 'proofingNum', width: 90, align: 'center' as const },
  { title: '样品交期（工作日）', dataIndex: 'sampleDelTime', width: 180, align: 'center' as const },
  { title: '大货交期（工作日）', dataIndex: 'prodDelTime', width: 180, align: 'center' as const },
  { title: '阶梯数量/报价', dataIndex: 'stepNum', width: 600, align: 'center' as const },
  {
    title: '打样费用',
    dataIndex: 'sampleCharge',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  {
    title: '专票/普票',
    dataIndex: 'invoices',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  { title: '税率', dataIndex: 'tax', width: 80, align: 'center' as const, render: (value) => renderCell(value) },
  {
    title: '模具费',
    dataIndex: 'toolCharge',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  ...publicColumns
]

// 六小件表格列定义
const sixPieceColumns: ColumnsType<SixPieceData> = [
  { title: '序号', dataIndex: 'serial', width: 80, align: 'center' as const, fixed: 'left' },
  {
    title: '产品编号',
    dataIndex: 'id',
    width: 90,
    align: 'center' as const,
    fixed: 'left',
    render: (value) => renderCell(value)
  },
  { title: '物料编码', dataIndex: 'material_code', width: 120, align: 'center' as const },
  { title: '产品名称', dataIndex: 'name', width: 500, align: 'center' as const },
  { title: '材质', dataIndex: 'texture', width: 100, align: 'center' as const },
  { title: '厚度mm', dataIndex: 'thickness', width: 110, align: 'center' as const },
  { title: '长度mm', dataIndex: 'length', width: 110, align: 'center' as const },
  { title: '宽度mm', dataIndex: 'width', width: 110, align: 'center' as const },
  { title: '克重g', dataIndex: 'weight', width: 80, align: 'center' as const },
  { title: '产品工艺', dataIndex: 'craft', width: 100, align: 'center' as const },
  { title: '打样数量', dataIndex: 'proofingNum', width: 90, align: 'center' as const },
  { title: '样品交期（工作日）', dataIndex: 'sampleDelTime', width: 180, align: 'center' as const },
  { title: '大货交期（工作日）', dataIndex: 'prodDelTime', width: 180, align: 'center' as const },
  { title: '阶梯数量/报价', dataIndex: 'stepNum', width: 600, align: 'center' as const },
  {
    title: '打样费用',
    dataIndex: 'sampleCharge',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  {
    title: '专票/普票',
    dataIndex: 'invoices',
    width: 100,
    align: 'center' as const,
    render: (value) => renderCell(value)
  },
  { title: '税率', dataIndex: 'tax', width: 80, align: 'center' as const, render: (value) => renderCell(value) }
]

// 智慧产品表格列定义
const smartProductsColumns: ColumnsType<SmartProductsData> = [
  { title: '序号', dataIndex: 'serial', width: 80, align: 'center' as const, fixed: 'left' },
  {
    title: '产品编号',
    dataIndex: 'id',
    width: 90,
    align: 'center' as const,
    fixed: 'left',
    render: (value) => renderCell(value)
  },
  { title: '物料编码（C.L）', dataIndex: 'material_code', width: 150, align: 'center' as const },
  { title: '物料编码（C.P）', dataIndex: 'material_code2', width: 150, align: 'center' as const },
  { title: '产品名称', dataIndex: 'name', width: 200, align: 'center' as const },
  { title: '材质/参数', dataIndex: 'texture', width: 500, align: 'center' as const },
  { title: '打样数量', dataIndex: 'proofingNum', width: 150, align: 'center' as const },
  { title: '大货交期（自然日）', dataIndex: 'prodDelTime', width: 180, align: 'center' as const },
  { title: '是否含运', dataIndex: 'isTransport', width: 180, align: 'center' as const },
  { title: '指导价（未税人民币，元/pcs）', dataIndex: 'stepNum', width: 300, align: 'center' as const }
]

const Container = styled.div<{ $theme?: ThemeMode }>`
  background: ${({ $theme }) => ($theme === ThemeMode.dark ? '#18191c' : '#f8f8f8')};
  height: 100%;
  width: 100%;
`

const Card = styled.div<{ $theme?: ThemeMode }>`
  background: ${({ $theme }) => ($theme === ThemeMode.dark ? '#232428' : '#fff')};
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 16px;
  height: calc(100vh - 42px);
  width: calc(100vw - 112px);
  overflow: auto;
`

const Header = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
`

const RadioLabel = styled.span`
  margin-right: 8px;
`

const RadioButton = styled(Radio.Button)`
  margin-right: 4px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const TableContainer = styled.div`
  overflow: auto;
`

const DataPage: React.FC = () => {
  const { theme } = useTheme()
  const [selectedType, setSelectedType] = useState<ProductType>(PRODUCT_TYPES[0])
  const [
    roomCardData
    // setRoomCardData
  ] = useState<ProductData[]>([])
  const [slipperData, setSlipperData] = useState<SlipperData[]>([])
  const [ecoPenData, setEcoPenData] = useState<EcoPenData[]>([])
  const [umbrellaData, setUmbrellaData] = useState<UmbrellaData[]>([])
  const [badgeData, setBadgeData] = useState<BadgeData[]>([])
  const [sixPieceData, setSixPieceData] = useState<SixPieceData[]>([])
  const [smartProductsData, setRawSmartProductsData] = useState<SmartProductsData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await queryProdType(PRODUCT_TYPE_MAP[selectedType])
      if (response.code === 200) {
        // if (selectedType === '房卡') {
        //   const transformedData = response.data.map((item: RawProductData, index: number) => ({
        //     ...item,
        //     index: index + 1
        //   }))
        //   setRoomCardData(transformedData)
        // } else
        if (selectedType === '拖鞋') {
          const transformedData = response.data.map((item: RawSlipperData) => ({
            ...item
            // serial: index + 1
          }))
          setSlipperData(transformedData)
        } else if (selectedType === '环保笔') {
          const transformedData = response.data.map((item: RawEcoPenData) => ({
            ...item
          }))
          setEcoPenData(transformedData)
        } else if (selectedType === '雨伞') {
          const transformedData = response.data.map((item: RawUmbrellaData) => ({
            ...item
          }))
          setUmbrellaData(transformedData)
        } else if (selectedType === '胸牌') {
          const transformedData = response.data.map((item: RawBadgeData) => ({
            ...item
          }))
          setBadgeData(transformedData)
        } else if (selectedType === '六小件') {
          const transformedData = response.data.map((item: RawSixPieceData) => ({
            ...item
          }))
          setSixPieceData(transformedData)
        } else if (selectedType === '智慧产品') {
          const transformedData = response.data.map((item: RawSmartProductsData) => ({
            ...item
          }))
          setRawSmartProductsData(transformedData)
        }
      } else {
        message.error(response.message || '获取数据失败')
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      message.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }, [selectedType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleImport = async () => {
    try {
      // 获取用户信息
      const userInfoStr = localStorage.getItem('userInfo')
      if (!userInfoStr) {
        message.error('请先登录')
        return
      }

      const userInfo = JSON.parse(userInfoStr)
      if (!userInfo.uid || !userInfo.name) {
        message.error('用户信息不完整，请重新登录')
        return
      }

      // 创建文件输入元素
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.csv'

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return

        // 验证文件类型
        if (!file.name.endsWith('.csv')) {
          message.error('请选择CSV文件')
          return
        }

        try {
          setLoading(true)

          // 映射产品类型到上传类型
          const prodTypeMap: Record<ProductType, UploadProdType> = {
            // 房卡: 'room_card',
            拖鞋: 'slipper',
            雨伞: 'umbrella',
            环保笔: 'pen',
            胸牌: 'badge_lanyard'
            // 六小件: 'six_small_items',
            // 智慧产品: 'smart_products'
          }

          const response = await upload({
            userId: userInfo.uid,
            userName: userInfo.name,
            prodType: prodTypeMap[selectedType],
            file
          })

          if (response.code === 200) {
            message.success('导入成功')
            // 刷新数据
            fetchData()
          } else {
            message.error(response.message || '导入失败')
          }
        } catch (error) {
          console.error('导入失败:', error)
          message.error('导入失败')
        } finally {
          setLoading(false)
        }
      }

      // 触发文件选择
      input.click()
    } catch (error) {
      console.error('导入失败:', error)
      message.error('导入失败')
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      // 映射产品类型到对应的CSV文件名
      const filenameMap: Record<ProductType, CsvFileProdType> = {
        // 房卡: 'room_card',
        拖鞋: 'slipper',
        雨伞: 'umbrella',
        环保笔: 'pen',
        胸牌: 'badge_lanyard'
        // 六小件: 'six_small_items',
        // 智慧产品: 'smart_products'
      }
      const prodType = filenameMap[selectedType]

      try {
        const blob = await prodtypeDownload(prodType)
        if (!blob || blob.size === 0) {
          message.error('下载的文件为空')
          return
        }

        // 创建下载链接
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${selectedType}.csv`
        document.body.appendChild(link)
        link.click()

        // 清理
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        message.success('导出成功')
      } catch (downloadError) {
        console.error('下载失败:', downloadError)
        message.error(`下载失败: ${downloadError instanceof Error ? downloadError.message : '未知错误'}`)
      }
    } catch (error) {
      console.error('导出失败:', error)
      message.error('导出失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container $theme={theme}>
      <Card $theme={theme}>
        <Header>
          <RadioGroup>
            <RadioLabel>请选择产品类目：</RadioLabel>
            <Radio.Group value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              {PRODUCT_TYPES.map((type) => (
                <RadioButton key={type} value={type}>
                  {type}
                </RadioButton>
              ))}
            </Radio.Group>
          </RadioGroup>
          <ButtonGroup>
            <Button type="primary" onClick={handleImport}>
              导入
            </Button>
            <Button onClick={handleExport}>导出</Button>
          </ButtonGroup>
        </Header>
        <TableContainer>
          {selectedType === '拖鞋' ? (
            <Table<SlipperData>
              columns={slipperColumns}
              dataSource={slipperData}
              scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
              bordered
              pagination={false}
              loading={loading}
              style={{ minWidth: 800 }}
            />
          ) : selectedType === '环保笔' ? (
            <Table<EcoPenData>
              columns={ecoPenColumns}
              dataSource={ecoPenData}
              scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
              bordered
              pagination={false}
              loading={loading}
              style={{ minWidth: 800 }}
            />
          ) : selectedType === '雨伞' ? (
            <Table<UmbrellaData>
              columns={umbrellaColumns}
              dataSource={umbrellaData}
              scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
              bordered
              pagination={false}
              loading={loading}
              style={{ minWidth: 800 }}
            />
          ) : selectedType === '胸牌' ? (
            <Table<BadgeData>
              columns={badgeColumns}
              dataSource={badgeData}
              scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
              bordered
              pagination={false}
              loading={loading}
              style={{ minWidth: 800 }}
            />
          ) : selectedType === '六小件' ? (
            <Table<SixPieceData>
              columns={sixPieceColumns}
              dataSource={sixPieceData}
              scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
              bordered
              pagination={false}
              loading={loading}
              style={{ minWidth: 800 }}
            />
          ) : selectedType === '智慧产品' ? (
            <Table<SixPieceData>
              columns={smartProductsColumns}
              dataSource={smartProductsData}
              scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
              bordered
              pagination={false}
              loading={loading}
              style={{ minWidth: 800 }}
            />
          ) : (
            <Table<ProductData>
              columns={roomCardColumns}
              dataSource={roomCardData}
              scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
              bordered
              pagination={false}
              loading={loading}
              style={{ minWidth: 800 }}
            />
          )}
        </TableContainer>
      </Card>
    </Container>
  )
}

export default DataPage
