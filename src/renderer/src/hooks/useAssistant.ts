import { helperApi } from '@renderer/api/helper'
import { db } from '@renderer/databases'
import { getDefaultTopic } from '@renderer/services/AssistantService'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import {
  addAssistant,
  addTopic,
  removeAllTopics,
  removeAssistant,
  removeTopic,
  setModel,
  updateAssistant,
  updateAssistants,
  updateAssistantSettings,
  updateDefaultAssistant,
  updateTopic,
  updateTopics
} from '@renderer/store/assistants'
import { setDefaultModel, setTopicNamingModel, setTranslateModel } from '@renderer/store/llm'
import { Assistant, AssistantSettings, Model, Topic } from '@renderer/types'

import { TopicManager } from './useTopic'

export function useAssistants() {
  const { assistants } = useAppSelector((state) => {
    console.log('[useAssistants] state.assistants:', state.assistants)
    return state.assistants
  })
  const dispatch = useAppDispatch()

  return {
    assistants,
    updateAssistants: (assistants: Assistant[]) => {
      console.log('[useAssistants] updateAssistants:', assistants)
      dispatch(updateAssistants(assistants))
    },
    addAssistant: (assistant: Assistant) => {
      console.log('[useAssistants] addAssistant:', assistant)
      dispatch(addAssistant(assistant))
    },
    removeAssistant: (id: string) => {
      console.log('[useAssistants] removeAssistant:', id)
      const assistant = assistants.find((a) => a.id === id)
      // 先删除相关的 topics
      const topics = assistant?.topics || []
      topics.forEach(({ id }) => TopicManager.removeTopic(id))
      // 然后更新 redux store
      dispatch(removeAssistant({ id }))
      console.log(
        '[useAssistants] after remove:',
        assistants.filter((a) => a.id !== id)
      )
    }
  }
}

export function useAssistant(id: string) {
  const assistant = useAppSelector((state) => state.assistants.assistants.find((a) => a.id === id) as Assistant)
  const dispatch = useAppDispatch()
  const { defaultModel } = useDefaultModel()

  return {
    assistant,
    model: assistant?.model ?? assistant?.defaultModel ?? defaultModel,
    addTopic: (topic: Topic) => dispatch(addTopic({ assistantId: assistant.id, topic })),
    removeTopic: (topic: Topic) => {
      TopicManager.removeTopic(topic.id)
      dispatch(removeTopic({ assistantId: assistant.id, topic }))
    },
    moveTopic: (topic: Topic, toAssistant: Assistant) => {
      dispatch(addTopic({ assistantId: toAssistant.id, topic: { ...topic, assistantId: toAssistant.id } }))
      dispatch(removeTopic({ assistantId: assistant.id, topic }))
      // update topic messages in database
      db.topics
        .where('id')
        .equals(topic.id)
        .modify((dbTopic) => {
          if (dbTopic.messages) {
            dbTopic.messages = dbTopic.messages.map((message) => ({
              ...message,
              assistantId: toAssistant.id
            }))
          }
        })
    },
    updateTopic: (topic: Topic) => dispatch(updateTopic({ assistantId: assistant.id, topic })),
    updateTopics: (topics: Topic[]) => dispatch(updateTopics({ assistantId: assistant.id, topics })),
    removeAllTopics: () => dispatch(removeAllTopics({ assistantId: assistant.id })),
    setModel: (model: Model) => dispatch(setModel({ assistantId: assistant.id, model })),
    updateAssistant: async (assistant: Assistant) => {
      // console.log('[useAssistant] updateAssistant:', assistant)
      // dispatch(updateAssistant(assistant))
      try {
        console.log('[useAssistant] 准备更新助手:', assistant)
        // 构建符合API要求的参数对象
        const _assistantAddInfo = {
          id: assistant.id,
          name: assistant.name || '',
          emoji: assistant.emoji || '',
          prompt: assistant.prompt || '',
          type: 'assistant',
          // 处理知识库ID
          knowledge_uid:
            assistant.knowledge_uid ||
            assistant.knowledge_bases?.[0]?.uid ||
            (Array.isArray(assistant.knowledge_bases) ? null : assistant.knowledge_bases) ||
            null,
          // 处理模型ID
          model_uid:
            assistant.model_uid || assistant.model?.uid || assistant.model || assistant.default_model_uid || null,
          // 处理默认模型ID
          default_model_uid:
            assistant.default_model_uid || assistant.defaultModel?.uid || assistant.defaultModel || null,
          // 确保settings字段完整
          settings: assistant.settings || {
            temperature: 1,
            contextCount: 5,
            enableMaxTokens: false,
            maxTokens: 0,
            streamOutput: true,
            hideMessages: false,
            customParameters: []
          },
          // 保留消息历史
          messages: assistant.messages || [],
          // 可选字段，如果存在则包含
          ...(assistant.topics && { topics: assistant.topics }),
          ...(assistant.uid && { uid: assistant.uid })
        }

        // 打印构建的参数对象
        console.log('[useAssistant] 构建的助手参数:', _assistantAddInfo)

        const response = await helperApi.update(_assistantAddInfo)
        console.log('[useAssistant] 更新助手API响应:', response)

        if (response && response.Code === 0) {
          console.log('[useAssistant] 更新助手成功')
          dispatch(updateAssistant(assistant))

          // 显示成功消息
          window.message.success({
            content: response.Msg || '助手更新成功',
            key: 'update-assistant'
          })

          return { success: true, data: response.Data }
        } else {
          console.error('[useAssistant] 更新助手失败:', response)

          // 显示错误消息
          window.message.error({
            content: response.Msg || '助手更新失败',
            key: 'update-assistant'
          })

          return { success: false, error: response.Msg || '更新失败' }
        }
      } catch (error) {
        console.error('[useAssistant] 更新助手出错:', error)

        // 显示错误消息
        window.message.error({
          content: `助手更新出错: ${error}`,
          key: 'update-assistant'
        })

        return { success: false, error: String(error) }
      }
    },
    updateAssistantSettings: (settings: Partial<AssistantSettings>) => {
      console.log('[useAssistant] updateAssistantSettings:', settings)
      dispatch(updateAssistantSettings({ assistantId: assistant.id, settings }))
    }
  }
}

export function useDefaultAssistant() {
  const defaultAssistant = useAppSelector((state) => state.assistants.defaultAssistant)
  const dispatch = useAppDispatch()

  return {
    defaultAssistant: {
      ...defaultAssistant,
      topics: [getDefaultTopic(defaultAssistant.id)]
    },
    updateDefaultAssistant: (assistant: Assistant) => dispatch(updateDefaultAssistant({ assistant }))
  }
}

export function useDefaultModel() {
  const { defaultModel, topicNamingModel, translateModel } = useAppSelector((state) => state.llm)
  const dispatch = useAppDispatch()

  return {
    defaultModel,
    topicNamingModel,
    translateModel,
    setDefaultModel: (model: Model) => dispatch(setDefaultModel({ model })),
    setTopicNamingModel: (model: Model) => dispatch(setTopicNamingModel({ model })),
    setTranslateModel: (model: Model) => dispatch(setTranslateModel({ model }))
  }
}
