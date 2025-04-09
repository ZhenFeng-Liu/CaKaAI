import { useTheme } from '@renderer/context/ThemeProvider'
import { Button } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { SettingContainer, SettingDivider, SettingGroup, SettingRow, SettingTitle } from '../index'

const AboutSettings: FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate() // 添加这行
  const showRoles = () => {
    navigate('/settings/MembersSettings/roles') // 跳转到角色列表页面
  }

  const showMembers = () => {
    navigate('/settings/MembersSettings/members') // 跳转到会员列表页面
  }

  const showAssistant = () => {
    navigate('/settings/MembersSettings/assistant') // 跳转到会员列表页面
  }

  return (
    <SettingContainer theme={theme}>
      <SettingGroup theme={theme}>
        <SettingTitle>{'会员管理'}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('角色列表')}</SettingRowTitle>
          <Button onClick={showRoles}>{t('settings.about.releases.button')}</Button>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('会员列表')}</SettingRowTitle>
          <Button onClick={showMembers}>{t('settings.about.website.button')}</Button>
        </SettingRow>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('助手列表')}</SettingRowTitle>
          <Button onClick={showAssistant}>{t('settings.about.website.button')}</Button>
        </SettingRow>
      </SettingGroup>
    </SettingContainer>
  )
}

export const SettingRowTitle = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: var(--color-text-1);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  .anticon {
    font-size: 16px;
    color: var(--color-text-1);
  }
`

export default AboutSettings
