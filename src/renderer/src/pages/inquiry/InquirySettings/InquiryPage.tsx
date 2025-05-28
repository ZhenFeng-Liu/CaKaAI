import {
  // DeleteOutlined,
  // EditOutlined,
  // EllipsisOutlined,
  PlusOutlined
  // FileImageOutlined,
  // FilePdfOutlined,
  // FileTextOutlined
} from '@ant-design/icons'
import { AntDesignOutlined } from '@ant-design/icons'
// import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
// import TextEditPopup from '@renderer/components/Popups/TextEditPopup'
import Scrollbar from '@renderer/components/Scrollbar'
// import db from '@renderer/databases'
// import { useProviders } from '@renderer/hooks/useProvider'
// import FileManager from '@renderer/services/FileManager'
// import store from '@renderer/store'
// import { FileType, FileTypes } from '@renderer/types'
// import { formatFileSize } from '@renderer/utils'
// import type { MenuProps } from 'antd'
import {
  Button,
  Checkbox,
  Collapse,
  ConfigProvider,
  Divider,
  // Dropdown,
  Form,
  InputNumber,
  Radio,
  Select,
  Space
} from 'antd'
import { createStyles } from 'antd-style'
// import dayjs from 'dayjs'
// import { useLiveQuery } from 'dexie-react-hooks'
import { FC, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

// import ContentView from './ContentView'

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

const InquiryPage: FC = () => {
  const { styles } = useStyle()
  const [displayedMarkdown, setDisplayedMarkdown] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  // const { t } = useTranslation()
  // const [
  // fileType
  // setFileType
  // ] = useState<FileTypes | 'all' | 'gemini'>('all')
  // const { providers } = useProviders()

  // const geminiProviders = providers.filter((provider) => provider.type === 'gemini')

  // const files = useLiveQuery<FileType[]>(() => {
  //   if (fileType === 'all') {
  //     return db.files.orderBy('count').toArray()
  //   }
  //   return db.files.where('type').equals(fileType).sortBy('count')
  // }, [fileType])

  // const handleDelete = async (fileId: string) => {
  //   const file = await FileManager.getFile(fileId)

  //   const paintings = await store.getState().paintings.paintings
  //   const paintingsFiles = paintings.flatMap((p) => p.files)

  //   if (paintingsFiles.some((p) => p.id === fileId)) {
  //     window.modal.warning({ content: t('files.delete.paintings.warning'), centered: true })
  //     return
  //   }

  //   if (file) {
  //     await FileManager.deleteFile(fileId, true)
  //   }

  //   const topics = await db.topics
  //     .filter((topic) => topic.messages.some((message) => message.files?.some((f) => f.id === fileId)))
  //     .toArray()

  //   if (topics.length > 0) {
  //     for (const topic of topics) {
  //       const updatedMessages = topic.messages.map((message) => ({
  //         ...message,
  //         files: message.files?.filter((f) => f.id !== fileId)
  //       }))
  //       await db.topics.update(topic.id, { messages: updatedMessages })
  //     }
  //   }
  // }

  // const handleRename = async (fileId: string) => {
  //   const file = await FileManager.getFile(fileId)
  //   if (file) {
  //     const newName = await TextEditPopup.show({ text: file.origin_name })
  //     if (newName) {
  //       FileManager.updateFile({ ...file, origin_name: newName })
  //     }
  //   }
  // }

  // const getActionMenu = (fileId: string): MenuProps['items'] => [
  //   {
  //     key: 'rename',
  //     icon: <EditOutlined />,
  //     label: t('files.edit'),
  //     onClick: () => handleRename(fileId)
  //   },
  //   {
  //     key: 'delete',
  //     icon: <DeleteOutlined />,
  //     label: t('files.delete'),
  //     danger: true,
  //     onClick: () => {
  //       window.modal.confirm({
  //         title: t('files.delete.title'),
  //         content: t('files.delete.content'),
  //         centered: true,
  //         okButtonProps: { danger: true },
  //         onOk: () => handleDelete(fileId)
  //       })
  //     }
  //   }
  // ]

  // const dataSource = files?.map((file) => {
  //   return {
  //     key: file.id,
  //     file: (
  //       <FileNameText className="text-nowrap" onClick={() => window.api.file.openPath(file.path)}>
  //         {file.origin_name}
  //       </FileNameText>
  //     ),
  //     size: formatFileSize(file.size),
  //     size_bytes: file.size,
  //     count: file.count,
  //     created_at: dayjs(file.created_at).format('MM-DD HH:mm'),
  //     created_at_unix: dayjs(file.created_at).unix(),
  //     actions: (
  //       <Dropdown menu={{ items: getActionMenu(file.id) }} trigger={['click']} placement="bottom" arrow>
  //         <Button type="text" size="small" icon={<EllipsisOutlined />} />
  //       </Dropdown>
  //     )
  //   }
  // })

  // const columns = useMemo(
  //   () => [
  //     {
  //       title: t('files.name'),
  //       dataIndex: 'file',
  //       key: 'file',
  //       width: '300px'
  //     },
  //     {
  //       title: t('files.size'),
  //       dataIndex: 'size',
  //       key: 'size',
  //       width: '80px',
  //       sorter: (a: { size_bytes: number }, b: { size_bytes: number }) => b.size_bytes - a.size_bytes,
  //       align: 'center'
  //     },
  //     {
  //       title: t('files.count'),
  //       dataIndex: 'count',
  //       key: 'count',
  //       width: '60px',
  //       sorter: (a: { count: number }, b: { count: number }) => b.count - a.count,
  //       align: 'center'
  //     },
  //     {
  //       title: t('files.created_at'),
  //       dataIndex: 'created_at',
  //       key: 'created_at',
  //       width: '120px',
  //       align: 'center',
  //       sorter: (a: { created_at_unix: number }, b: { created_at_unix: number }) =>
  //         b.created_at_unix - a.created_at_unix
  //     },
  //     {
  //       title: t('files.actions'),
  //       dataIndex: 'actions',
  //       key: 'actions',
  //       width: '80px',
  //       align: 'center'
  //     }
  //   ],
  //   [t]
  // )

  // const menuItems = [
  //   { key: 'all', label: t('files.all'), icon: <FileTextOutlined /> },
  //   { key: FileTypes.IMAGE, label: t('files.image'), icon: <FileImageOutlined /> },
  //   { key: FileTypes.TEXT, label: t('files.text'), icon: <FileTextOutlined /> },
  //   { key: FileTypes.DOCUMENT, label: t('files.document'), icon: <FilePdfOutlined /> },
  //   ...geminiProviders.map((provider) => ({
  //     key: 'gemini_' + provider.id,
  //     label: provider.name,
  //     icon: <FilePdfOutlined />
  //   }))
  // ].filter(Boolean) as MenuProps['items']
  // type SizeType = Parameters<typeof Form>[0]['size']
  // const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default')

  // const onFormLayoutChange = ({ size }: { size: SizeType }) => {
  //   setComponentSize(size)
  // }
  const items = [
    {
      key: '1',
      label: '品类一',
      children: (
        <Form
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 12 }}
          layout="vertical"
          // initialValues={{ size: componentSize }}
          // onValuesChange={onFormLayoutChange}
          // size={componentSize as SizeType}
          style={{ maxWidth: 600 }}>
          <Form.Item label="材质" name="size">
            <Radio.Group buttonStyle="outline">
              <Radio value="small">Small</Radio>
              <Radio value="default">Default</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="厚度mm">
            <Radio.Group>
              <Radio value="small">Small</Radio>
              <Radio value="default">Default</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
              <Radio value="large">Large</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="长mm">
            <InputNumber />
          </Form.Item>
          <Form.Item label="宽mm">
            <InputNumber />
          </Form.Item>
          <Form.Item label="产品工艺">
            <Checkbox.Group
              options={[
                { label: 'Apple', value: 'Apple' },
                { label: 'Pear', value: 'Pear' },
                { label: 'Orange', value: 'Orange' }
              ]}
              defaultValue={['Apple']}></Checkbox.Group>
          </Form.Item>
          <Form.Item label="芯片">
            <Select>
              <Select.Option value="1">芯片1</Select.Option>
              <Select.Option value="2">芯片2</Select.Option>
              <Select.Option value="3">芯片3</Select.Option>
              <Select.Option value="4">芯片4</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="是否加密">
            <Select>
              <Select.Option value="1">是</Select.Option>
              <Select.Option value="0">否</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      )
    },
    {
      key: '2',
      label: '品类二',
      children: <p>{'品类二'}</p>
    }
  ]

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
      {/* <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('AI询价')}</NavbarCenter>
      </Navbar> */}
      <ContentContainer>
        <SideNav>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton
            }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<PlusOutlined />}>新增品类</Button>
            </Space>
          </ConfigProvider>
          <Divider style={{ margin: '12px 0' }} />
          <div className="sidenav-scroll">
            <Collapse expandIconPosition="right" items={items} />
          </div>
          <div className="bottom-action">
            <Divider style={{ margin: '12px 0' }} />
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<AntDesignOutlined />}>开始询价</Button>
            </Space>
          </div>
          {/* <Menu selectedKeys={[fileType]} items={menuItems} onSelect={({ key }) => setFileType(key as FileTypes)} /> */}
        </SideNav>
        <TableContainer right>
          {/* <ContentView id={fileType} files={files} dataSource={dataSource} columns={columns} /> */}
          {/* // 展示Markdown 数据 */}
          <MarkdownContainer className={isTyping ? 'typing' : ''}>
            {isLoading && (
              <LoadingOverlay>
                <ProgressBar>
                  <ProgressFill style={{ width: `${progress}%` }} />
                </ProgressBar>
                <LoadingText>加载中 {Math.round(progress)}%</LoadingText>
              </LoadingOverlay>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedMarkdown}</ReactMarkdown>
          </MarkdownContainer>
        </TableContainer>
      </ContentContainer>
    </Container>
  )
}

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

// const FileNameText = styled.div`
//   font-size: 14px;
//   color: var(--color-text);
//   cursor: pointer;
// `

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
    // padding-bottom: 12px;
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
  position: relative; // 添加相对定位
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

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 24px 0;
    color: ${(props) => props.theme.colorTextHeading};
    border-bottom: 2px solid ${(props) => props.theme.colorBorderSecondary};
    padding-bottom: 12px;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 32px 0 16px 0;
    color: ${(props) => props.theme.colorTextHeading};
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 24px 0 12px 0;
    color: ${(props) => props.theme.colorTextSecondary};
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

export default InquiryPage
