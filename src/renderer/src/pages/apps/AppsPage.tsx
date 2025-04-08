import { SearchOutlined } from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { Center } from '@renderer/components/Layout'
import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { Empty, Input } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import App from './App'

// 定义应用分类与对应的应用ID
const STATIC_APP_CATEGORIES = {
  // AI对话工具: ['doubao', 'deepseek', 'dashscope', 'tencent-yuanbao', 'baidu-ai-chat', 'anthropic', 'openai', 'gemini'],
  // AI图像视频: ['tongyi-wanxiang', 'jimeng', 'leonardo'],
  // AI办公软件: ['moonshot', 'yi', 'wpslingxi', 'xmind'],
  // AI编程工具: ['github-copilot', 'devv', 'coze', 'dify']
}
// 解析用户信息和应用列表
const getUserApps = () => {
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    if (!userInfoStr) return []

    const userInfo = JSON.parse(userInfoStr)
    // 获取用户的所有角色
    const roles = userInfo.Roles || []
    if (roles.length === 0) return []

    // 获取所有角色的小程序按钮列表
    const allApps = roles.reduce((apps: any[], role) => {
      // 从每个角色的 Menus 中找到"小程序"菜单
      const appMenu = role.Menus?.find((menu) => menu.menu === '小程序')
      if (appMenu?.Buttons) {
        // 过滤已启用的按钮
        const enabledButtons = appMenu.Buttons.filter((button) => button.enable === 1)
        // 合并到应用列表中，避免重复
        enabledButtons.forEach((button) => {
          if (!apps.some((app) => app.uid === button.uid)) {
            apps.push(button)
          }
        })
      }
      return apps
    }, [])

    return allApps
  } catch (error) {
    console.error('解析用户应用列表失败:', error)
    return []
  }
}

// 获取用户应用列表
const userApps = getUserApps()
console.log('用户应用列表:', userApps)

// 根据用户应用列表生成动态的APP_CATEGORIES
const generateDynamicCategories = (apps) => {
  const dynamicCategories = {}

  // 遍历用户应用，按info(分类)进行分组
  apps.forEach((app) => {
    if (app.info) {
      if (!dynamicCategories[app.info]) {
        dynamicCategories[app.info] = []
      }
      // 使用应用名称作为ID，因为用户应用可能没有ID
      dynamicCategories[app.info].push(app.name.toLowerCase())
    }
  })

  // 如果没有任何分类，使用静态分类
  if (Object.keys(dynamicCategories).length === 0) {
    return STATIC_APP_CATEGORIES
  }

  return dynamicCategories
}

// 生成动态分类
const APP_CATEGORIES = generateDynamicCategories(userApps)
console.log('动态应用分类:', APP_CATEGORIES)

const AppsPage: FC = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { minapps } = useMinapps()
  const { isAdmin } = useAdminCheck()

  // 将用户应用列表和动态分类的获取移到组件内部
  const [, setUserApps] = useState([])
  const [appCategories, setAppCategories] = useState<Record<string, string[]>>(STATIC_APP_CATEGORIES)

  // 使用useEffect在组件挂载和页面切换时获取用户应用列表
  useEffect(() => {
    const apps = getUserApps()
    console.log('用户应用列表:', apps)
    setUserApps(apps)

    // 生成动态分类
    const dynamicCategories = generateDynamicCategories(apps)
    console.log('动态应用分类:', dynamicCategories)
    setAppCategories(dynamicCategories)
  }, []) // 空依赖数组表示仅在组件挂载时执行一次

  const filteredApps = search
    ? minapps.filter(
        (app) => app.name.toLowerCase().includes(search.toLowerCase()) || app.url.includes(search.toLowerCase())
      )
    : minapps // 确保没有搜索条件时返回所有应用

  // 按分类对应用进行分组
  const categorizeApps = () => {
    const categorized: Record<string, typeof filteredApps> = {}

    // 初始化分类
    Object.keys(appCategories).forEach((category) => {
      categorized[category] = []
    })

    // 分类应用
    filteredApps.forEach((app) => {
      let assigned = false

      // 尝试将应用分配到相应类别
      // for (const [category, appIds] of Object.entries(APP_CATEGORIES)) {
      //   // 精准匹配应用ID
      //   if (app.id && appIds.includes(app.id as string)) {
      //     categorized[category].push(app)
      //     assigned = true
      //     break
      //   }
      // }

      // 1. 首先尝试通过ID精确匹配
      // if (app.id && appIdToCategoryMap[app.id as string]) {
      //   const category = appIdToCategoryMap[app.id as string]
      //   categorized[category].push(app)
      //   assigned = true
      // }
      // // 2. 然后尝试通过名称匹配用户自定义分类
      // else if (app.name && userCategoryMap[app.name.toLowerCase()]) {
      //   const category = userCategoryMap[app.name.toLowerCase()]
      //   if (!categorized[category]) {
      //     categorized[category] = []
      //   }
      //   categorized[category].push(app)
      //   assigned = true
      // }

      // 遍历所有分类
      for (const [category, appIds] of Object.entries(appCategories)) {
        // 尝试通过ID匹配
        // 添加类型断言，确保TypeScript知道appIds是字符串数组
        const appIdList = appIds as string[]
        if (app.id && appIdList.includes(app.id as string)) {
          categorized[category].push(app)
          assigned = true
          break
        }

        // 尝试通过名称匹配
        if (app.name && appIdList.includes(app.name.toLowerCase())) {
          categorized[category].push(app)
          assigned = true
          break
        }
      }
      // 如果没有匹配的类别，创建"其他"类别(仅管理员可见)
      // 添加管理员判断
      if (!assigned && isAdmin) {
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
