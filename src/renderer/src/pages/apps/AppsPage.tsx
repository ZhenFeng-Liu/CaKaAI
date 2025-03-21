import { SearchOutlined } from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { Center } from '@renderer/components/Layout'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { Empty, Input } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import App from './App'

// 定义应用分类与对应的应用ID
const APP_CATEGORIES = {
  AI对话工具: ['doubao', 'deepseek', 'dashscope', 'tencent-yuanbao', 'baidu-ai-chat', 'anthropic', 'openai', 'gemini'],
  AI图像视频: ['tongyi-wanxiang', 'jimeng', 'leonardo'],
  AI办公软件: ['moonshot', 'yi', 'wpslingxi'],
  AI编程工具: ['github-copilot', 'devv', 'coze', 'dify']
}

const AppsPage: FC = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { minapps } = useMinapps()

  const filteredApps = search
    ? minapps.filter(
        (app) => app.name.toLowerCase().includes(search.toLowerCase()) || app.url.includes(search.toLowerCase())
      )
    : minapps // 确保没有搜索条件时返回所有应用

  // 按分类对应用进行分组
  const categorizeApps = () => {
    const categorized: Record<string, typeof filteredApps> = {}

    // 初始化分类
    Object.keys(APP_CATEGORIES).forEach((category) => {
      categorized[category] = []
    })

    // 分类应用
    filteredApps.forEach((app) => {
      let assigned = false

      // 尝试将应用分配到相应类别
      for (const [category, appIds] of Object.entries(APP_CATEGORIES)) {
        // 精准匹配应用ID
        if (app.id && appIds.includes(app.id as string)) {
          categorized[category].push(app)
          assigned = true
          break
        }
      }

      // 如果没有匹配的类别，创建"其他"类别
      if (!assigned) {
        if (!categorized['其他']) {
          categorized['其他'] = []
        }
        categorized['其他'].push(app)
      }
    })

    console.log('categorized', categorized)

    // 过滤掉空类别
    return Object.entries(categorized).filter(([category]) => categorized[category].length > 0)
  }

  const categorizedApps = categorizeApps()
  // Calculate the required number of lines
  // const itemsPerRow = Math.floor(930 / 115) // Maximum width divided by the width of each item (including spacing)
  // const rowCount = Math.ceil(filteredApps.length / itemsPerRow)
  // Each line height is 85px (60px icon + 5px margin + 12px text + spacing)
  // const containerHeight = rowCount * 85 + (rowCount - 1) * 25 // 25px is the line spacing.

  // Disable right-click menu in blank area
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <Container onContextMenu={handleContextMenu}>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none', justifyContent: 'space-between' }}>
          {t('minapp.title')}
          <Input
            placeholder={t('common.search')}
            className="nodrag"
            style={{ width: '30%', height: 28 }}
            size="small"
            variant="filled"
            suffix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ width: 80 }} />
        </NavbarCenter>
      </Navbar>
      {/* <ContentContainer id="content-container">
        <AppsContainer style={{ height: containerHeight }}>
          {filteredApps.map((app) => (
            <App key={app.id} app={app} />
          ))}
          {isEmpty(filteredApps) && (
            <Center style={{ flex: 1 }}>
              <Empty />
            </Center>
          )}
        </AppsContainer>
      </ContentContainer> */}
      <ContentContainer id="content-container">
        {isEmpty(filteredApps) ? (
          <Center style={{ flex: 1 }}>
            <Empty />
          </Center>
        ) : (
          <CategoriesContainer>
            {categorizedApps.map(([category, apps]) => (
              <CategorySection key={category}>
                <CategoryTitle>{category}</CategoryTitle>
                <AppsContainer>
                  {apps.map((app) => (
                    <App key={app.id} app={app} />
                  ))}
                </AppsContainer>
              </CategorySection>
            ))}
          </CategoriesContainer>
        )}
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
  padding: 50px;
`

const AppsContainer = styled.div`
  display: grid;
  min-width: 0;
  max-width: 930px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 90px);
  gap: 25px;
  justify-content: center;
`
const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const CategoryTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: var(--color-text);
`

export default AppsPage
