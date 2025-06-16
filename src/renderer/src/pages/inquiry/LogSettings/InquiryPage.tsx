// import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import Scrollbar from '@renderer/components/Scrollbar'
import Markdown from '@renderer/pages/home/Markdown/Markdown'
import type { AvatarProps } from 'antd'
import { Avatar, Empty, Menu, message } from 'antd'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { queryEnquiry } from '../api/query_enquiry'

export interface EnquiryRecord {
  id: number
  userId: number
  create_time: string
  info: string
  content: string
  role: 'user' | 'assistant'
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
                  // label: new Date(record.create_time).toLocaleString(),
                  label: `${new Date(record.create_time).toLocaleString()}${record.info}`,
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
              <MessageContainer>
                <AvatarWrapper>
                  <StyledAvatar size={32}>{selectedRecord.role === 'assistant' ? 'AI' : 'U'}</StyledAvatar>
                </AvatarWrapper>
                <ContentWrapper>
                  <TimeWrapper>{new Date(selectedRecord.create_time).toLocaleString()}</TimeWrapper>
                  <MarkdownContent>
                    <Markdown
                      message={{
                        id: selectedRecord.id.toString(),
                        assistantId: selectedRecord.userId.toString(),
                        topicId: selectedRecord.id.toString(),
                        role: 'assistant',
                        content: selectedRecord.content,
                        status: 'success',
                        type: 'text',
                        createdAt: selectedRecord.create_time
                      }}
                    />
                  </MarkdownContent>
                </ContentWrapper>
              </MessageContainer>
            </div>
          ) : (
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
`

const MarkdownContainer = styled(Scrollbar)`
  padding: 15px;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow-x: auto;

  /* Markdown 基础样式 */
  .markdown-body {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text);
    padding: 20px;
    margin: 0 auto;
    width: 100%;
    overflow-x: auto;
    .markdown-content {
      white-space: normal;
    }
  }

  /* 确保 Markdown 组件样式正确显示 */
  .markdown {
    width: 100%;
  }
`

const SideNav = styled.div`
  width: calc(var(--assistants-width) + 120px);
  border-right: 0.5px solid var(--color-border);
  padding: 12px;
  user-select: none;
  height: 100%;
  overflow-y: auto;

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

const MessageContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 8px 0;
`

const AvatarWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StyledAvatar = styled(Avatar)<AvatarProps>`
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.5px solid var(--color-border);
`

const TimeWrapper = styled.div`
  font-size: 12px;
  color: var(--color-text-3);
  line-height: 1.2;
`

const MarkdownContent = styled.div`
  .markdown-content {
    margin-top: 0;
  }
`

export default InquiryPage
