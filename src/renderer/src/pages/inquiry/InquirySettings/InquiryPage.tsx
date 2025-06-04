import { AntDesignOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Scrollbar from '@renderer/components/Scrollbar'
import {
  Button,
  Checkbox,
  Collapse,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space
} from 'antd'
import { createStyles } from 'antd-style'
import { FC, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `
}))

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: calc(100vh - var(--navbar-height));
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 100%;
`

const TableContainer = styled(Scrollbar)`
  padding: 15px;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

const SideNav = styled.div`
  width: calc(var(--assistants-width) + 250px);
  border-right: 0.5px solid var(--color-border);
  padding: 12px;
  user-select: none;
  display: flex;
  flex-direction: column;
  height: 100%;

  .sidenav-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .bottom-action {
    margin-top: auto;
  }

  .ant-menu {
    border-inline-end: none !important;
    background: transparent;
  }

  .ant-menu-item {
    height: 36px;
    line-height: 36px;
    margin: 4px 0;
    width: 100%;
    border-radius: var(--list-item-border-radius);
    border: 0.5px solid transparent;

    &:hover {
      background-color: var(--color-background-soft) !important;
    }

    &.ant-menu-item-selected {
      background-color: var(--color-background-soft);
      color: var(--color-primary);
      border: 0.5px solid var(--color-border);
      color: var(--color-text);
    }
  }
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: 8px;
`

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
`

const ProgressFill = styled.div`
  height: 100%;
  background: #000;
  transition: width 0.3s ease;
  border-radius: 4px;
`

const LoadingText = styled.div`
  color: #a0a0a0;
  font-size: 14px;
`

const MarkdownContainer = styled.div`
  position: relative;
  font-size: 15px;
  line-height: 1.8;
  color: ${(props) => props.theme.colorText};
  background: ${(props) => props.theme.colorBgContainer};
  border-radius: 8px;
  padding: 32px;
  border: 0.5px solid var(--color-border);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colorBorder};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colorBgLayout};
  }

  &.typing::after {
    content: '|';
    display: inline-block;
    animation: blink 1s step-end infinite;
    color: ${(props) => props.theme.colorPrimary};
    font-weight: bold;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  h1,
  h2,
  h3 {
    font-weight: 600;
    margin: 0 0 24px 0;
    color: ${(props) => props.theme.colorTextHeading};
    border-bottom: 2px solid ${(props) => props.theme.colorBorderSecondary};
    padding-bottom: 12px;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 16px;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 16px 0;
  }

  li {
    margin: 8px 0;
    padding-left: 24px;
    position: relative;

    &:before {
      content: '•';
      position: absolute;
      left: 8px;
      color: ${(props) => props.theme.colorPrimary};
    }
  }

  strong {
    color: ${(props) => props.theme.colorTextHeading};
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 14px;
    border: 1px solid ${(props) => props.theme.colorBorder};
    table-layout: fixed;
  }

  th,
  td {
    border: 1px solid ${(props) => props.theme.colorBorder};
    padding: 12px 16px;
    text-align: left;
    word-break: break-word;
    white-space: normal;
  }

  th {
    background-color: ${(props) => props.theme.colorBgLayout};
    font-weight: 500;
    color: ${(props) => props.theme.colorTextHeading};
  }

  tr:nth-child(even) {
    background-color: ${(props) => props.theme.colorBgLayout};
  }

  tr:hover {
    background-color: ${(props) => props.theme.colorBgTextHover};
  }

  a {
    color: ${(props) => props.theme.colorPrimary};
    text-decoration: underline;
  }
`

const DetailForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
  .ant-form-item-label {
    padding-bottom: 4px;
  }
  .ant-form-item-label > label {
    color: var(--color-text-secondary);
    font-size: 14px;
  }
  .ant-form-item-control-input-content {
    color: var(--color-text);
    font-size: 14px;
  }
`

const DetailContainer = styled.div`
  padding: 16px;
`

const CategoryRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .ant-radio-button-wrapper {
    margin-right: 0;
    border-radius: 4px;
    border: 1px solid var(--color-border);

    &:not(:first-child)::before {
      display: none;
    }

    &:hover {
      color: var(--color-primary);
    }

    &.ant-radio-button-wrapper-checked {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;

      &:hover {
        color: white;
      }
    }
  }
`

// 定义品类类型：品类：slipper--拖鞋、room_card--房卡、pen--环保笔、umbrella--伞、badge_lanyard--胸牌、six_small_items--六小件
type CategoryType = 'room_card' | 'slipper' | 'pen' | 'badge_lanyard' | 'umbrella' | 'six_small_items'

// 定义品类数据接口
interface CategoryItem {
  key: string
  label: string
  category: CategoryType
  material: string
  thickness?: string
  length?: number
  width?: number
  process?: string[]
  chip?: string
  encrypted?: string
  // 拖鞋特有字段
  texture?: string
  size?: string
  craft?: string[]
  packaging?: string
  children: React.ReactNode
  extra: React.ReactNode | null
}

// 定义品类选项
const CATEGORY_OPTIONS = [
  { label: '房卡', value: 'room_card' },
  { label: '拖鞋', value: 'slipper' },
  { label: '环保笔', value: 'pen' },
  { label: '胸牌', value: 'badge_lanyard' },
  { label: '雨伞', value: 'umbrella' },
  { label: '六小件', value: 'six_small_items' }
]

// 拖鞋相关常量数据
const SLIPPER_DATA = {
  textures: [
    { key: 'L1', value: '拉毛布+EVA底', label: '拉毛布+EVA底' },
    { key: 'L2', value: '珊瑚绒+EVA底', label: '珊瑚绒+EVA底' },
    { key: 'L3', value: '全粘胶珍珠棉+甘蔗底', label: '全粘胶珍珠棉+甘蔗底' },
    { key: 'L4', value: '真美布+软木底', label: '真美布+软木底' }
  ],
  sizes: {
    L1: [{ label: '28.5*11.5', value: '28.5*11.5' }],
    L2: [{ label: '29*11.5', value: '29*11.5' }],
    L3: [
      { label: '29*11.5', value: '29*11.5' },
      { label: '29.7*11.5', value: '29.7*11.5' },
      { label: '30.5*11.8', value: '30.5*11.8' }
    ],
    L4: [{ label: '30*12.3', value: '30*12.3' }]
  },
  crafts: {
    L1: [
      { label: '单色丝印', value: '单色丝印' },
      { label: '双色丝印', value: '双色丝印' },
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ],
    L2: [
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ],
    L3: [
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ],
    L4: [
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ]
  },
  packaging: [
    { label: '无纺布袋', value: '无纺布袋' },
    { label: '欧根纱袋', value: '欧根纱袋' },
    { label: 'OPP袋', value: 'OPP袋' },
    { label: '纸盒', value: '纸盒' }
  ]
}

// 定义品类标签映射
const CATEGORY_LABEL_MAP: Record<CategoryType, string> = {
  room_card: '房卡',
  slipper: '拖鞋',
  pen: '环保笔',
  badge_lanyard: '胸牌',
  umbrella: '雨伞',
  six_small_items: '六小件'
}

const InquiryPage: FC = () => {
  const { styles } = useStyle()
  const [displayedMarkdown, setDisplayedMarkdown] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>()
  const [items, setItems] = useState<CategoryItem[]>([])
  const [activeKey, setActiveKey] = useState<string | string[]>([])
  // 添加拖鞋材质状态
  const [selectedTexture, setSelectedTexture] = useState<string>('')

  // 完整的 markdown 内容
  const fullMarkdown = `
# 询价单详情

## 基本信息
- **询价人**：easy
- **询价时间**：2025-05-28
- **生效时间**：2025-05-28
- **报价有效期**：15天

## 产品信息
| 询价编号 | 品类 | 材质 | 厚度(mm) | 长*宽(mm) | 产品工艺 | 芯片 | 是否加密 |
|---------|------|------|----------|-----------|----------|------|----------|
| 889 | 房卡 | 纸质 | 1.85 | 86.5*55 | 印刷,烫金 | CP.1.01.0372 | 是 |

## 报价详情
### 产品价格
- 1000张：0.5元/张
- 3000张：0.4元/张

### 样品信息
- **打样数量**：11张
- **样品费用**：101元
- **样品交期**：16天
- **大货交期**：16天

### 发票信息
- **发票类型**：普票
- **税率**：13%
`

  const onChange = (key: string | string[]) => {
    setActiveKey(key)
  }

  const genExtra = (item: CategoryItem) => (
    <DeleteOutlined
      onClick={(event) => {
        event.stopPropagation()
        handleDelete(item.key)
      }}
    />
  )

  const handleDelete = (key: string) => {
    console.log(key)
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个询价品类吗？',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        setItems(items.filter((item) => item.key !== key))

        // 从 activeKey 中移除被删除的 key
        setActiveKey(Array.isArray(activeKey) ? activeKey.filter((k) => k !== key) : activeKey === key ? [] : activeKey)

        message.success('删除成功')
      }
    })
  }

  const handleAddCategory = () => {
    setIsModalOpen(true)
    setSelectedCategory(undefined)
    form.resetFields()
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSelectedCategory(undefined)
    form.resetFields()
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      console.log('表单值:', values)

      const newKey = Date.now().toString()
      const newItem: CategoryItem = {
        key: newKey,
        label: CATEGORY_LABEL_MAP[values.category] || '',
        category: values.category,
        material: values.material,
        thickness: values.thickness,
        length: values.length,
        width: values.width,
        process: values.process,
        chip: values.chip,
        encrypted: values.encrypted,
        texture: values.texture,
        size: values.size,
        craft: values.craft,
        packaging: values.packaging,
        children: renderDetailForm({
          key: newKey,
          label: values.category,
          category: values.category,
          material: values.material,
          thickness: values.thickness,
          length: values.length,
          width: values.width,
          process: values.process,
          chip: values.chip,
          encrypted: values.encrypted,
          texture: values.texture,
          size: values.size,
          craft: values.craft,
          packaging: values.packaging,
          children: null,
          extra: null
        }),
        extra: null
      }

      setItems([...items, { ...newItem, extra: genExtra(newItem) }])
      setActiveKey(newKey)
      setIsModalOpen(false)
      setSelectedCategory(undefined)
      form.resetFields()
      message.success('添加成功')
    } catch (error) {
      console.error('表单验证失败:', error)
      message.error('添加失败')
    }
  }

  // 处理详情页表单提交
  const handleDetailFormSubmit = async (key: string, formValues: any) => {
    try {
      // 先打印表单信息
      console.log('详情页表单数据:', {
        key,
        category: items.find((item) => item.key === key)?.category,
        ...formValues
      })

      const currentItem = items.find((item) => item.key === key)
      if (!currentItem) return

      const updatedItem = {
        ...currentItem,
        ...formValues,
        label: formValues.category,
        children: currentItem.children // 保留原有的 children
      }

      setItems(items.map((item) => (item.key === key ? { ...updatedItem, extra: genExtra(updatedItem) } : item)))
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  const handleCategoryChange = (value: CategoryType) => {
    setSelectedCategory(value)
    form.resetFields([
      'material',
      'thickness',
      'length',
      'width',
      'process',
      'chip',
      'encrypted',
      'texture',
      'size',
      'craft',
      'packaging'
    ])
  }

  // 处理拖鞋材质变化
  const handleTextureChange = (value: string) => {
    setSelectedTexture(value)
    // 重置尺码和工艺选择
    form.setFieldsValue({
      size: undefined,
      craft: undefined
    })
  }

  // 获取当前材质对应的尺码选项
  const getCurrentSizeOptions = () => {
    if (!selectedTexture) return []
    const textureKey = SLIPPER_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? SLIPPER_DATA.sizes[textureKey as keyof typeof SLIPPER_DATA.sizes] : []
  }

  // 获取当前材质对应的工艺选项
  const getCurrentCraftOptions = () => {
    if (!selectedTexture) return []
    const textureKey = SLIPPER_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? SLIPPER_DATA.crafts[textureKey as keyof typeof SLIPPER_DATA.crafts] : []
  }

  // 根据品类获取对应的表单字段
  const getCategoryFormItems = () => {
    const categoryItem = (
      <Form.Item name="category" label="品类" rules={[{ required: true, message: '请选择品类' }]}>
        <CategoryRadioGroup onChange={(e) => handleCategoryChange(e.target.value as CategoryType)}>
          {CATEGORY_OPTIONS.map((option) => (
            <Radio.Button key={option.value} value={option.value}>
              {option.label}
            </Radio.Button>
          ))}
        </CategoryRadioGroup>
      </Form.Item>
    )

    if (!selectedCategory) return [categoryItem]

    switch (selectedCategory) {
      case 'room_card':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            key="thickness"
            label="厚度mm"
            name="thickness"
            rules={[{ required: true, message: '请选择厚度' }]}>
            <Radio.Group>
              <Radio value="1.85">1.85</Radio>
              <Radio value="2.0">2.0</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="length" label="长mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item key="width" label="宽mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item
            key="process"
            label="产品工艺"
            name="process"
            rules={[{ required: true, message: '请选择产品工艺' }]}>
            <Checkbox.Group
              options={[
                { label: '印刷', value: '印刷' },
                { label: '烫金', value: '烫金' },
                { label: 'UV', value: 'UV' }
              ]}
            />
          </Form.Item>,
          <Form.Item key="chip" label="芯片" name="chip" rules={[{ required: true, message: '请选择芯片' }]}>
            <Select>
              <Select.Option value="CP.1.01.0372">CP.1.01.0372</Select.Option>
              <Select.Option value="CP.1.01.0373">CP.1.01.0373</Select.Option>
            </Select>
          </Form.Item>,
          <Form.Item
            key="encrypted"
            label="是否加密"
            name="encrypted"
            rules={[{ required: true, message: '请选择是否加密' }]}>
            <Select>
              <Select.Option value="1">是</Select.Option>
              <Select.Option value="0">否</Select.Option>
            </Select>
          </Form.Item>
        ]
      case 'slipper':
        return [
          categoryItem,
          <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group onChange={(e) => handleTextureChange(e.target.value)}>
              {SLIPPER_DATA.textures.map((option) => (
                <Radio key={option.key} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="size" label="尺码" name="size" rules={[{ required: true, message: '请选择尺码' }]}>
            <Radio.Group>
              {getCurrentSizeOptions().map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="craft" label="工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
            <Checkbox.Group>
              {getCurrentCraftOptions().map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>,
          <Form.Item key="packaging" label="包装" name="packaging" rules={[{ required: true, message: '请选择包装' }]}>
            <Select>
              {SLIPPER_DATA.packaging.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ]
      case 'pen':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="color" label="颜色" name="color" rules={[{ required: true, message: '请选择颜色' }]}>
            <Select>
              <Select.Option value="黑色">黑色</Select.Option>
              <Select.Option value="蓝色">蓝色</Select.Option>
              <Select.Option value="红色">红色</Select.Option>
            </Select>
          </Form.Item>,
          <Form.Item key="type" label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
            <Radio.Group>
              <Radio value="圆珠笔">圆珠笔</Radio>
              <Radio value="中性笔">中性笔</Radio>
            </Radio.Group>
          </Form.Item>
        ]
      case 'badge_lanyard':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="size" label="尺寸" name="size" rules={[{ required: true, message: '请选择尺寸' }]}>
            <Radio.Group>
              <Radio value="小号">小号</Radio>
              <Radio value="中号">中号</Radio>
              <Radio value="大号">大号</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="process" label="工艺" name="process" rules={[{ required: true, message: '请选择工艺' }]}>
            <Checkbox.Group
              options={[
                { label: '印刷', value: '印刷' },
                { label: '烫金', value: '烫金' },
                { label: 'UV', value: 'UV' }
              ]}
            />
          </Form.Item>
        ]
      case 'umbrella':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="size" label="尺寸" name="size" rules={[{ required: true, message: '请选择尺寸' }]}>
            <Radio.Group>
              <Radio value="小号">小号</Radio>
              <Radio value="中号">中号</Radio>
              <Radio value="大号">大号</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="color" label="颜色" name="color" rules={[{ required: true, message: '请选择颜色' }]}>
            <Select>
              <Select.Option value="黑色">黑色</Select.Option>
              <Select.Option value="蓝色">蓝色</Select.Option>
              <Select.Option value="红色">红色</Select.Option>
            </Select>
          </Form.Item>
        ]
      case 'six_small_items':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="items" label="包含物品" name="items" rules={[{ required: true, message: '请选择包含物品' }]}>
            <Checkbox.Group
              options={[
                { label: '牙刷', value: '牙刷' },
                { label: '牙膏', value: '牙膏' },
                { label: '梳子', value: '梳子' },
                { label: '香皂', value: '香皂' },
                { label: '洗发水', value: '洗发水' },
                { label: '沐浴露', value: '沐浴露' }
              ]}
            />
          </Form.Item>
        ]
      default:
        return [categoryItem]
    }
  }

  // 修改详情页表单的渲染
  const renderDetailForm = (item: CategoryItem) => (
    <DetailContainer>
      <DetailForm
        layout="vertical"
        style={{ maxWidth: 600 }}
        initialValues={item}
        onValuesChange={(_, allValues) => handleDetailFormSubmit(item.key, allValues)}>
        <Form.Item label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
          <Radio.Group buttonStyle="outline">
            <Radio value="纸质">纸质</Radio>
            <Radio value="塑料">塑料</Radio>
            <Radio value="金属">金属</Radio>
          </Radio.Group>
        </Form.Item>
        {item.thickness && (
          <Form.Item label="厚度mm" name="thickness" rules={[{ required: true, message: '请选择厚度' }]}>
            <Radio.Group>
              <Radio value="1.85">1.85</Radio>
              <Radio value="2.0">2.0</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {item.length && (
          <Form.Item label="长mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
            <InputNumber min={1} />
          </Form.Item>
        )}
        {item.width && (
          <Form.Item label="宽mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
            <InputNumber min={1} />
          </Form.Item>
        )}
        {item.process && (
          <Form.Item label="产品工艺" name="process" rules={[{ required: true, message: '请选择产品工艺' }]}>
            <Checkbox.Group
              options={[
                { label: '印刷', value: '印刷' },
                { label: '烫金', value: '烫金' },
                { label: 'UV', value: 'UV' }
              ]}
            />
          </Form.Item>
        )}
        {item.chip && (
          <Form.Item label="芯片" name="chip" rules={[{ required: true, message: '请选择芯片' }]}>
            <Select>
              <Select.Option value="CP.1.01.0372">CP.1.01.0372</Select.Option>
              <Select.Option value="CP.1.01.0373">CP.1.01.0373</Select.Option>
            </Select>
          </Form.Item>
        )}
        {item.encrypted && (
          <Form.Item label="是否加密" name="encrypted" rules={[{ required: true, message: '请选择是否加密' }]}>
            <Select>
              <Select.Option value="1">是</Select.Option>
              <Select.Option value="0">否</Select.Option>
            </Select>
          </Form.Item>
        )}
      </DetailForm>
    </DetailContainer>
  )

  // 加载进度条效果
  useEffect(() => {
    const duration = 3000 // 3秒
    const interval = 30 // 更新间隔
    const steps = duration / interval
    const increment = 100 / steps

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsLoading(false)
          return 100
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  // 原有的打字机效果
  useEffect(() => {
    let currentIndex = 0
    const interval = 50

    const timer = setInterval(() => {
      if (currentIndex <= fullMarkdown.length) {
        setDisplayedMarkdown(fullMarkdown.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <Container>
      <ContentContainer>
        <SideNav>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton
            }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<PlusOutlined />} onClick={handleAddCategory}>
                新增询价品类
              </Button>
            </Space>
          </ConfigProvider>
          <Divider style={{ margin: '12px 0' }} />
          <div className="sidenav-scroll">
            {items.length > 0 ? (
              <Collapse onChange={onChange} activeKey={activeKey} items={items} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          <div className="bottom-action">
            <Divider style={{ margin: '12px 0' }} />
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<AntDesignOutlined />}>开始询价</Button>
            </Space>
          </div>
        </SideNav>
        <TableContainer right>
          <MarkdownContainer className={isTyping ? 'typing' : ''}>
            {isLoading && (
              <LoadingOverlay>
                <ProgressBar>
                  <ProgressFill style={{ width: `${progress}%` }} />
                </ProgressBar>
                <LoadingText>请稍后，正在询价中 {Math.round(progress)}%</LoadingText>
              </LoadingOverlay>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedMarkdown}</ReactMarkdown>
          </MarkdownContainer>
        </TableContainer>
      </ContentContainer>
      <Modal
        title="新增品类"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose>
        <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
          {getCategoryFormItems()}
        </Form>
      </Modal>
    </Container>
  )
}

export default InquiryPage
