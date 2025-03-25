import { PlusOutlined } from '@ant-design/icons'
import { helperApi } from '@renderer/api/helper'
import DragableList from '@renderer/components/DragableList'
import Scrollbar from '@renderer/components/Scrollbar'
import { useAgents } from '@renderer/hooks/useAgents'
import { useAssistants } from '@renderer/hooks/useAssistant'
import { Assistant } from '@renderer/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import AssistantItem from './AssistantItem'
interface AssistantsTabProps {
  activeAssistant: Assistant
  setActiveAssistant: (assistant: Assistant) => void
  onCreateAssistant: () => void
  onCreateDefaultAssistant: () => void
}

const Assistants: FC<AssistantsTabProps> = ({
  activeAssistant,
  setActiveAssistant,
  onCreateAssistant,
  onCreateDefaultAssistant
}) => {
  const { assistants, removeAssistant, addAssistant, updateAssistants } = useAssistants()
  const [dragging, setDragging] = useState(false)
  const { addAgent } = useAgents()
  const { t } = useTranslation()
  console.log('[AssistantsTab666] assistants:', assistants)
  const [, setIsLoading] = useState(false)
  // 从API获取助手数据并更新状态
  useEffect(() => {
    const fetchAssistantsData = async () => {
      try {
        // setIsLoading(true)
        // 替换为实际的API端点
        const response = await helperApi.query({})
        console.log(response.Data.records)
        const formattedAssistants = response.Data.records.map((record: any) => {
          return {
            ...record,
            settings: {
              ...(record.settings || {}),
              streamOutput: record.settings?.streamOutput === 1 ? true : false
            }
          }
        })
        console.log('formattedAssistants:', formattedAssistants)
        updateAssistants(formattedAssistants)
      } catch (error) {
        console.error('获取助手数据出错:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssistantsData()
  }, [])

  // 监听助手创建事件
  // const handleCreateAssistant = useCallback(() => {
  //   console.log('[AssistantsTab] onCreateAssistant called')
  //   onCreateAssistant()
  // }, [onCreateAssistant])

  const onDelete = useCallback(
    (assistant: Assistant) => {
      const remaining = assistants.filter((a) => a.id !== assistant.id)
      const newActive = remaining[remaining.length - 1]
      newActive ? setActiveAssistant(newActive) : onCreateDefaultAssistant()
      removeAssistant(assistant.id)
    },
    [assistants, removeAssistant, setActiveAssistant, onCreateDefaultAssistant]
  )
  return (
    <Container className="assistants-tab">
      <DragableList
        list={assistants}
        onUpdate={(updatedAssistants) => {
          console.log('[AssistantsTab] DragableList onUpdate:', updatedAssistants)
          updateAssistants(updatedAssistants)
        }}
        style={{ paddingBottom: dragging ? '34px' : 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}>
        {(assistant) => (
          <AssistantItem
            key={assistant.id}
            assistant={assistant}
            isActive={assistant.id === activeAssistant.id}
            onSwitch={(assistant) => {
              console.log('[AssistantsTab] Switch to assistant:', assistant)
              setActiveAssistant(assistant)
            }}
            onDelete={onDelete}
            addAgent={addAgent}
            addAssistant={(assistant) => {
              console.log('[AssistantsTab] Add assistant:', assistant)
              addAssistant(assistant)
            }}
            onCreateDefaultAssistant={onCreateDefaultAssistant}
          />
        )}
      </DragableList>
      {!dragging && (
        <AssistantAddItem onClick={onCreateAssistant} style={{ display: 'none' }}>
          <AssistantName>
            <PlusOutlined style={{ color: 'var(--color-text-2)', marginRight: 4 }} />
            {t('chat.add.assistant.title')}
          </AssistantName>
        </AssistantAddItem>
      )}
      <div style={{ minHeight: 10 }}></div>
    </Container>
  )
}

// 样式组件（只定义一次）
const Container = styled(Scrollbar)`
  display: flex;
  flex-direction: column;
  padding-top: 11px;
  user-select: none;
`

const AssistantAddItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 7px 12px;
  position: relative;
  margin: 0 10px;
  padding-right: 35px;
  font-family: Ubuntu;
  border-radius: var(--list-item-border-radius);
  border: 0.5px solid transparent;
  cursor: pointer;

  &:hover {
    background-color: var(--color-background-soft);
  }

  &.active {
    background-color: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
  }
`

const AssistantName = styled.div`
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px;
`

export default Assistants
