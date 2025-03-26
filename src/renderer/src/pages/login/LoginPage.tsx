import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { userApi } from '@renderer/api/user'
import logoImage from '@renderer/assets/images/logo.png'
import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { FC, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
interface LoginForm {
  username: string
  password: string
  rememberMe?: boolean
}

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void
}

const LoginPage: FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const [form] = Form.useForm<LoginForm>()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { checkIsAdmin } = useAdminCheck() // 添加这行
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true)
      const response = await userApi.login({
        name: values.username,
        psw: values.password,
        tokenTime: values.rememberMe ? 7 : 1
      })
      console.log('[LoginPage] 登录响应', response)
      if (response.Code === 0) {
        // 获取token
        localStorage.setItem('token', response.token)
        localStorage.setItem('tavily_api_key', response.Data?.netKey || '')
        try {
          message.loading('正在获取用户信息...', 0.5) // 添加加载提示
          // 获取最新的用户信息
          const userInfoResponse = await userApi.getUserInfo(response.Data.uid)
          if (userInfoResponse.Code === 0) {
            // 判断并打印是否为超级管理员
            // const isAdmin = userInfoResponse.Data?.records[0]?.roleList[0]?.admin === 1
            // console.log('[LoginPage] 当前用户是否为超级管理员:', isAdmin)
            const userInfo = userInfoResponse.Data?.records[0]
            console.log('原始用户信息', userInfo)

            // 使用 hook 检查管理员权限
            checkIsAdmin(userInfo)

            // 提取权限信息
            const menuPermissions =
              userInfo.roleList?.reduce(
                (acc, role) => {
                  const roleMenus =
                    role.menuList?.map((menu) => ({
                      menu: menu,
                      buttons: menu.buttonList || []
                    })) || []
                  return [...acc, ...roleMenus]
                },
                [] as Array<{ menu: any; buttons: any[] }>
              ) || []

            // 使用 Map 去重，以 menu.uid 为 key
            const uniqueMenus = Array.from(new Map(menuPermissions.map((item) => [item.menu.uid, item])).values())
            console.log('处理后的权限信息', uniqueMenus)
            // 存储用户信息和权限
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            localStorage.setItem('menuPermissions', JSON.stringify(uniqueMenus))
            // localStorage.setItem('isAdmin', String(isAdmin))
            // 使用更友好的成功提示
            message.success({
              content: `欢迎回来，${userInfo.name || '用户'}`,
              duration: 2
            })
            // 登录成功后跳转到首页
            window.location.href = '/#/' // 使用 hash 路由跳转到首页
            // 直接更新认证状态，触发路由更新
            setIsAuthenticated(true)
          } else {
            message.error({
              content: '获取用户信息失败，请重试',
              duration: 3
            })
            return
          }
        } catch (error) {
          console.error('获取用户信息失败:', error)
          message.error({
            content: '获取用户信息失败，请检查网络连接',
            duration: 3
          })
          return
        }
      } else {
        // 根据不同的错误码显示不同的错误信息
        console.log('登录失败:', response)
        if (response.Code === 1) {
          message.error({
            content: response.Msg || '账号或密码错误',
            duration: 3
          })
        } else {
          message.error({
            content: response.Msg || '登录失败，请稍后重试',
            duration: 3
          })
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      message.error({
        content: error || '账号或密码错误或者网络异常，请检查网络连接后重试',
        duration: 3
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container $mounted={mounted}>
      <BackgroundDecoration>
        <BackgroundBubble />
        <BackgroundBubble />
        <BackgroundBubble />
        <BackgroundParticle />
        <BackgroundParticle />
        <BackgroundParticle />
      </BackgroundDecoration>
      <BackgroundShimmer />

      <LoginCard>
        <LogoContainer>
          <LogoIcon>
            <img src={logoImage} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </LogoIcon>
          <LogoText>CaKaAI</LogoText>
        </LogoContainer>
        <WelcomeText>欢迎使用 CaKaAI 智能助手</WelcomeText>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <FormItemStyled
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
            validateTrigger={['onChange', 'onBlur']}>
            <StyledInput
              prefix={<UserOutlined style={{ color: 'var(--color-text-2)' }} />}
              placeholder="请输入账号"
              size="large"
            />
          </FormItemStyled>

          <FormItemStyled
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
            validateTrigger={['onChange', 'onBlur']}>
            <StyledPassword
              prefix={<LockOutlined style={{ color: 'var(--color-text-2)' }} />}
              placeholder="请输入密码"
              size="large"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </FormItemStyled>

          <FormItemStyled name="rememberMe" valuePropName="checked">
            <StyledCheckbox>七天免登录</StyledCheckbox>
          </FormItemStyled>

          <FormItemStyled>
            <LoginButton type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </LoginButton>
          </FormItemStyled>
        </Form>
        <PoweredBy>Powered by CaKaAI © {new Date().getFullYear()}</PoweredBy>
      </LoginCard>
    </Container>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const floatingAnimation = keyframes`
  0% { transform: translateY(0) rotate(0); opacity: 0.6; }
  50% { transform: translateY(-25px) rotate(5deg); opacity: 0.8; }
  100% { transform: translateY(0) rotate(0); opacity: 0.6; }
`

const floatingAnimationAlt = keyframes`
  0% { transform: translateY(0) rotate(0) scale(1); opacity: 0.5; }
  33% { transform: translateY(-15px) rotate(3deg) scale(1.05); opacity: 0.7; }
  66% { transform: translateY(10px) rotate(-2deg) scale(0.95); opacity: 0.6; }
  100% { transform: translateY(0) rotate(0) scale(1); opacity: 0.5; }
`

const pulseAnimationSlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`

const shimmerAnimation = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`

const Container = styled.div<{ $mounted: boolean }>`
  // z-index: 9999;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background-color: #f8faff;
  position: relative;
  overflow: hidden;
  -webkit-app-region: drag;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f5ff 100%);
    z-index: -1;
  }
`

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 185, 107, 0.05);
  padding: 45px;
  animation: ${fadeIn} 0.7s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.8);
  -webkit-app-region: no-drag;
  z-index: 2;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    pointer-events: none;
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
  animation: ${floatAnimation} 6s ease-in-out infinite;
`

const LogoIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #00a05c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-right: 14px;
  box-shadow:
    0 6px 16px rgba(0, 185, 107, 0.3),
    0 0 0 1px rgba(0, 185, 107, 0.1) inset;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${pulseAnimation} 3s infinite;
  }
`

const LogoText = styled.div`
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(to right, #222222, #555555);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`

const WelcomeText = styled.div`
  font-size: 17px;
  color: #555555;
  text-align: center;
  margin-bottom: 35px;
  font-weight: 500;
  letter-spacing: 0.2px;
`

const StyledInput = styled(Input)`
  background-color: rgba(249, 250, 251, 0.8);
  border: 1px solid #e8e8e8;
  color: #333333;
  border-radius: 10px;
  height: 52px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 185, 107, 0.5);
    background-color: rgba(249, 250, 251, 1);
    box-shadow: 0 2px 8px rgba(0, 185, 107, 0.08);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 185, 107, 0.15);
    background-color: #ffffff;
  }

  .ant-input {
    background-color: transparent;
    color: #333333;
    font-size: 15px;
  }

  .ant-input-prefix {
    margin-right: 12px;
    color: #888888;
    font-size: 18px;
  }
`

const StyledPassword = styled(Input.Password)`
  background-color: rgba(249, 250, 251, 0.8);
  border: 1px solid #e8e8e8;
  color: #333333;
  border-radius: 10px;
  height: 52px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 185, 107, 0.5);
    background-color: rgba(249, 250, 251, 1);
    box-shadow: 0 2px 8px rgba(0, 185, 107, 0.08);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 185, 107, 0.15);
    background-color: #ffffff;
  }

  .ant-input {
    background-color: transparent;
    color: #333333;
    font-size: 15px;
  }

  .ant-input-prefix {
    margin-right: 12px;
    color: #888888;
    font-size: 18px;
  }

  .ant-input-suffix .anticon {
    color: #888888;
    font-size: 16px;
  }
`

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-inner {
    background-color: #ffffff;
    border-color: #d9d9d9;
    border-radius: 4px;
    width: 18px;
    height: 18px;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .ant-checkbox-wrapper-checked {
    color: #333333;
  }

  span {
    color: #666666;
    font-size: 14px;
  }

  &:hover .ant-checkbox-inner {
    border-color: var(--color-primary);
  }
`

const LoginButton = styled(Button)`
  height: 52px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(to right, var(--color-primary), #00a05c);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 185, 107, 0.25);
  margin-top: 15px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover,
  &:focus {
    background: linear-gradient(to right, #00cc76, #00b96b);
    box-shadow: 0 6px 18px rgba(0, 185, 107, 0.35);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 185, 107, 0.2);
  }
`

const PoweredBy = styled.div`
  text-align: center;
  color: #888888;
  font-size: 13px;
  margin-top: 35px;
  font-weight: 500;
`

const BackgroundDecoration = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(0, 185, 107, 0.08) 0%, transparent 70%);
    top: -300px;
    right: -200px;
    opacity: 0.7;
    animation: ${floatingAnimation} 18s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(0, 185, 107, 0.06) 0%, transparent 70%);
    bottom: -200px;
    left: -150px;
    opacity: 0.6;
    animation: ${floatingAnimation} 24s ease-in-out infinite reverse;
  }
`

const BackgroundBubble = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(0, 185, 107, 0.08) 0%, transparent 70%);
  animation: ${pulseAnimationSlow} 10s ease-in-out infinite;

  &:nth-child(1) {
    width: 250px;
    height: 250px;
    top: 15%;
    left: 10%;
    animation-duration: 15s;
  }

  &:nth-child(2) {
    width: 180px;
    height: 180px;
    bottom: 20%;
    right: 15%;
    background: radial-gradient(circle at 30% 30%, rgba(100, 100, 255, 0.06) 0%, transparent 70%);
    animation-duration: 12s;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    width: 120px;
    height: 120px;
    top: 60%;
    left: 20%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 180, 0, 0.05) 0%, transparent 70%);
    animation-duration: 18s;
    animation-delay: 1s;
  }
`

const BackgroundParticle = styled.div`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(0, 185, 107, 0.15);
  animation: ${floatingAnimationAlt} 20s ease-in-out infinite;

  &:nth-child(4) {
    width: 10px;
    height: 10px;
    top: 25%;
    right: 25%;
    animation-duration: 25s;
  }

  &:nth-child(5) {
    width: 15px;
    height: 15px;
    bottom: 30%;
    left: 30%;
    background-color: rgba(100, 100, 255, 0.1);
    animation-duration: 30s;
    animation-delay: 3s;
  }

  &:nth-child(6) {
    width: 8px;
    height: 8px;
    top: 70%;
    right: 35%;
    background-color: rgba(255, 180, 0, 0.1);
    animation-duration: 22s;
    animation-delay: 5s;
  }
`

const BackgroundShimmer = styled.div`
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(-15deg);
  animation: ${shimmerAnimation} 30s linear infinite;
  pointer-events: none;
  z-index: 1;
`

const FormItemStyled = styled(Form.Item)`
  margin-bottom: 20px;

  .ant-form-item-explain-error {
    font-size: 13px;
    margin-top: 5px;
    color: #ff4d4f;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

export default LoginPage
