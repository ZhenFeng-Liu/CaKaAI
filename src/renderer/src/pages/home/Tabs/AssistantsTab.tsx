import { PlusOutlined } from '@ant-design/icons'
import DragableList from '@renderer/components/DragableList'
import Scrollbar from '@renderer/components/Scrollbar'
import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
import { useAgents } from '@renderer/hooks/useAgents'
import { useAssistants } from '@renderer/hooks/useAssistant'
import useUserInfo from '@renderer/hooks/useUserInfo'
import { Assistant } from '@renderer/types'
import { extractUniqueHelpers, getHelpersSummary } from '@renderer/utils/helperUtils'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import AssistantItem from './AssistantItem'
interface AssistantsTabProps {
  activeAssistant: Assistant
  setActiveAssistant: (assistant: Assistant) => void
  onCreateAssistant: () => void
  onCreateDefaultAssistant: () => void
  // ... 现有的 props
  refreshUserInfo: () => Promise<void>
  refreshAssistants: () => Promise<void>
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
  const { fetchAndProcessUserInfo } = useUserInfo()
  console.log('[AssistantsTab666] assistants:', assistants)
  // const [, setIsLoading] = useState(false)
  const refreshUserInfo = async () => {
    // 假设我们已经知道当前用户的uid
    const currentUserUid = JSON.parse(localStorage.getItem('userInfo') || '{}').uid
    console.log('currentUserUid:', currentUserUid)
    if (currentUserUid) {
      await fetchAndProcessUserInfo(currentUserUid, {
        showMessage: false,
        redirectAfterSuccess: false,
        onSuccess: (userInfo) => {
          console.log('用户信息已更新', userInfo)
        }
      })
    }
  }

  const fetchAssistantsData = async () => {
    console.log(localStorage.getItem('userInfo'))
    const userInfoStr = localStorage.getItem('userInfo')
    // 过滤出默认助手
    const defaultAssistants = assistants.filter((assistant) => assistant.id === 'default')
    console.log('defaultAssistants:', defaultAssistants)
    if (userInfoStr) {
      try {
        const userData = JSON.parse(userInfoStr)
        // 提取并去重助手
        const uniqueHelpers = extractUniqueHelpers(userData)
        console.log('去重后的助手列表:', uniqueHelpers)
        // updateAssistants(uniqueHelpers as unknown as Assistant[])
        const mergedAssistants = Array.from(
          new Map(
            [
              // ...assistants.filter((assistant) => !uniqueHelpers.some((helper: any) => helper.uid === assistant.uid)),
              ...(uniqueHelpers as unknown as Assistant[])
            ].map((assistant) => [assistant.uid, assistant])
          ).values()
        )
        console.log('合并后的助手列表:', mergedAssistants)
        if (uniqueHelpers.length > 0) {
          updateAssistants(mergedAssistants)
        } else {
          updateAssistants(defaultAssistants)
        }
        // 获取简要信息
        const helpersSummary = getHelpersSummary(uniqueHelpers)
        console.log('助手简要信息:', helpersSummary)
      } catch (error) {
        console.error('解析用户数据失败:', error)
      }
    }

    // try {
    //   // setIsLoading(true)
    //   // 替换为实际的API端点
    //   const response = await helperApi.query({})
    //   console.log(response.Data.records)
    //   const formattedAssistants = response.Data.records.map((record: any) => {
    //     return {
    //       ...record,
    //       settings: {
    //         ...(record.settings || {}),
    //         streamOutput: record.settings?.streamOutput === 1 ? true : false
    //       }
    //     }
    //   })
    //   console.log('formattedAssistants:', formattedAssistants)
    //   updateAssistants(formattedAssistants)
    // } catch (error) {
    //   console.error('获取助手数据出错:', error)
    // } finally {
    //   setIsLoading(false)
    // }
  }
  // 从API获取助手数据并更新状态
  useEffect(() => {
    const init = async () => {
      await refreshUserInfo()
      await fetchAssistantsData()
    }

    init()
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
  const { isAdmin } = useAdminCheck()
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
            refreshUserInfo={refreshUserInfo} // 传递方法
            refreshAssistants={fetchAssistantsData} // 传递方法
          />
        )}
      </DragableList>
      {isAdmin && !dragging && (
        <AssistantAddItem onClick={onCreateAssistant}>
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
