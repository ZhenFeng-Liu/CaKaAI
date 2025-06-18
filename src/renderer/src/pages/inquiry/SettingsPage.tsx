import {
  DatabaseOutlined,
  HomeOutlined,
  ProfileOutlined
  // CloudOutlined,
  // GlobalOutlined,
  // InfoCircleOutlined
  // LayoutOutlined,
  // MacCommandOutlined,
  // RocketOutlined,
  // SaveOutlined,
  // SettingOutlined,
  // UserAddOutlined
} from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { usePermissions } from '@renderer/hooks/usePermissions'
import { Tooltip } from 'antd'
// import { isLocalAi } from '@renderer/config/env'
// import ModelSettings from '@renderer/pages/settings/ModelSettings/ModelSettings'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import DataPage from './DataSettings/DataPage'
import InquiryPage from './InquirySettings/InquiryPage'
import InquiryLogPage from './LogSettings/InquiryPage'
// import DataSettings from './DataSettings/DataSettings'
// import DisplaySettings from './DisplaySettings/DisplaySettings'
// import GeneralSettings from './GeneralSettings'
// import MembersSettings from './MembersSettings/MembersSettings'
// import ProvidersList from './ProviderSettings'
// import QuickAssistantSettings from './QuickAssistantSettings'
// import ShortcutSettings from './ShortcutSettings'
// import WebSearchSettings from './WebSearchSettings'

const SettingsPage: FC = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { checkButtonPermission } = usePermissions()

  const isRoute = (path: string): string => (pathname.startsWith(path) ? 'active' : '')

  // 定义按钮权限映射
  const buttonPermissions = {
    inquiry: 'AI询价',
    log: '询价记录',
    data: '数据清洗平台'
  }

  // 检查各个按钮的权限
  const hasInquiryPermission = checkButtonPermission('AI询价', buttonPermissions.inquiry)
  const hasLogPermission = checkButtonPermission('AI询价', buttonPermissions.log)
  const hasDataPermission = checkButtonPermission('AI询价', buttonPermissions.data)

  // 如果没有权限配置，默认显示所有菜单（向后兼容）
  const showAllMenus = !localStorage.getItem('menuPermissions')
  const finalInquiryPermission = showAllMenus || hasInquiryPermission
  const finalLogPermission = showAllMenus || hasLogPermission
  const finalDataPermission = showAllMenus || hasDataPermission

  // 添加调试日志（开发调试用，生产环境可移除）
  console.log('AI询价权限检查:', {
    inquiry: hasInquiryPermission,
    log: hasLogPermission,
    data: hasDataPermission,
    menuPermissions: localStorage.getItem('menuPermissions'),
    parsedPermissions: JSON.parse(localStorage.getItem('menuPermissions') || '[]'),
    showAllMenus,
    finalInquiryPermission,
    finalLogPermission,
    finalDataPermission
  })

  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('AI 询价')}</NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        <SettingMenus>
          {/* {!isLocalAi && (
            <>
              <MenuItemLink to="/inquiry/provider">
                <MenuItem className={isRoute('/inquiry/provider')}>
                  <CloudOutlined />
                  {t('settings.provider.title')}
                </MenuItem>
              </MenuItemLink>
              <MenuItemLink to="/inquiry/model">
                <MenuItem className={isRoute('/inquiry/model')}>
                  <i className="iconfont icon-ai-model" />
                  {t('settings.model')}
                </MenuItem>
              </MenuItemLink>
            </>
          )} */}
          {/* <MenuItemLink to="/settings/web-search">
            <MenuItem className={isRoute('/settings/web-search')}>
              <GlobalOutlined />
              {t('settings.websearch.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/general">
            <MenuItem className={isRoute('/settings/general')}>
              <SettingOutlined />
              {t('settings.general')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/display">
            <MenuItem className={isRoute('/settings/display')}>
              <LayoutOutlined />
              {t('settings.display.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/shortcut">
            <MenuItem className={isRoute('/settings/shortcut')}>
              <MacCommandOutlined />
              {t('settings.shortcuts.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/quickAssistant">
            <MenuItem className={isRoute('/settings/quickAssistant')}>
              <RocketOutlined />
              {t('settings.quickAssistant.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/data">
            <MenuItem className={isRoute('/settings/data')}>
              <SaveOutlined />
              {t('settings.data.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/members">
            <MenuItem className={isRoute('/settings/members')}>
              <UserAddOutlined />
              {'会员管理'}
            </MenuItem>
          </MenuItemLink> */}
          {finalInquiryPermission && (
            <MenuItemLink to="/inquiry/inquiry">
              <Tooltip title={t('AI 询价')} placement="right">
                <MenuItem className={isRoute('/inquiry/inquiry')}>
                  <HomeOutlined />
                  {/* {t('AI 询价')} */}
                </MenuItem>
              </Tooltip>
            </MenuItemLink>
          )}
          {finalLogPermission && (
            <MenuItemLink to="/inquiry/log">
              <Tooltip title={t('询价记录')} placement="right">
                <MenuItem className={isRoute('/inquiry/log')}>
                  <ProfileOutlined />
                  {/* {t('询价记录')} */}
                </MenuItem>
              </Tooltip>
            </MenuItemLink>
          )}
          {finalDataPermission && (
            <MenuItemLink to="/inquiry/data">
              <Tooltip title={t('数据清洗平台')} placement="right">
                <MenuItem className={isRoute('/inquiry/data')}>
                  <DatabaseOutlined />
                  {/* {t('数据平台')} */}
                </MenuItem>
              </Tooltip>
            </MenuItemLink>
          )}
        </SettingMenus>
        <SettingContent>
          <Routes>
            {/* <Route path="provider" element={<ProvidersList />} />
            <Route path="model" element={<ModelSettings />} />
            <Route path="web-search" element={<WebSearchSettings />} />
            <Route path="general/*" element={<GeneralSettings />} />
            <Route path="display" element={<DisplaySettings />} />
            <Route path="data/*" element={<DataSettings />} />
            <Route path="quickAssistant" element={<QuickAssistantSettings />} />
            <Route path="shortcut" element={<ShortcutSettings />} />
            <Route path="members" element={<MembersSettings />} /> */}
            <Route index element={<Navigate to="inquiry" replace />} />
            <Route path="inquiry" element={<InquiryPage />} />
            <Route path="log" element={<InquiryLogPage />} />
            <Route path="data" element={<DataPage />} />
          </Routes>
        </SettingContent>
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`

const SettingMenus = styled.ul`
  display: flex;
  flex-direction: column;
  min-width: var(--sidebar-width);
  border-right: 0.5px solid var(--color-border);
  padding: 10px;
  user-select: none;
`

const MenuItemLink = styled(Link)`
  text-decoration: none;
  color: var(--color-text-1);
  margin-bottom: 10px;
`

const MenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  border-radius: 20%;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border: 0.5px solid transparent;
  .anticon {
    font-size: 16px;
    opacity: 0.8;
  }
  .iconfont {
    font-size: 18px;
    line-height: 18px;
    opacity: 0.7;
    margin-left: -1px;
  }
  &:hover {
    background: var(--color-background-soft);
  }
  &.active {
    background: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
  }
`

const SettingContent = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
  border-right: 0.5px solid var(--color-border);
`

export default SettingsPage
