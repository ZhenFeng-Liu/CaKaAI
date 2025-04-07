import { TopView } from '@renderer/components/TopView'
import { useAgent } from '@renderer/hooks/useAgents'
import { useAssistant } from '@renderer/hooks/useAssistant'
import { Assistant } from '@renderer/types'
import { Modal } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'

import SimpleAssistantEditor from './SimpleAssistantEditor'

interface AssistantSettingPopupShowParams {
  assistant: Assistant
}

interface Props extends AssistantSettingPopupShowParams {
  resolve: (assistant: Assistant) => void
}

const AssistantSettingPopupContainer: React.FC<Props> = ({ resolve, ...props }) => {
  const [open, setOpen] = useState(true)

  const _useAssistant = useAssistant(props.assistant.id)
  const _useAgent = useAgent(props.assistant.id)
  const isAgent = props.assistant.type === 'agent'

  const assistant = isAgent ? _useAgent.agent : _useAssistant.assistant
  const updateAssistant = isAgent ? _useAgent.updateAgent : _useAssistant.updateAssistant

  const onOk = () => {
    setOpen(false)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const afterClose = () => {
    // 简化这里的逻辑，只保留必要的助手信息
    const updatedAssistant: Assistant = {
      ...assistant,
      // 确保只保留需要的字段
      id: assistant.id,
      name: assistant.name,
      url: assistant.url || '',
      type: assistant.type // 保留类型信息
    } as Assistant

    resolve(updatedAssistant)
  }

  return (
    <StyledModal
      open={open}
      onClose={onCancel}
      onCancel={onCancel}
      afterClose={afterClose}
      footer={null}
      title={assistant.name}
      transitionName="ant-move-down"
      styles={{
        content: {
          padding: 0,
          overflow: 'hidden',
          background: 'var(--color-background)',
          border: `1px solid var(--color-frame-border)`
        },
        header: { padding: '10px 15px', borderBottom: '0.5px solid var(--color-border)', margin: 0 }
      }}
      width="450px"
      centered>
      <SimpleAssistantEditor assistant={assistant} updateAssistant={updateAssistant} onOk={onOk} onCancel={onCancel} />
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 14px;
  }
  .ant-modal-close {
    top: 4px;
  }
`

export default class AssistantSettingsPopup {
  static show(props: AssistantSettingPopupShowParams) {
    return new Promise<Assistant>((resolve) => {
      TopView.show(
        <AssistantSettingPopupContainer
          {...props}
          resolve={(v) => {
            resolve(v)
            TopView.hide('AssistantSettingsPopup')
          }}
        />,
        'AssistantSettingsPopup'
      )
    })
  }
}
