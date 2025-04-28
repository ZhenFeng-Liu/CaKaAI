import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { userApi } from '@renderer/api/user'
import loginBgImageB from '@renderer/assets/images/big-logo-bg.png' // 假设暗色主题背景图片，实际项目中应该使用不同的图片文件
// import logoImage from '@renderer/assets/images/0416-logo.png'
import loginBgImageA from '@renderer/assets/images/login-bg.png'
import { useTheme } from '@renderer/context/ThemeProvider'
// import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
import useUserInfo from '@renderer/hooks/useUserInfo'
import { ThemeMode } from '@renderer/types'
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
  // const { checkIsAdmin } = useAdminCheck() // 添加这行
  const { fetchAndProcessUserInfo } = useUserInfo()
  const { theme } = useTheme() // 获取当前主题

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
        localStorage.setItem('token', response.token || response.Data.token)
        localStorage.setItem('tavily_api_key', response.Data?.netKey || '')
        localStorage.setItem('Apikey', response?.Apikey || '')

        // 替换原来的用户信息获取逻辑
        try {
          // 使用新的Hook获取用户信息
          await fetchAndProcessUserInfo(response.Data.uid, {
            showMessage: true,
            redirectAfterSuccess: false, // 修改为false，由我们自己控制重定向
            setIsAuthenticated
          })

          // 设置认证状态
          setIsAuthenticated(true)

          // 使用更可靠的重定向方法
          console.log('执行重定向到首页')

          // 先清除可能的历史状态
          window.history.replaceState(null, '', window.location.origin)

          // 使用延迟确保状态已更新
          setTimeout(() => {
            // 使用 window.location.replace 替换当前历史记录
            window.location.replace(window.location.origin + '/#/')
          }, 100)
        } catch (error) {
          console.error('登录过程中出错:', error)
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
    <Container $mounted={mounted} $theme={theme}>
      {/* <BackgroundDecoration>
        <BackgroundBubble />
        <BackgroundBubble />
        <BackgroundBubble />
        <BackgroundParticle />
        <BackgroundParticle />
        <BackgroundParticle />
      </BackgroundDecoration> */}
      <BackgroundShimmer $theme={theme} />

      <LoginCard $theme={theme}>
        <LogoContainer>
          {/* <LogoIcon>
            <img src={logoImage} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </LogoIcon> */}
          {/* <LogoText>卡卡</LogoText> */}
        </LogoContainer>
        <WelcomeText $theme={theme}>和Caka一起开始你的工作</WelcomeText>
        <SubtitleText $theme={theme}>Caka是精通各项技能的领域专家，是你和AI协同办公的最佳帮手</SubtitleText>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <FormItemStyled
            name="username"
            label="账号"
            rules={[{ required: true, message: '请输入账号' }]}
            validateTrigger={['onChange', 'onBlur']}
            $theme={theme}>
            <StyledInput
              prefix={<UserOutlined style={{ color: theme === ThemeMode.dark ? '#a0a0a0' : '#bfbfbf' }} />}
              placeholder="请输入账号"
              size="large"
              $theme={theme}
            />
          </FormItemStyled>

          <FormItemStyled
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
            validateTrigger={['onChange', 'onBlur']}
            $theme={theme}>
            <StyledPassword
              prefix={<LockOutlined style={{ color: theme === ThemeMode.dark ? '#a0a0a0' : '#bfbfbf' }} />}
              placeholder="请输入密码"
              size="large"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              $theme={theme}
            />
          </FormItemStyled>

          <FormItemStyled name="rememberMe" valuePropName="checked" $theme={theme}>
            <StyledCheckbox $theme={theme}>7天免登录</StyledCheckbox>
          </FormItemStyled>

          <FormItemStyled $theme={theme}>
            <LoginButton type="primary" htmlType="submit" loading={loading} block size="large" $theme={theme}>
              登 录
            </LoginButton>
          </FormItemStyled>
        </Form>
        <Divider $theme={theme} />
        <PoweredBy $theme={theme}>Powered by CakaAI @ {new Date().getFullYear()}</PoweredBy>
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

const shimmerAnimation = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`

const Container = styled.div<{ $mounted: boolean; $theme?: ThemeMode }>`
  // z-index: 9999;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background-color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#121212' : '#f8faff')};
  position: relative;
  overflow: hidden;
  -webkit-app-region: drag;

  /* 根据主题选择不同的背景图片 */
  background-image: url(${({ $theme }) => ($theme === ThemeMode.dark ? loginBgImageB : loginBgImageA)});
  background-size: ${({ $theme }) => ($theme === ThemeMode.dark ? '38%' : 'cover')};
  background-position: ${({ $theme }) => ($theme === ThemeMode.dark ? '15%' : 'center')};
  background-repeat: no-repeat;

  /* 调整登录卡片位置 */
  padding-left: calc(50% + 50px); /* 向右偏移100px */
  align-items: flex-start;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $theme }) =>
      $theme === ThemeMode.dark
        ? 'radial-gradient(circle at 30% 30%, #2c2c2c 0%, #121212 100%)'
        : 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f5ff 100%)'};
    z-index: -1;
    opacity: ${({ $theme }) => ($theme === ThemeMode.dark ? 0.7 : 0.5)};
  }

  /* 响应式调整 */
  @media (max-width: 1024px) {
    padding-left: calc(50% + 50px); /* 中等屏幕偏移减小 */
  }

  @media (max-width: 768px) {
    padding-left: 20px; /* 小屏幕恢复居中 */
    align-items: center;
  }
`

const LoginCard = styled.div<{ $theme?: ThemeMode }>`
  width: 100%;
  max-width: 380px;
  background-color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#222222' : '#ffffff')};
  border-radius: 24px;
  box-shadow: ${({ $theme }) =>
    $theme === ThemeMode.dark ? '8px 8px 20px rgba(0, 0, 0, 0.35)' : '8px 8px 20px rgba(0, 0, 0, 0.12)'};
  padding: 25px;
  animation: ${fadeIn} 0.5s ease-out;
  -webkit-app-region: no-drag;
  z-index: 2;
  position: relative;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

// const LogoIcon = styled.div`
//   width: 100px;
//   height: 45px;
//   border-radius: 50%;
//   background: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-right: 8px;
//   overflow: hidden;
// `

// const LogoText = styled.div`
//   font-size: 20px;
//   font-weight: 600;
//   color: #4a89dc;
// `

const WelcomeText = styled.div<{ $theme?: ThemeMode }>`
  font-size: 18px;
  color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#ffffff' : '#333333')};
  margin-bottom: 8px;
  font-weight: 700;
`

const SubtitleText = styled.div<{ $theme?: ThemeMode }>`
  font-size: 14px;
  color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#a0a0a0' : '#bfbfbf')};
  margin-bottom: 25px;
`

const StyledInput = styled(Input)<{ $theme?: ThemeMode }>`
  background-color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#333333' : '#ffffff')};
  border: 1px solid ${({ $theme }) => ($theme === ThemeMode.dark ? '#444444' : '#e8e8e8')};
  color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#e0e0e0' : '#333333')};
  border-radius: 8px;
  height: 44px;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    border-color: #1890ff;
    box-shadow: none;
  }

  .ant-input {
    background-color: transparent;
    color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#e0e0e0' : '#333333')};
    font-size: 14px;
  }

  .ant-input-prefix {
    margin-right: 10px;
    font-size: 16px;
  }
`

const StyledPassword = styled(Input.Password)<{ $theme?: ThemeMode }>`
  background-color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#333333' : '#ffffff')};
  border: 1px solid ${({ $theme }) => ($theme === ThemeMode.dark ? '#444444' : '#e8e8e8')};
  color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#e0e0e0' : '#333333')};
  border-radius: 8px;
  height: 44px;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    border-color: #1890ff;
    box-shadow: none;
  }

  .ant-input {
    background-color: transparent;
    color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#e0e0e0' : '#333333')};
    font-size: 14px;
  }

  .ant-input-prefix {
    margin-right: 10px;
    font-size: 16px;
  }

  .ant-input-suffix .anticon {
    color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#a0a0a0' : '#bfbfbf')};
    font-size: 14px;
  }
`

const StyledCheckbox = styled(Checkbox)<{ $theme?: ThemeMode }>`
  .ant-checkbox-inner {
    border-color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#555555' : '#d9d9d9')};
    background-color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#333333' : '#ffffff')};
    border-radius: 3px;
    width: 16px;
    height: 16px;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }

  span {
    color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#a0a0a0' : '#8c8c8c')};
    font-size: 14px;
  }
`

const FormItemStyled = styled(Form.Item)<{ $theme?: ThemeMode }>`
  margin-bottom: 20px;

  .ant-form-item-label > label {
    font-size: 15px;
    font-weight: 500;
    color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#b0b0b0' : '#999999')};
  }
  .ant-form-item-explain-error {
    font-size: 13px;
    margin-top: 5px;
    color: #ff4d4f;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const LoginButton = styled(Button)<{ $theme?: ThemeMode }>`
  height: 44px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700 !important;
  margin-top: 15px;
  letter-spacing: 4px;
  transition: all 0.3s ease;

  /* 根据主题应用不同的按钮样式 */
  background: ${({ $theme }) =>
    $theme === ThemeMode.dark ? '#ffffff' : 'linear-gradient(to right, #29bbff, #9e46ff)'};
  color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#000000' : '#ffffff')};
  border: none;
  box-shadow: ${({ $theme }) =>
    $theme === ThemeMode.dark ? '0 4px 10px rgba(255, 255, 255, 0.15)' : '0 4px 10px rgba(0, 0, 0, 0.1)'};

  /* 确保内部文本也应用正确的粗体和颜色 */
  span {
    font-weight: 700 !important;
    color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#000000' : '#ffffff')};
  }

  /* 增加字体大小以增强可读性 */
  font-size: 16px;

  &:hover,
  &:focus {
    background: ${({ $theme }) =>
      $theme === ThemeMode.dark
        ? '#f5f5f5' /* 白色按钮悬停时稍微灰一点 */
        : 'linear-gradient(to right, #20aeff, #8e36ff)'};
    box-shadow: ${({ $theme }) =>
      $theme === ThemeMode.dark ? '0 6px 15px rgba(255, 255, 255, 0.2)' : '0 6px 15px rgba(78, 99, 255, 0.25)'};
  }

  &:active {
    background: ${({ $theme }) =>
      $theme === ThemeMode.dark
        ? '#e0e0e0' /* 白色按钮点击时更灰一点 */
        : 'linear-gradient(to right, #1a9deb, #7e26f9)'};
    box-shadow: ${({ $theme }) =>
      $theme === ThemeMode.dark ? '0 4px 8px rgba(255, 255, 255, 0.15)' : '0 4px 8px rgba(78, 99, 255, 0.2)'};
  }
`

const Divider = styled.div<{ $theme?: ThemeMode }>`
  height: 1px;
  background: linear-gradient(
    to right,
    ${({ $theme }) =>
      $theme === ThemeMode.dark
        ? 'rgba(100, 100, 100, 0), rgba(100, 100, 100, 0.7) 30%, rgba(100, 100, 100, 0.8) 50%, rgba(100, 100, 100, 0.7) 90%, rgba(100, 100, 100, 0)'
        : 'rgba(224, 224, 224, 0), rgba(224, 224, 224, 0.7) 30%, rgba(224, 224, 224, 0.8) 50%, rgba(224, 224, 224, 0.7) 90%, rgba(224, 224, 224, 0)'}
  );
  margin: 35px auto 20px;
  width: 70%;
`

const PoweredBy = styled.div<{ $theme?: ThemeMode }>`
  text-align: center;
  color: ${({ $theme }) => ($theme === ThemeMode.dark ? '#888888' : '#bfbfbf')};
  font-size: 12px;
  margin-top: 0; /* 调整为0，因为Divider已经提供了间距 */
`

const BackgroundShimmer = styled.div<{ $theme?: ThemeMode }>`
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    to right,
    ${({ $theme }) =>
      $theme === ThemeMode.dark
        ? 'rgba(50, 50, 50, 0) 0%, rgba(50, 50, 50, 0.05) 50%, rgba(50, 50, 50, 0) 100%'
        : 'rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%'}
  );
  transform: rotate(-15deg);
  animation: ${shimmerAnimation} 30s linear infinite;
  pointer-events: none;
  z-index: 1;
`

export default LoginPage
