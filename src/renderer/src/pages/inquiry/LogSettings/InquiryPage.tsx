// import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import Scrollbar from '@renderer/components/Scrollbar'
import { Empty, Menu, message } from 'antd'
import { FC, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

import { queryEnquiry } from '../api/query_enquiry'

interface EnquiryRecord {
  id: number
  userId: number
  create_time: string
  content: string
}

const InquiryPage: FC = () => {
  const [records, setRecords] = useState<EnquiryRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<EnquiryRecord | null>(null)

  // 获取询价记录数据
  const fetchEnquiryData = async () => {
    try {
      const response = await queryEnquiry()
      if (response.code === 200 && response.data) {
        setRecords(response.data)
        // 默认选中第一条记录
        if (response.data.length > 0) {
          setSelectedRecord(response.data[0])
        }
      }
    } catch (error) {
      message.error('获取询价记录失败')
      console.error('获取询价记录失败:', error)
    }
  }

  useEffect(() => {
    fetchEnquiryData()
  }, [])

  // 处理记录选择
  const handleRecordSelect = (record: EnquiryRecord) => {
    setSelectedRecord(record)
  }

  return (
    <Container>
      <ContentContainer>
        <SideNav>
          <Scrollbar>
            {/* 记录选项，点击可切换查看记录 */}
            {records.length > 0 ? (
              <Menu
                mode="inline"
                selectedKeys={selectedRecord ? [selectedRecord.id.toString()] : []}
                items={records.map((record) => ({
                  key: record.id.toString(),
                  label: new Date(record.create_time).toLocaleString(),
                  onClick: () => handleRecordSelect(record)
                }))}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Scrollbar>
        </SideNav>
        <MarkdownContainer right>
          {/* 记录详情，content字段 */}
          {selectedRecord ? (
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const code = String(children).replace(/\n$/, '')

                    if (!inline && match) {
                      return (
                        <CodeBlockWrapper>
                          <CopyButton
                            onClick={() => {
                              navigator.clipboard.writeText(code)
                              message.success('代码已复制到剪贴板')
                            }}>
                            复制代码
                          </CopyButton>
                          {/* @ts-ignore - react-syntax-highlighter 的类型定义与 React 组件类型不兼容 */}
                          <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                            {code}
                          </SyntaxHighlighter>
                        </CodeBlockWrapper>
                      )
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}>
                {selectedRecord.content}
              </ReactMarkdown>
            </div>
          ) : (
            // <EmptyText>请选择一条记录查看详情</EmptyText>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </MarkdownContainer>
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const MarkdownContainer = styled(Scrollbar)`
  padding: 15px;
  display: flex;
  width: 100%;
  flex-direction: column;

  /* Markdown 基础样式 */
  .markdown-body {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text);
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 768px) {
      padding: 15px;
      font-size: 13px;
    }
  }

  /* 标题样式 */
  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-text);

    @media (max-width: 768px) {
      margin-top: 20px;
      margin-bottom: 12px;
    }
  }

  .markdown-body h1 {
    font-size: 2em;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.3em;

    @media (max-width: 768px) {
      font-size: 1.75em;
    }
  }

  .markdown-body h2 {
    font-size: 1.5em;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.3em;

    @media (max-width: 768px) {
      font-size: 1.35em;
    }
  }

  .markdown-body h3 {
    font-size: 1.25em;

    @media (max-width: 768px) {
      font-size: 1.15em;
    }
  }

  .markdown-body h4 {
    font-size: 1em;
  }

  .markdown-body h5 {
    font-size: 0.875em;
  }

  .markdown-body h6 {
    font-size: 0.85em;
    color: var(--color-text-secondary);
  }

  /* 段落样式 */
  .markdown-body p {
    margin-top: 0;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      margin-bottom: 12px;
    }
  }

  /* 列表样式 */
  .markdown-body ul,
  .markdown-body ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      padding-left: 1.5em;
      margin-bottom: 12px;
    }
  }

  .markdown-body li {
    margin-top: 0.25em;
  }

  /* 引用块样式 */
  .markdown-body blockquote {
    padding: 0 1em;
    color: var(--color-text-secondary);
    border-left: 0.25em solid var(--color-border);
    margin: 0 0 16px 0;

    @media (max-width: 768px) {
      margin-bottom: 12px;
    }
  }

  /* 代码块样式 */
  .markdown-body pre {
    margin-top: 0;
    margin-bottom: 16px;
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: var(--color-background-soft);
    border-radius: 3px;

    @media (max-width: 768px) {
      padding: 12px;
      margin-bottom: 12px;
      font-size: 80%;
    }
  }

  .markdown-body pre code {
    padding: 0;
    margin: 0;
    font-size: 100%;
    word-break: normal;
    white-space: pre;
    background: transparent;
    border: 0;
  }

  .markdown-body pre > code {
    display: block;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: transparent;
    border: 0;
  }

  /* 链接样式 */
  .markdown-body a {
    color: var(--color-primary);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  /* 表格样式 */
  .markdown-body table {
    display: block;
    width: 100%;
    overflow: auto;
    margin-top: 0;
    margin-bottom: 16px;
    border-spacing: 0;
    border-collapse: collapse;

    @media (max-width: 768px) {
      margin-bottom: 12px;
      font-size: 13px;
    }
  }

  .markdown-body table th {
    font-weight: 600;
    padding: 6px 13px;
    border: 1px solid var(--color-border);
    background-color: var(--color-background-soft);
  }

  .markdown-body table td {
    padding: 6px 13px;
    border: 1px solid var(--color-border);
  }

  .markdown-body table tr {
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    &:nth-child(2n) {
      background-color: var(--color-background-soft);
    }
  }
`

// const EmptyText = styled.div`
//   color: var(--color-text-secondary);
//   text-align: center;
//   margin-top: 20px;
// `

const SideNav = styled.div`
  width: var(--assistants-width);
  border-right: 0.5px solid var(--color-border);
  padding: 7px 12px;
  user-select: none;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 0.5px solid var(--color-border);
    max-height: 200px;
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

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-background);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-secondary);
  }
`

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  font-size: 12px;
  color: var(--color-text);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    background-color: var(--color-background);
  }
`

const CodeBlockWrapper = styled.div`
  position: relative;

  &:hover ${CopyButton} {
    opacity: 1;
  }
`

export default InquiryPage
