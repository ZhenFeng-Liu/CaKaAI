import tavilyLogo from '@renderer/assets/images/search/tavily.svg'
import tavilyLogoDark from '@renderer/assets/images/search/tavily-dark.svg'
import { HStack } from '@renderer/components/Layout'
import { useTheme } from '@renderer/context/ThemeProvider'
import { useWebSearchProvider } from '@renderer/hooks/useWebSearchProviders'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import { setExcludeDomains, setMaxResult, setSearchWithTime } from '@renderer/store/websearch'
import { formatDomains } from '@renderer/utils/blacklist'
import { Alert, Button, Input, Slider, Switch, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
  SettingContainer,
  SettingDivider,
  SettingGroup,
  SettingHelpLink,
  SettingHelpTextRow,
  SettingRow,
  SettingRowTitle,
  SettingTitle
} from '.'

const WebSearchSettings: FC = () => {
  const { t } = useTranslation()
  const { Paragraph } = Typography
  const { theme } = useTheme()
  const { provider, updateProvider } = useWebSearchProvider('tavily')

  // 从缓存中获取apiKey
  const cachedApiKey = localStorage.getItem('tavily_api_key') || sessionStorage.getItem('tavily_api_key') || ''

  // 优先使用provider.apiKey，如果为空则使用缓存中的apiKey
  const [apiKey, setApiKey] = useState(provider.apiKey || cachedApiKey || '')

  console.log('[WebSearchSettings] 初始apiKey来源:', provider.apiKey ? 'provider' : cachedApiKey ? '缓存' : '空')

  const logo = theme === 'dark' ? tavilyLogoDark : tavilyLogo
  const searchWithTime = useAppSelector((state) => state.websearch.searchWithTime)
  const maxResults = useAppSelector((state) => state.websearch.maxResults)
  const excludeDomains = useAppSelector((state) => state.websearch.excludeDomains)
  const [errFormat, setErrFormat] = useState(false)
  const [blacklistInput, setBlacklistInput] = useState('')

  const dispatch = useAppDispatch()

  // 监听登录状态变化，更新apiKey
  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (isLoggedIn && !apiKey) {
        const newCachedApiKey = localStorage.getItem('tavily_api_key') || sessionStorage.getItem('tavily_api_key') || ''
        if (newCachedApiKey && newCachedApiKey !== apiKey) {
          console.log('[WebSearchSettings] 登录后更新apiKey')
          setApiKey(newCachedApiKey)
        }
      }
    }

    // 初始检查
    checkLoginStatus()

    // 添加事件监听器
    window.addEventListener('storage', checkLoginStatus)

    return () => {
      window.removeEventListener('storage', checkLoginStatus)
    }
  }, [apiKey])

  useEffect(() => {
    console.log('[WebSearchSettings] provider变化:', provider)
    if (provider.apiKey && provider.apiKey !== apiKey) {
      console.log('[WebSearchSettings] 从provider更新apiKey')
      setApiKey(provider.apiKey)
    }
  }, [provider, apiKey])

  useEffect(() => {
    return () => {
      if (apiKey && apiKey !== provider.apiKey) {
        console.log('[WebSearchSettings] 组件卸载时保存apiKey')
        updateProvider({ ...provider, apiKey })
        // 同时保存到localStorage
        localStorage.setItem('tavily_api_key', apiKey)
      }
    }
  }, [apiKey, provider, updateProvider])

  useEffect(() => {
    if (excludeDomains) {
      setBlacklistInput(excludeDomains.join('\n'))
    }
  }, [excludeDomains])

  function updateManualBlacklist(blacklist: string) {
    const blacklistDomains = blacklist.split('\n').filter((url) => url.trim() !== '')
    const { formattedDomains, hasError } = formatDomains(blacklistDomains)
    setErrFormat(hasError)
    if (hasError) return
    dispatch(setExcludeDomains(formattedDomains))
  }

  return (
    <SettingContainer theme={theme}>
      <SettingGroup theme={theme}>
        <HStack alignItems="center" gap={10}>
          <TavilyLogo src={logo} alt="web-search" style={{ width: '60px' }} />
        </HStack>
        <SettingDivider />
        <Paragraph type="secondary" style={{ margin: '10px 0' }}>
          {t('settings.websearch.tavily.description')}
        </Paragraph>
        <Input.Password
          style={{ width: '100%' }}
          placeholder={t('settings.websearch.tavily.api_key.placeholder')}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onBlur={() => updateProvider({ ...provider, apiKey })}
        />
        <SettingHelpTextRow style={{ justifyContent: 'space-between', marginTop: 5 }}>
          <SettingHelpLink target="_blank" href="https://app.tavily.com/home">
            {t('settings.websearch.get_api_key')}
          </SettingHelpLink>
        </SettingHelpTextRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.general.title')}</SettingTitle>
        <SettingDivider />
        <SettingRow>
          <SettingRowTitle>{t('settings.websearch.search_with_time')}</SettingRowTitle>
          <Switch checked={searchWithTime} onChange={(checked) => dispatch(setSearchWithTime(checked))} />
        </SettingRow>
        <SettingDivider style={{ marginTop: 15, marginBottom: 5 }} />
        <SettingRow style={{ marginBottom: -10 }}>
          <SettingRowTitle>{t('settings.websearch.search_max_result')}</SettingRowTitle>
          <Slider
            defaultValue={maxResults}
            style={{ width: '200px' }}
            min={1}
            max={20}
            step={1}
            marks={{ 1: '1', 5: t('settings.websearch.search_result_default'), 20: '20' }}
            onChangeComplete={(value) => dispatch(setMaxResult(value))}
          />
        </SettingRow>
      </SettingGroup>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('settings.websearch.blacklist')}</SettingTitle>
        <SettingDivider />
        <SettingRow style={{ marginBottom: 10 }}>
          <SettingRowTitle>{t('settings.websearch.blacklist_description')}</SettingRowTitle>
        </SettingRow>
        <TextArea
          value={blacklistInput}
          onChange={(e) => setBlacklistInput(e.target.value)}
          placeholder={t('settings.websearch.blacklist_tooltip')}
          autoSize={{ minRows: 4, maxRows: 8 }}
          rows={4}
        />
        <Button onClick={() => updateManualBlacklist(blacklistInput)} style={{ marginTop: 10 }}>
          {t('common.save')}
        </Button>
        {errFormat && <Alert message={t('settings.websearch.blacklist_tooltip')} type="error" />}
      </SettingGroup>
    </SettingContainer>
  )
}

const TavilyLogo = styled.img`
  width: 80px;
`

export default WebSearchSettings
