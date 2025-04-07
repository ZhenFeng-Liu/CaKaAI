/**
 * 助手对象接口定义
 */
interface Helper {
  uid: number
  id: string
  name: string
  type: string
  emoji?: string
  model?: {
    uid: number
    id: string
    name: string
    group: string
    provider: string
    owned_by: string
  }
  defaultModel?: {
    uid: number
    id: string
    name: string
    group: string
    provider: string
    owned_by: string
  }
  messages?: Array<{
    uid: number
    role: string
    content: string
  }>
  settings?: {
    uid: number
    temperature: number
    contextCount: number
    streamOutput: number
    hideMessages: number
    enableMaxTokens: number
    maxTokens: number
    customParameters: any
  }
  topics?: Array<{
    uid: number
    id: string
    name: string
    assistantId: string
    messages: any[]
    createdAt: string
    updatedAt: string
  }>
  prompt?: string
  knowledge_bases?: any
}

/**
 * 从用户数据中提取所有助手并去重
 * @param userData 用户数据对象
 * @returns 去重后的助手列表
 */
export const extractUniqueHelpers = (userData: any): Helper[] => {
  if (!userData || !userData.Roles || !Array.isArray(userData.Roles)) {
    console.warn('无效的用户数据或角色列表')
    return []
  }

  try {
    // 收集所有助手
    const allHelpers: Helper[] = []

    // 遍历所有角色
    userData.Roles.forEach((role) => {
      if (role.Helpers && Array.isArray(role.Helpers)) {
        // 将当前角色的助手列表添加到总列表中
        // 转换助手数据并添加到列表中
        const convertedHelpers = role.Helpers.map((helper: any) => ({
          ...helper,
          topics: helper.Topics || [],
          id: helper.uid.toString(),
          type: 'assistant',
          settings: {}
        }))
        console.log('转换后的助手列表:', convertedHelpers)
        allHelpers.push(...convertedHelpers)
      }
    })

    // 使用Map基于id去重
    const uniqueHelpersMap = new Map<string, Helper>()

    allHelpers.forEach((helper: any) => {
      if (helper && helper.uid) {
        uniqueHelpersMap.set(helper.uid, helper)
      }
    })

    // 转换回数组
    const uniqueHelpers = Array.from(uniqueHelpersMap.values())

    console.log(`从${allHelpers.length}个助手中提取出${uniqueHelpers.length}个唯一助手`)
    return uniqueHelpers
  } catch (error) {
    console.error('提取助手时出错:', error)
    return []
  }
}

/**
 * 获取助手的简要信息列表（仅包含基本信息）
 * @param helpers 助手列表
 * @returns 简化后的助手信息列表
 */
export const getHelpersSummary = (helpers: Helper[]): Array<{ id: string; name: string; uid: number }> => {
  return helpers.map((helper) => ({
    id: helper.id,
    name: helper.name,
    uid: helper.uid
  }))
}
