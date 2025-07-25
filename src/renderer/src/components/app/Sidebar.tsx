import {
  FileSearchOutlined,
  FolderOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SolutionOutlined,
  TransactionOutlined,
  TranslationOutlined
} from '@ant-design/icons'
import { isMac } from '@renderer/config/constant'
import { AppLogo, isLocalAi, UserAvatar } from '@renderer/config/env'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
import useAvatar from '@renderer/hooks/useAvatar'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { usePermissions } from '@renderer/hooks/usePermissions'
import { modelGenerating, useRuntime } from '@renderer/hooks/useRuntime'
import { useSettings } from '@renderer/hooks/useSettings'
import { isEmoji } from '@renderer/utils'
import type { MenuProps } from 'antd'
import { Tooltip } from 'antd'
import { Avatar } from 'antd'
import { Dropdown } from 'antd'
import { message, Modal } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import DragableList from '../DragableList'
import MinAppIcon from '../Icons/MinAppIcon'
import MinApp from '../MinApp'
import UserPopup from '../Popups/UserPopup'
const Sidebar: FC = () => {
  const { pathname } = useLocation()
  const avatar = useAvatar()
  const { minappShow } = useRuntime()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { windowStyle, sidebarIcons } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const { pinned } = useMinapps()
  const { isAdmin } = useAdminCheck()
  const onEditUser = () => UserPopup.show()
  const [showClearModal, setShowClearModal] = useState(false)

  const macTransparentWindow = isMac && windowStyle === 'transparent'
  const sidebarBgColor = macTransparentWindow ? 'transparent' : 'var(--navbar-background)'

  const showPinnedApps = pinned.length > 0 && sidebarIcons.visible.includes('minapp')

  const to = async (path: string) => {
    await modelGenerating()
    navigate(path)
  }

  const onOpenDocs = () => {
    MinApp.start({
      id: 'docs',
      name: t('docs.title'),
      url: 'https://docs.cherry-ai.com/',
      logo: AppLogo
    })
  }

  // 用于强制刷新Sidebar
  const [permissionVersion, setPermissionVersion] = useState(0)
  useEffect(() => {
    const handler = () => {
      // 延迟50ms再触发刷新，防止极端race condition
      setTimeout(() => setPermissionVersion((v) => v + 1), 50)
    }
    window.addEventListener('permissions-changed', handler)
    return () => {
      window.removeEventListener('permissions-changed', handler)
    }
  }, [])

  // 新增：调试日志，Sidebar每次渲染时打印menuPermissions
  useEffect(() => {
    const menuPermissions = localStorage.getItem('menuPermissions')
    console.log('[Sidebar] 渲染时读取到的menuPermissions:', menuPermissions)
  }, [permissionVersion])

  return (
    <Container
      id="app-sidebar"
      style={{
        backgroundColor: sidebarBgColor,
        zIndex: minappShow ? 10000 : 'initial'
      }}>
      {isEmoji(avatar) ? (
        <EmojiAvatar onClick={onEditUser}>{avatar}</EmojiAvatar>
      ) : (
        <AvatarImg src={avatar || UserAvatar} draggable={false} className="nodrag" onClick={onEditUser} />
      )}
      <MainMenusContainer>
        <Menus onClick={MinApp.onClose}>
          <MainMenus key={permissionVersion} />
        </Menus>
        {showPinnedApps && (
          <AppsContainer>
            <Divider />
            <Menus>
              <PinnedApps />
            </Menus>
          </AppsContainer>
        )}
      </MainMenusContainer>
      <Menus>
        {isAdmin && (
          <Tooltip title={t('docs.title')} mouseEnterDelay={0.8} placement="right">
            <Icon
              onClick={onOpenDocs}
              className={minappShow && MinApp.app?.url === 'https://docs.cherry-ai.com/' ? 'active' : ''}>
              <QuestionCircleOutlined />
            </Icon>
          </Tooltip>
        )}
        <Tooltip title={t('settings.theme.title')} mouseEnterDelay={0.8} placement="right">
          <Icon onClick={() => toggleTheme()}>
            {theme === 'dark' ? (
              <i className="iconfont icon-theme icon-dark1" />
            ) : (
              <i className="iconfont icon-theme icon-theme-light" />
            )}
          </Icon>
        </Tooltip>
        {isAdmin && (
          <Tooltip title={t('settings.title')} mouseEnterDelay={0.8} placement="right">
            <StyledLink
              onClick={async () => {
                if (minappShow) {
                  await MinApp.close()
                }
                await to(isLocalAi ? '/settings/assistant' : '/settings/provider')
              }}>
              <Icon className={pathname.startsWith('/settings') && !minappShow ? 'active' : ''}>
                <i className="iconfont icon-setting" />
              </Icon>
            </StyledLink>
          </Tooltip>
        )}
        <Tooltip title={t('settings.data.clear_cache.button', '清除全部数据')} mouseEnterDelay={0.8} placement="right">
          {/* onClick={() => window.dispatchEvent(new Event('require-permission-refresh'))} */}
          <Icon onClick={() => setShowClearModal(true)}>
            <ReloadOutlined />
          </Icon>
        </Tooltip>
      </Menus>
      <Modal
        title={t('settings.data.clear_cache.button', '清除全部数据')}
        open={showClearModal}
        onOk={async () => {
          // 清除localStorage
          localStorage.clear()
          // 清除sessionStorage
          sessionStorage.clear()
          // 清除所有IndexedDB数据库
          if (window.indexedDB && indexedDB.databases) {
            try {
              const dbs = await indexedDB.databases()
              if (dbs && dbs.length > 0) {
                for (const db of dbs) {
                  if (db.name) {
                    indexedDB.deleteDatabase(db.name)
                  }
                }
              }
            } catch (e) {
              // 某些环境下不支持indexedDB.databases()，此处忽略异常
            }
          }
          // 清除Cache Storage
          if (window.caches && caches.keys) {
            try {
              const keys = await caches.keys()
              for (const key of keys) {
                await caches.delete(key)
              }
            } catch (e) {
              // 清除Cache Storage时发生异常，忽略
            }
          }
          message.success(t('settings.data.clear_cache.success', '清除成功'))
          setShowClearModal(false)
          window.api.restart()
        }}
        onCancel={() => setShowClearModal(false)}
        okText={t('common.confirm', '确认')}
        cancelText={t('common.cancel', '取消')}>
        {t('settings.data.clear_cache.confirm', '确定要清除当前加载网站的全部数据吗？此操作不可恢复。')}
      </Modal>
    </Container>
  )
}

const MainMenus: FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { sidebarIcons } = useSettings()
  const { minappShow } = useRuntime()
  const navigate = useNavigate()
  const { checkMenuPermission } = usePermissions()
  const isRoute = (path: string): string => (pathname === path && !minappShow ? 'active' : '')
  const isRoutes = (path: string): string => (pathname.startsWith(path) && !minappShow ? 'active' : '')

  // 菜单权限映射
  const menuPermissionMap = {
    assistants: '对话界面',
    agents: '智能体',
    paintings: '文生图',
    translate: '翻译',
    minapp: '小程序',
    knowledge: '知识库',
    files: '文件',
    aiimages: 'AI图像',
    talent: '人才库',
    inquiry: 'AI询价'
  }

  // 添加调试代码
  console.log('权限信息:', localStorage.getItem('menuPermissions'))
  console.log('可见菜单:', sidebarIcons.visible)

  // 修改过滤逻辑，添加临时解决方案
  // 原代码: const authorizedIcons = sidebarIcons.visible.filter((icon) => checkMenuPermission(menuPermissionMap[icon]))

  // 新代码: 对'talent'和'aiimages'特殊处理，其他菜单正常权限检查
  const authorizedIcons = sidebarIcons.visible.filter((icon) => {
    // 对于新添加的菜单，临时绕过权限检查
    // if (icon === 'inquiry') {
    //   return true
    // }
    return checkMenuPermission(menuPermissionMap[icon])
  })

  // 增强：若所有菜单权限均为false，自动触发权限刷新或提示
  useEffect(() => {
    if (authorizedIcons.length === 0 && sidebarIcons.visible.length > 0) {
      // 派发权限刷新事件，或弹窗提示
      window.dispatchEvent(new Event('permissions-changed'))
      // 可选：弹窗提示
      // message.warning('未检测到任何可用菜单权限，已自动尝试刷新权限。如仍无菜单，请重新登录。')
    }
  }, [authorizedIcons.length, sidebarIcons.visible.length])

  const iconMap = {
    assistants: <i className="iconfont icon-chat" />,
    agents: <i className="iconfont icon-business-smart-assistant" />,
    paintings: <PictureOutlined style={{ fontSize: 16 }} />,
    translate: <TranslationOutlined />,
    minapp: <i className="iconfont icon-appstore" />,
    knowledge: <FileSearchOutlined />,
    files: <FolderOutlined />,
    aiimages: <i className="iconfont icon-image" />,
    talent: <SolutionOutlined />,
    inquiry: <TransactionOutlined />
  }

  const pathMap = {
    assistants: '/',
    agents: '/agents',
    paintings: '/paintings',
    translate: '/translate',
    minapp: '/apps',
    knowledge: '/knowledge',
    files: '/files',
    aiimages: '/aiimages',
    talent: '/talent',
    inquiry: '/inquiry'
  }

  // 新增：调试日志，MainMenus每次渲染时打印menuPermissions
  useEffect(() => {
    const menuPermissions = localStorage.getItem('menuPermissions')
    console.log('[MainMenus] 渲染时读取到的menuPermissions:', menuPermissions)
  })

  return authorizedIcons.map((icon) => {
    const path = pathMap[icon]
    const isActive = path === '/' ? isRoute(path) : isRoutes(path)

    return (
      <Tooltip key={icon} title={t(`${icon}.title`)} mouseEnterDelay={0.8} placement="right">
        <StyledLink
          onClick={async () => {
            if (minappShow) {
              await MinApp.close()
            }
            navigate(path)
          }}>
          <Icon className={isActive}>{iconMap[icon]}</Icon>
        </StyledLink>
      </Tooltip>
    )
  })
}

const PinnedApps: FC = () => {
  const { pinned, updatePinnedMinapps } = useMinapps()
  const { t } = useTranslation()
  const { minappShow } = useRuntime()

  return (
    <DragableList list={pinned} onUpdate={updatePinnedMinapps} listStyle={{ marginBottom: 5 }}>
      {(app) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'togglePin',
            label: t('minapp.sidebar.remove.title'),
            onClick: () => {
              const newPinned = pinned.filter((item) => item.id !== app.id)
              updatePinnedMinapps(newPinned)
            }
          }
        ]
        const isActive = minappShow && MinApp.app?.id === app.id
        return (
          <Tooltip key={app.id} title={app.name} mouseEnterDelay={0.8} placement="right">
            <StyledLink>
              <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
                <Icon onClick={() => MinApp.start(app)} className={isActive ? 'active' : ''}>
                  <MinAppIcon size={20} app={app} style={{ borderRadius: 6 }} />
                </Icon>
              </Dropdown>
            </StyledLink>
          </Tooltip>
        )
      }}
    </DragableList>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  padding-bottom: 12px;
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: ${isMac ? 'calc(100vh - var(--navbar-height))' : '100vh'};
  -webkit-app-region: drag !important;
  margin-top: ${isMac ? 'var(--navbar-height)' : 0};
`

const AvatarImg = styled(Avatar)`
  width: 31px;
  height: 31px;
  background-color: var(--color-background-soft);
  margin-bottom: ${isMac ? '12px' : '12px'};
  margin-top: ${isMac ? '0px' : '2px'};
  border: none;
  cursor: pointer;
`

const EmojiAvatar = styled.div`
  width: 31px;
  height: 31px;
  background-color: var(--color-background-soft);
  margin-bottom: ${isMac ? '12px' : '12px'};
  margin-top: ${isMac ? '0px' : '2px'};
  border-radius: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  -webkit-app-region: none;
  border: 0.5px solid var(--color-border);
  font-size: 20px;
`

const MainMenusContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`

const Menus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`

const Icon = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20%;
  box-sizing: border-box;
  -webkit-app-region: none;
  border: 0.5px solid transparent;
  .iconfont,
  .anticon {
    color: var(--color-icon);
    font-size: 20px;
    text-decoration: none;
  }
  .anticon {
    font-size: 17px;
  }
  &:hover {
    background-color: var(--color-hover);
    opacity: 0.8;
    cursor: pointer;
    .iconfont,
    .anticon {
      color: var(--color-icon-white);
    }
  }
  &.active {
    background-color: var(--color-active);
    border: 0.5px solid var(--color-border);
    .iconfont,
    .anticon {
      color: var(--color-icon);
    }
  }
`

const StyledLink = styled.div`
  text-decoration: none;
  -webkit-app-region: none;
  &* {
    user-select: none;
  }
`

const AppsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
  -webkit-app-region: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Divider = styled.div`
  width: 50%;
  margin: 8px 0;
  border-bottom: 0.5px solid var(--color-border);
`

export default Sidebar
