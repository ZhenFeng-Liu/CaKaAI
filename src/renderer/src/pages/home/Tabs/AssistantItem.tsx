import { DeleteOutlined, EditOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { helperApi } from '@renderer/api/helper'
import ModelAvatar from '@renderer/components/Avatar/ModelAvatar'
import CopyIcon from '@renderer/components/Icons/CopyIcon'
import { useAssistant } from '@renderer/hooks/useAssistant'
import { modelGenerating } from '@renderer/hooks/useRuntime'
import { useSettings } from '@renderer/hooks/useSettings'
// import useUserInfo from '@renderer/hooks/useUserInfo'
import AssistantSettingsPopup from '@renderer/pages/settings/AssistantSettings'
import { getDefaultModel, getDefaultTopic } from '@renderer/services/AssistantService'
import { EVENT_NAMES, EventEmitter } from '@renderer/services/EventService'
import { Assistant } from '@renderer/types'
import { uuid } from '@renderer/utils'
import { Dropdown } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { omit } from 'lodash'
import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
interface AssistantItemProps {
  assistant: Assistant
  isActive: boolean
  onSwitch: (assistant: Assistant) => void
  onDelete: (assistant: Assistant) => void
  onCreateDefaultAssistant: () => void
  addAgent: (agent: any) => void
  addAssistant: (assistant: Assistant) => void
  // ... 现有的 props
  refreshUserInfo: () => Promise<void>
  refreshAssistants: () => Promise<void>
}
import { useAdminCheck } from '@renderer/hooks/useAdminCheck'
const AssistantItem: FC<AssistantItemProps> = ({
  assistant,
  isActive,
  onSwitch,
  onDelete,
  addAgent,
  addAssistant,
  // ... 其他 props
  refreshUserInfo,
  refreshAssistants
}) => {
  const { t } = useTranslation()
  const { removeAllTopics } = useAssistant(assistant.id) // 使用当前助手的ID
  const { clickAssistantToShowTopic, topicPosition, showAssistantIcon } = useSettings()
  const defaultModel = getDefaultModel()
  const { isAdmin } = useAdminCheck()
  // const { fetchAndProcessUserInfo } = useUserInfo()
  // const refreshUserInfo = async () => {
  //   // 假设我们已经知道当前用户的uid
  //   const currentUserUid = JSON.parse(localStorage.getItem('userInfo') || '{}').uid

  //   if (currentUserUid) {
  //     await fetchAndProcessUserInfo(currentUserUid, {
  //       showMessage: true,
  //       redirectAfterSuccess: false,
  //       onSuccess: (userInfo) => {
  //         console.log('用户信息已更新', userInfo)
  //       }
  //     })
  //   }
  // }
  const getMenuItems = useCallback(
    (assistant: Assistant): ItemType[] => {
      const baseMenuItems: ItemType[] = [
        // 基础菜单项，所有用户都可以看到
        {
          label: t('assistants.clear.title'),
          key: 'clear',
          icon: <MinusCircleOutlined />,
          onClick: () => {
            window.modal.confirm({
              title: t('assistants.clear.title'),
              content: t('assistants.clear.content'),
              centered: true,
              okButtonProps: { danger: true },
              onOk: () => {
                console.log('[AssistantItem] Clear all topics for assistant:', assistant)
                removeAllTopics()
              } // 使用当前助手的removeAllTopics
            })
          }
        }
      ]
      const adminMenuItems: ItemType[] = [
        {
          label: t('assistants.edit.title'),
          key: 'edit',
          icon: <EditOutlined />,
          onClick: () => {
            console.log('[AssistantItem] Edit assistant:', assistant)
            AssistantSettingsPopup.show({ assistant })
          }
        },
        {
          label: t('assistants.copy.title'),
          key: 'duplicate',
          icon: <CopyIcon />,
          onClick: async () => {
            try {
              const _assistant: Assistant = { ...assistant, id: uuid(), topics: [getDefaultTopic(assistant.id)] }
              console.log('[AssistantItem] 准备复制助手:', _assistant)
              // 构建符合API要求的参数对象
              const _assistantAddInfo = {
                id: _assistant.id,
                name: _assistant.name || '',
                emoji: _assistant.emoji || '',
                prompt: _assistant.prompt || '',
                topics: _assistant.topics, // 保留原始的topics
                type: 'assistant',
                knowledge_uid: _assistant?.knowledge_bases?.[0]?.uid || null,
                model_uid: _assistant.model?.uid || _assistant.default_model_uid || null,
                default_model_uid: _assistant.defaultModel?.uid || null,
                settings: _assistant.settings || {
                  temperature: 1,
                  contextCount: 5,
                  enableMaxTokens: false,
                  maxTokens: 0,
                  streamOutput: true,
                  hideMessages: false,
                  customParameters: []
                },
                messages: _assistant.messages || []
              }
              console.log('[AssistantItem] 复制助手信息:', _assistantAddInfo)
              const response = await helperApi.add(_assistantAddInfo)
              console.log('[AssistantItem] 复制助手API响应:', response)

              if (response && response.Code === 0) {
                console.log('[AssistantItem] 复制助手成功:', _assistant)
                addAssistant(_assistant)
                onSwitch(_assistant)

                window.message.success({
                  content: response.Msg,
                  key: 'duplicate-assistant'
                })

                // 刷新用户信息
                // 延迟执行刷新操作
                setTimeout(async () => {
                  await refreshUserInfo()
                  await refreshAssistants()
                }, 500)
              } else {
                console.error('[AssistantItem] 复制助手失败:', response)
                window.message.error({
                  content: response.Msg,
                  key: 'duplicate-assistant'
                })
              }
            } catch (error) {
              console.error('[AssistantItem] 复制助手出错:', error)
              window.message.error({
                content: t(`复制助手出错:${error}`),
                key: 'duplicate-assistant'
              })
            }
          }
        },
        // {
        //   label: t('assistants.clear.title'),
        //   key: 'clear',
        //   icon: <MinusCircleOutlined />,
        //   onClick: () => {
        //     window.modal.confirm({
        //       title: t('assistants.clear.title'),
        //       content: t('assistants.clear.content'),
        //       centered: true,
        //       okButtonProps: { danger: true },
        //       onOk: () => {
        //         console.log('[AssistantItem] Clear all topics for assistant:', assistant)
        //         removeAllTopics()
        //       } // 使用当前助手的removeAllTopics
        //     })
        //   }
        // },
        {
          label: t('assistants.save.title'),
          key: 'save-to-agent',
          icon: <SaveOutlined />,
          onClick: async () => {
            const agent = omit(assistant, ['model', 'emoji'])
            agent.id = uuid()
            agent.type = 'agent'
            console.log('[AssistantItem] Save assistant to agent:', agent)
            addAgent(agent)
            window.message.success({
              content: t('assistants.save.success'),
              key: 'save-to-agent'
            })

            // 刷新用户信息
            setTimeout(async () => {
              await refreshUserInfo()
              // await refreshAssistants()
            }, 500)
          }
        },
        { type: 'divider' },
        {
          label: t('common.delete'),
          key: 'delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => {
            window.modal.confirm({
              title: t('assistants.delete.title'),
              content: t('assistants.delete.content'),
              centered: true,
              okButtonProps: { danger: true },
              onOk: async () => {
                try {
                  console.log('[AssistantItem] 准备删除助手:', assistant)
                  const response = await helperApi.delete({ uid: Number(assistant.uid) })
                  console.log('[AssistantItem] 删除助手API响应:', response)

                  if (response && response.Code === 0) {
                    console.log('[AssistantItem] 删除助手成功')
                    onDelete(assistant)

                    window.message.success({
                      content: response.Msg || t('assistants.delete.success'),
                      key: 'delete-assistant'
                    })

                    // 刷新用户信息
                    // 延迟执行刷新操作
                    setTimeout(async () => {
                      await refreshUserInfo()
                      // await refreshAssistants()
                    }, 500)
                  } else {
                    console.error('[AssistantItem] 删除助手失败:', response)
                    window.message.error({
                      content: response.Msg || t('assistants.delete.error'),
                      key: 'delete-assistant'
                    })
                  }
                } catch (error) {
                  console.error('[AssistantItem] 删除助手出错:', error)
                  window.message.error({
                    content: t(`assistants.delete.error: ${error}`),
                    key: 'delete-assistant'
                  })
                }
              }
            })
          }
        }
      ]
      // 根据管理员权限返回不同的菜单项
      return isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems
    },
    [addAgent, addAssistant, onSwitch, removeAllTopics, t, onDelete]
  )

  const handleSwitch = useCallback(async () => {
    await modelGenerating()
    console.log('[AssistantItem] Switch to assistant:', assistant)
    if (topicPosition === 'left' && clickAssistantToShowTopic) {
      EventEmitter.emit(EVENT_NAMES.SWITCH_TOPIC_SIDEBAR)
    }

    onSwitch(assistant)
  }, [clickAssistantToShowTopic, onSwitch, assistant, topicPosition])

  const assistantName = assistant.name || t('chat.default.name')
  const fullAssistantName = assistant.emoji ? `${assistant.emoji} ${assistantName}` : assistantName

  return (
    <Dropdown menu={{ items: getMenuItems(assistant) }} trigger={['contextMenu']}>
      <Container onClick={handleSwitch} className={isActive ? 'active' : ''}>
        <AssistantNameRow className="name" title={fullAssistantName}>
          {showAssistantIcon && <ModelAvatar model={assistant.model || defaultModel} size={22} />}
          <AssistantName className="text-nowrap">{showAssistantIcon ? assistantName : fullAssistantName}</AssistantName>
        </AssistantNameRow>
        {isActive && (
          <MenuButton onClick={() => EventEmitter.emit(EVENT_NAMES.SWITCH_TOPIC_SIDEBAR)}>
            <TopicCount className="topics-count">{assistant.topics.length}</TopicCount>
          </MenuButton>
        )}
      </Container>
    </Dropdown>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 7px 10px;
  position: relative;
  margin: 0 10px;
  font-family: Ubuntu;
  border-radius: var(--list-item-border-radius);
  border: 0.5px solid transparent;
  width: calc(var(--assistants-width) - 20px);
  cursor: pointer;
  .iconfont {
    opacity: 0;
    color: var(--color-text-3);
  }
  &:hover {
    background-color: var(--color-background-soft);
  }
  &.active {
    background-color: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
    .name {
    }
  }
`

const AssistantNameRow = styled.div`
  color: var(--color-text);
  font-size: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

const AssistantName = styled.div``

const MenuButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  border-radius: 11px;
  position: absolute;
  background-color: var(--color-background);
  right: 9px;
  top: 6px;
  padding: 0 5px;
  border: 0.5px solid var(--color-border);
`

const TopicCount = styled.div`
  color: var(--color-text);
  font-size: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export default AssistantItem
