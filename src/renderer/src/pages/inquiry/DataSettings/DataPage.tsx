import { useTheme } from '@renderer/context/ThemeProvider'
import { ThemeMode } from '@renderer/types'
import { Button, message, Radio, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useState } from 'react'
import styled from 'styled-components'

const PRODUCT_TYPES = ['房卡', '楼板', '雨伞', '窗帘', '智能门锁']

const columns: ColumnsType<any> = [
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
  { title: '打样费用', dataIndex: 'proofingFee', width: 180, align: 'center' as const, fixed: 'left' },
  { title: '发票', dataIndex: 'invoice', width: 60, align: 'center' as const, fixed: 'left' },
  { title: '税率', dataIndex: 'tax', width: 60, align: 'center' as const, fixed: 'left' }
]

const dataSource = [
  {
    key: '1',
    index: 1,
    productNo: '202510',
    category: '房卡',
    material: '木质',
    thickness: '1.2',
    length: '85.5',
    width: '54',
    process: '印刷, 烫金',
    chip: 'CP.1.01.0372',
    encrypted: '是',
    sampleLead: '15',
    bulkLead: '15',
    ladderPrice: '1-100张，每张1元; 101-500张，每张0.7元/张',
    proofingFee: '1-10张，每张1元; 11-20张，每张2元/张',
    invoice: '专票',
    tax: '13%'
  },
  {
    key: '2',
    index: 2,
    productNo: '202511',
    category: '房卡',
    material: 'PVC',
    thickness: '1.2',
    length: '85.5',
    width: '54',
    process: '印刷, 覆刻',
    chip: 'CP.1.01.0372',
    encrypted: '是',
    sampleLead: '15',
    bulkLead: '15',
    ladderPrice: '1-100张，每张1元; 101-500张，每张0.7元/张',
    proofingFee: '1-10张，每张1元; 11-20张，每张2元/张',
    invoice: '专票',
    tax: '13%'
  },
  {
    key: '3',
    index: 3,
    productNo: '202511',
    category: '房卡',
    material: 'PVC',
    thickness: '1.2',
    length: '85.5',
    width: '54',
    process: '印刷, 覆刻',
    chip: 'CP.1.01.0372',
    encrypted: '是',
    sampleLead: '15',
    bulkLead: '15',
    ladderPrice: '1-100张，每张1元; 101-500张，每张0.7元/张',
    proofingFee: '1-10张，每张1元; 11-20张，每张2元/张',
    invoice: '专票',
    tax: '13%'
  },
  {
    key: '4',
    index: 4,
    productNo: '202511',
    category: '房卡',
    material: 'PVC',
    thickness: '1.2',
    length: '85.5',
    width: '54',
    process: '印刷, 覆刻',
    chip: 'CP.1.01.0372',
    encrypted: '是',
    sampleLead: '15',
    bulkLead: '15',
    ladderPrice: '1-100张，每张1元; 101-500张，每张0.7元/张',
    proofingFee: '1-10张，每张1元; 11-20张，每张2元/张',
    invoice: '专票',
    tax: '13%'
  },
  {
    key: '5',
    index: 5,
    productNo: '202511',
    category: '房卡',
    material: 'PVC',
    thickness: '1.2',
    length: '85.5',
    width: '54',
    process: '印刷, 覆刻',
    chip: 'CP.1.01.0372',
    encrypted: '是',
    sampleLead: '15',
    bulkLead: '15',
    ladderPrice: '1-100张，每张1元; 101-500张，每张0.7元/张',
    proofingFee: '1-10张，每张1元; 11-20张，每张2元/张',
    invoice: '专票',
    tax: '13%'
  }
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

const DataPage: React.FC = () => {
  const { theme } = useTheme()
  const [selectedType, setSelectedType] = useState(PRODUCT_TYPES[0])

  const handleImport = () => {
    message.info('导入功能暂未实现')
  }
  const handleExport = () => {
    message.info('导出功能暂未实现')
  }

  return (
    <Container $theme={theme}>
      <Card $theme={theme}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ marginRight: 8 }}>请选择产品类目：</span>
            <Radio.Group value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              {PRODUCT_TYPES.map((type) => (
                <Radio.Button key={type} value={type} style={{ marginRight: 4 }}>
                  {type}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          <div>
            <Button type="primary" style={{ marginRight: 8 }} onClick={handleImport}>
              导入
            </Button>
            <Button onClick={handleExport}>导出</Button>
          </div>
        </div>
        <div style={{ overflow: 'auto' }}>
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
            bordered
            pagination={false}
            style={{ minWidth: 800 }}
          />
        </div>
      </Card>
    </Container>
  )
}

export default DataPage
