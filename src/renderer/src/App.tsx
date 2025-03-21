import '@renderer/databases'

import { providerApi } from '@renderer/api/provider'
import AuthRoute from '@renderer/components/AuthRoute'
import { useProviders } from '@renderer/hooks/useProvider'
import store, { persistor } from '@renderer/store'
import { Provider as ProviderType } from '@renderer/types'
import { uuid } from '@renderer/utils'
import { message } from 'antd'
import { FC, useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import Sidebar from './components/app/Sidebar'
import TopViewContainer from './components/TopView'
import AntdProvider from './context/AntdProvider'
import StyleSheetManager from './context/StyleSheetManager'
import { SyntaxHighlighterProvider } from './context/SyntaxHighlighterProvider'
import { ThemeProvider } from './context/ThemeProvider'
import NavigationHandler from './handler/NavigationHandler'
import AgentsPage from './pages/agents/AgentsPage'
import AppsPage from './pages/apps/AppsPage'
import FilesPage from './pages/files/FilesPage'
import HomePage from './pages/home/HomePage'
import KnowledgePage from './pages/knowledge/KnowledgePage'
import LoginPage from './pages/login/LoginPage'
import PaintingsPage from './pages/paintings/PaintingsPage'
import MemberPage from './pages/settings/MembersSettings/MemberPage'
import RolePage from './pages/settings/MembersSettings/RolePage'
import SettingsPage from './pages/settings/SettingsPage'
import TranslatePage from './pages/translate/TranslatePage'

const MainContent: FC = () => {
  return (
    <>
      <AppDataInitializer />
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
                      <Route
                        path="/paintings"
                        element={
                          <AuthRoute menuName="文生图">
                            <PaintingsPage />
                          </AuthRoute>
                        }
                      />
                      <Route
                        path="/translate"
                        element={
                          <AuthRoute menuName="翻译">
                            <TranslatePage />
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
                      <Route path="/settings/*" element={<SettingsPage />} />
                      <Route path="/settings/MembersSettings/roles" element={<RolePage />} />
                      <Route path="/settings/MembersSettings/members" element={<MemberPage />} />
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

function AppDataInitializer() {
  const { updateProviders } = useProviders()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await providerApi.query({})

        if (response.Code === 0 && response.Data) {
          // 转换API数据结构为Provider类型
          const providerData = response.Data.records.map((item) => ({
            id: item?.id || uuid(),
            name: item?.name || '',
            type: item?.type || '',
            apiKey: item?.apiKey || '',
            apiHost: item?.apiHost || '',
            models: item?.modelList || [],
            enabled: item?.enabled !== undefined ? Boolean(item.enabled) : true,
            isSystem: item?.isSystem !== undefined ? Boolean(item.isSystem) : false
          })) as ProviderType[]

          // 更新providers数据
          updateProviders(providerData)
          console.log('提供商数据已预加载')
        }
      } catch (error) {
        console.error('预加载提供商数据失败:', error)
      }
    }

    // 用户登录后执行
    fetchProviders()
  }, [])

  return null // 这是一个纯逻辑组件，不渲染任何UI
}

function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 检查登录状态函数
  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsAuthenticated(false)
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
        return false
      } else {
        setIsAuthenticated(true)
        return true
      }
    } catch (error) {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      return false
    }
  }

  useEffect(() => {
    // 初始检查
    checkAuth()

    // 定期检查token状态
    const interval = setInterval(checkAuth, 60000) // 每分钟检查一次

    // 监听退出登录事件
    const handleLogout = () => {
      setIsAuthenticated(false)
    }

    window.addEventListener('app-logout', handleLogout)

    return () => {
      clearInterval(interval)
      window.removeEventListener('app-logout', handleLogout)
    }
  }, [])

  return (
    <>
      <ReduxProvider store={store}>
        {isAuthenticated ? <MainContent /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
      </ReduxProvider>
    </>
  )
}

export default App
