import { isMac } from '@renderer/config/constant'
import { useSettings } from '@renderer/hooks/useSettings'
// import { Tooltip } from 'antd'
import { FC, PropsWithChildren } from 'react'
// import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
type Props = PropsWithChildren & JSX.IntrinsicElements['div']

export const Navbar: FC<Props> = ({ children, ...props }) => {
  const { windowStyle } = useSettings()

  const macTransparentWindow = isMac && windowStyle === 'transparent'
  const backgroundColor = macTransparentWindow ? 'transparent' : 'var(--navbar-background)'

  return (
    <NavbarContainer {...props} style={{ backgroundColor }}>
      {children}
    </NavbarContainer>
  )
}

export const NavbarLeft: FC<Props> = ({ children, ...props }) => {
  // const { t } = useTranslation()
  // return <NavbarLeftContainer {...props}>{children}</NavbarLeftContainer>
  return (
    <NavbarLeftContainer {...props}>
      {React.Children.map(children, (child, index) => {
        if (index === 1) {
          // return (
          //   <Tooltip title={t('新建话题')} placement="left">
          //     {child}
          //   </Tooltip>
          // )
          return null
        }
        return child
      })}
    </NavbarLeftContainer>
  )
}

export const NavbarCenter: FC<Props> = ({ children, ...props }) => {
  return <NavbarCenterContainer {...props}>{children}</NavbarCenterContainer>
}
// import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
import React from 'react' // 添加这行
export const NavbarRight: FC<Props> = ({ children, ...props }) => {
  console.log('props', props)
  console.log('children', children)
  // return <NavbarRightContainer {...props}>{children}</NavbarRightContainer>
  // const { isAdmin } = useAdminCheck()

  return (
    <NavbarRightContainer {...props}>
      {React.Children.map(children, (child: any, index) => {
        console.log('child', child)
        // 如果不是管理员且是第一个子元素，则不显示
        if (index === 0) return child?.props?.children[0]

        // 如果不是管理员且是第二个子元素，则不显示
        // if (!isAdmin && index === 1) return child?.props?.children[1]
        // 如果不是管理员且是第二个子元素，则排除第四个元素，显示其他元素
        if (index === 1) {
          // 确保child和child.props.children存在
          if (child?.props?.children) {
            // 将children转换为数组，并过滤掉第四个元素(索引为3)
            const filteredChildren = React.Children.toArray(child.props.children).filter(
              (_, childIndex) => childIndex !== 1 && childIndex !== 2 && childIndex !== 3
            )

            // 创建一个新的React元素，包含过滤后的子元素
            return React.cloneElement(child, child.props, filteredChildren)
          }
          return null
        }
        return child
      })}
    </NavbarRightContainer>
  )
}

const NavbarContainer = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: row;
  min-height: var(--navbar-height);
  max-height: var(--navbar-height);
  margin-left: ${isMac ? 'calc(var(--sidebar-width) * -1)' : 0};
  padding-left: ${isMac ? 'var(--sidebar-width)' : 0};
  -webkit-app-region: drag;
`

const NavbarLeftContainer = styled.div`
  min-width: var(--assistants-width);
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  color: var(--color-text-1);
`

const NavbarCenterContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 ${isMac ? '20px' : 0};
  font-weight: bold;
  color: var(--color-text-1);
`

const NavbarRightContainer = styled.div`
  min-width: var(--topic-list-width);
  display: flex;
  align-items: center;
  padding: 0 12px;
`
