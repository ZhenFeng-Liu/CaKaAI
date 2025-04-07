import { Box, HStack } from '@renderer/components/Layout'
import { Assistant } from '@renderer/types'
import { Button, Input } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => void
  onOk: () => void
  onCancel: () => void
}

const SimpleAssistantEditor: React.FC<Props> = ({ assistant, updateAssistant, onOk, onCancel }) => {
  const [name, setName] = useState(assistant.name)
  const [url, setUrl] = useState(assistant.url || '')
  const { t } = useTranslation()

  const onUpdate = () => {
    const _assistant = { ...assistant, name: name.trim(), url }
    updateAssistant(_assistant)
  }

  return (
    <Container>
      <Box mb={8} style={{ fontWeight: 'bold' }}>
        {t('common.name')}
      </Box>
      <Input
        placeholder={t('common.assistant') + t('common.name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={onUpdate}
        style={{ marginBottom: 16 }}
      />

      <Box mb={8} style={{ fontWeight: 'bold' }}>
        URL
      </Box>
      <Input
        placeholder="助手URL地址"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={onUpdate}
        style={{ marginBottom: 16 }}
      />

      <HStack width="100%" justifyContent="flex-end" mt="16px" gap={8}>
        <Button onClick={onCancel}>{t('取消')}</Button>
        <Button type="primary" onClick={onOk}>
          {t('确定')}
        </Button>
      </HStack>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
`

export default SimpleAssistantEditor
