import '@renderer/databases'

// import { knowledgeApi } from '@renderer/api/knowledge'
// import { providerApi } from '@renderer/api/provider'
import AuthRoute from '@renderer/components/AuthRoute'
import MinApp from '@renderer/components/MinApp'
import { AppLogo } from '@renderer/config/env' // 根据实际路径调整
// import { useProviders } from '@renderer/hooks/useProvider'
import store, { persistor } from '@renderer/store'
// import { Provider as ProviderType } from '@renderer/types'
// import { uuid } from '@renderer/utils'
import { message, Spin } from 'antd'
import { createContext, FC, useContext, useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import { menuApi } from './api/menu'
import Sidebar from './components/app/Sidebar'
import TopViewContainer from './components/TopView'
import AntdProvider from './context/AntdProvider'
import StyleSheetManager from './context/StyleSheetManager'
import { SyntaxHighlighterProvider } from './context/SyntaxHighlighterProvider'
import { ThemeProvider } from './context/ThemeProvider'
import NavigationHandler from './handler/NavigationHandler'
import useUserInfo from './hooks/useUserInfo'
import AgentsPage from './pages/agents/AgentsPage'
import AIimagesPage from './pages/aiimages/AIimagesPage'
import AppsPage from './pages/apps/AppsPage'
import FilesPage from './pages/files/FilesPage'
import HomePage from './pages/home/HomePage'
import InquiryPage from './pages/inquiry/SettingsPage'
import KnowledgePage from './pages/knowledge/KnowledgePage'
import LoginPage from './pages/login/LoginPage'
// import TranslatePage from './pages/translate/TranslatePage'
import AssistantPage from './pages/settings/MembersSettings/AssistantPage'
import MemberPage from './pages/settings/MembersSettings/MemberPage'
import RolePage from './pages/settings/MembersSettings/RolePage'
import SettingsPage from './pages/settings/SettingsPage'

const AIPainting: FC = () => {
  // useEffect(() => {
  //   window.open('http://192.168.0.123:8188', '_blank')
  // }, [])
  // return <div>正在跳转...</div>
  useEffect(() => {
    MinApp.start({
      id: 'baidu-sd',
      name: 'AI 绘画',
      url: 'http://192.168.0.123:8188',
      logo: AppLogo // 需要导入 AppLogo 或使用其他合适的图标
    })
  }, [])
  return null
}
const AITranslation: FC = () => {
  // useEffect(() => {
  //   window.open('http://192.168.0.123:8188', '_blank')
  // }, [])
  // return <div>正在跳转...</div>
  useEffect(() => {
    MinApp.start({
      id: 'huoshan-translation',
      name: 'AI 翻译',
      url: 'https://translate.volcengine.com/',
      logo: AppLogo // 需要导入 AppLogo 或使用其他合适的图标
    })
  }, [])
  return null
}

const AITalent: FC = () => {
  // useEffect(() => {
  //   window.open('http://192.168.0.123:8188', '_blank')
  // }, [])
  // return <div>正在跳转...</div>
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const userInfoObj = JSON.parse(userInfo)
      const inputer = userInfoObj.name
      MinApp.start({
        id: 'huoshan-talent',
        name: '人才库',
        url: `http://192.168.0.123:5173/?inputer=${inputer}`,
        logo: AppLogo // 需要导入 AppLogo 或使用其他合适的图标
      })
    }
  }, [])
  return null
}

const MainContent: FC = () => {
  return (
    <>
      {/* <AppDataInitializer /> */}
      <StyleSheetManager>
        <ThemeProvider>
          <AntdProvider>
            <SyntaxHighlighterProvider>
              <PersistGate loading={null} persistor={persistor}>
                <TopViewContainer>
                  <HashRouter>
                    <NavigationHandler />
                    <Sidebar />
                    <Routes>
                      {/* <Route path="/" element={<HomePage />} />
                    <Route path="/agents" element={<AgentsPage />} />
                    <Route path="/paintings" element={<PaintingsPage />} />
                    <Route path="/translate" element={<TranslatePage />} />
                    <Route path="/files" element={<FilesPage />} />
                    <Route path="/knowledge" element={<KnowledgePage />} />
                    <Route path="/apps" element={<AppsPage />} />
                    <Route path="/settings/*" element={<SettingsPage />} />
                    <Route path="/settings/MembersSettings/roles" element={<RolePage />} />
                    <Route path="/settings/MembersSettings/members" element={<MemberPage />} /> */}
                      <Route
                        path="/"
                        element={
                          <AuthRoute menuName="对话界面">
                            <HomePage />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/agents"
                        element={
                          <AuthRoute menuName="智能体">
                            <AgentsPage />
                          </AuthRoute>
                        }
                      />
                      {/* <Route
                        path="/paintings"
                        element={
                          <AuthRoute menuName="文生图">
                            <PaintingsPage />
                          </AuthRoute>
                        }
                      /> */}
                      <Route
                        path="/paintings"
                        element={
                          <AuthRoute menuName="文生图">
                            <AIPainting />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/translate"
                        element={
                          <AuthRoute menuName="翻译">
                            <AITranslation />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/apps"
                        element={
                          <AuthRoute menuName="小程序">
                            <AppsPage />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/knowledge"
                        element={
                          <AuthRoute menuName="知识库">
                            <KnowledgePage />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/files"
                        element={
                          <AuthRoute menuName="文件">
                            <FilesPage />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/aiimages"
                        element={
                          <AuthRoute menuName="AI图像">
                            <AIimagesPage />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/talent"
                        element={
                          <AuthRoute menuName="人才库">
                            <AITalent />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/inquiry/*"
                        element={
                          <AuthRoute menuName="AI询价">
                            <InquiryPage />
                          </AuthRoute>
                        }
                      />
                      <Route path="/settings/*" element={<SettingsPage />} />
                      <Route path="/settings/MembersSettings/roles" element={<RolePage />} />
                      <Route path="/settings/MembersSettings/members" element={<MemberPage />} />
                      <Route path="/settings/MembersSettings/assistant" element={<AssistantPage />} />
                    </Routes>
                  </HashRouter>
                </TopViewContainer>
              </PersistGate>
            </SyntaxHighlighterProvider>
          </AntdProvider>
        </ThemeProvider>
      </StyleSheetManager>
    </>
  )
}

// function AppDataInitializer() {
//   const { updateProviders } = useProviders()
//   const [, setKnowledgeBases] = useState([])
//   useEffect(() => {
//     // 预加载知识库数据
//     const fetchKnowledgeBases = async () => {
//       try {
//         const response = await knowledgeApi.getKnowledgeBases({})
//         if (response.Code === 0 && response.Data) {
//           const knowledgeData = response.Data.records || []
//           setKnowledgeBases(knowledgeData)
//           console.log('知识库数据已预加载')
//         }
//       } catch (error) {
//         console.error('预加载知识库数据失败:', error)
//       }
//     }
//     // 预加载 Provider 数据
//     const fetchProviders = async () => {
//       try {
//         const response = await providerApi.query({})

//         if (response.Code === 0 && response.Data) {
//           // 转换API数据结构为Provider类型
//           const providerData = response.Data.records.map((item) => ({
//             id: item?.id || uuid(),
//             name: item?.name || '',
//             type: item?.type || '',
//             apiKey: item?.apiKey || '',
//             apiHost: item?.apiHost || '',
//             models: item?.modelList || [],
//             enabled: item?.enabled !== undefined ? Boolean(item.enabled) : true,
//             isSystem: item?.isSystem !== undefined ? Boolean(item.isSystem) : false
//           })) as ProviderType[]

//           // 更新providers数据
//           updateProviders(providerData)
//           console.log('提供商数据已预加载')
//         }
//       } catch (error) {
//         console.error('预加载提供商数据失败:', error)
//       }
//     }

//     // 用户登录后执行所有预加载
//     Promise.all([fetchProviders(), fetchKnowledgeBases()]).catch((error) => console.error('数据预加载失败:', error))
//   }, [])

//   return null // 这是一个纯逻辑组件，不渲染任何UI
// }

// 菜单全局Context定义
type MenuContextType = {
  menuData: any[]
  setMenuData: (data: any[]) => void
}
const MenuContext = createContext<MenuContextType>({
  menuData: [],
  setMenuData: () => {}
})

export const useMenu = () => useContext(MenuContext)

function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [permissionRefreshing, setPermissionRefreshing] = useState(false)
  const { fetchAndProcessUserInfo, loading: userInfoLoading } = useUserInfo()
  const [menuData, setMenuData] = useState<any[]>([])

  // 检查登录状态函数
  const checkAuth = () => {
    // 检查是否需要在更新后重新登录
    const requireReloginAfterUpdate = localStorage.getItem('requireReloginAfterUpdate')
    if (requireReloginAfterUpdate === 'true') {
      // 清除标记
      localStorage.removeItem('requireReloginAfterUpdate')
      // 清除token强制重新登录
      localStorage.removeItem('token')
      // 清除本地用户信息
      localStorage.removeItem('userInfo')
      // 清除本地菜单权限
      localStorage.removeItem('menuPermissions')
      // 清除本地tavily_api_key
      localStorage.removeItem('tavily_api_key')
      // 清除本地isAdmin
      localStorage.removeItem('isAdmin')
      // 清除本地Apikey
      localStorage.removeItem('Apikey')
      // 清除本地persist:cherry-studio
      localStorage.removeItem('persist:cherry-studio')
      // 清除本地所有缓存
      // localStorage.clear()
      // 清除CherryStudio的IndexedDB
      import('./databases').then(({ default: db }) => {
        db.transaction('rw', db.tables, async () => {
          for (const table of db.tables) {
            await table.clear()
          }
        })
          .then(() => {
            console.log('Successfully cleared IndexedDB data')
            setIsAuthenticated(false)
            message.info('软件已更新，请重新登录')
            window.location.href = '/#/login'
          })
          .catch((error) => {
            console.error('Error clearing IndexedDB:', error)
            setIsAuthenticated(false)
            message.info('软件已更新，请重新登录')
            window.location.href = '/#/login'
          })
      })
      return false
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setIsAuthenticated(false)
      window.location.href = '/#/login'
      return false
    }

    try {
      // 解析 JWT token
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = Date.now() >= payload.exp * 1000

      if (isExpired) {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        message.error('登录已过期，请重新登录')
        window.location.href = '/#/login'
        return false
      } else {
        setIsAuthenticated(true)
        return true
      }
    } catch (error) {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      window.location.href = '/#/login'
      return false
    }
  }

  // 检查版本更新并刷新权限
  const checkVersionAndRefreshPermissions = async () => {
    try {
      // 检查是否有版本更新标记
      const lastVersion = localStorage.getItem('lastAppVersion')

      // 动态获取当前版本号
      let currentVersion = '3.0.14' // 默认值
      try {
        const packageJsonResponse = await fetch('/package.json')
        if (packageJsonResponse.ok) {
          const contentType = packageJsonResponse.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const packageJson = await packageJsonResponse.json()
            if (packageJson && typeof packageJson.version === 'string') {
              currentVersion = packageJson.version
            } else {
              console.warn('package.json内容无version字段，使用默认值')
            }
          } else {
            // 可能返回了html等
            const text = await packageJsonResponse.text()
            if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
              console.warn('fetch /package.json 返回HTML，可能未正确部署静态资源，使用默认版本号')
            } else {
              console.warn('fetch /package.json 返回非JSON内容，使用默认版本号')
            }
          }
        } else {
          console.warn('无法从package.json获取版本号，响应码:', packageJsonResponse.status, '使用默认值')
        }
      } catch (error) {
        console.warn('无法从package.json获取版本号，使用默认值:', error)
      }

      if (lastVersion && lastVersion !== currentVersion) {
        console.log('检测到版本更新，刷新用户权限...')

        // 新增：设置升级后需重新登录标记，并立即触发checkAuth
        localStorage.setItem('requireReloginAfterUpdate', 'true')
        checkAuth()
        // 直接return，避免后续权限刷新逻辑在未登录状态下执行
        return

        // 获取当前用户信息
        // const userInfoStr = localStorage.getItem('userInfo')
        // if (userInfoStr) {
        //   ...（原有权限刷新逻辑保留但不再此处执行）
        // }

        // 更新版本记录
        // localStorage.setItem('lastAppVersion', currentVersion)
      }
    } catch (error) {
      console.error('版本检查和权限刷新失败:', error)
    }
  }

  useEffect(() => {
    // 初始检查
    checkAuth()

    // 检查版本更新并刷新权限
    checkVersionAndRefreshPermissions()

    // 定期检查token状态
    const interval = setInterval(checkAuth, 1000) // 每3秒检查一次

    // 监听退出登录事件
    const handleLogout = () => {
      setIsAuthenticated(false)
    }

    window.addEventListener('app-logout', handleLogout)

    // 监听localStorage变化，token被清除或覆盖时立即checkAuth
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth()
      }
    }
    window.addEventListener('storage', handleStorage)

    // 监听主进程主动要求权限刷新
    const handlePermissionRefresh = async () => {
      setPermissionRefreshing(true)
      try {
        const userInfoStr = localStorage.getItem('userInfo')
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null
        if (userInfo && userInfo.uid) {
          console.log('[权限刷新] handlePermissionRefresh: 开始调用fetchAndProcessUserInfo')
          await fetchAndProcessUserInfo(userInfo.uid, { showMessage: true })
          console.log('[权限刷新] handlePermissionRefresh: fetchAndProcessUserInfo已完成')
        } else {
          console.log('[权限刷新] handlePermissionRefresh: 未找到有效userInfo，跳过刷新')
        }
      } catch (e) {
        // 可选：message.error('权限刷新失败')
        console.error('[权限刷新] handlePermissionRefresh: 异常', e)
      }
      setPermissionRefreshing(false)
    }
    window.addEventListener('require-permission-refresh', handlePermissionRefresh)

    return () => {
      clearInterval(interval)
      window.removeEventListener('app-logout', handleLogout)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('require-permission-refresh', handlePermissionRefresh)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // 主界面挂载时拉取菜单
      menuApi
        .query()
        .then((response) => {
          if (response.Data) {
            const transformed = menuApi.transformMenuData(response.Data)
            setMenuData(transformed)
          }
        })
        .catch((err) => {
          // 错误处理将在后续步骤补充
          console.error('菜单拉取失败', err)
        })
    }
  }, [isAuthenticated])

  return (
    <>
      {(permissionRefreshing || userInfoLoading) && (
        <div
          style={{
            position: 'fixed',
            zIndex: 9999,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Spin size="large" tip="正在刷新权限..." />
        </div>
      )}
      {/* <ReduxProvider store={store}>
        {isAuthenticated ? <MainContent /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
      </ReduxProvider> */}
      <ReduxProvider store={store}>
        <StyleSheetManager>
          <ThemeProvider>
            <AntdProvider>
              <SyntaxHighlighterProvider>
                <MenuContext.Provider value={{ menuData, setMenuData }}>
                  {isAuthenticated ? <MainContent /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
                </MenuContext.Provider>
              </SyntaxHighlighterProvider>
            </AntdProvider>
          </ThemeProvider>
        </StyleSheetManager>
      </ReduxProvider>
    </>
  )
}

export default App
