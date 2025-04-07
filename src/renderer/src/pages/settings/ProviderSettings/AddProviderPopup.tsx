// 导入API服务
import { providerApi } from '@renderer/api/provider'
import { TopView } from '@renderer/components/TopView'
import { Provider, ProviderType } from '@renderer/types'
import { Divider, Form, Input, message, Modal, Select } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
interface Props {
  provider?: Provider
  resolve: (result: { name: string; type: ProviderType } | null) => void
}

const PopupContainer: React.FC<Props> = ({ provider, resolve }) => {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState(provider?.name || '')
  const [type, setType] = useState(provider?.type || 1)
  const [loading, setLoading] = useState(false)
  const [
    providerTypes
    // setProviderTypes
  ] = useState<{ label: string; value: string }[]>([
    // { label: 'OpenAI', value: 'openai' },
    // { label: 'Gemini', value: 'gemini' },
    // { label: 'Anthropic', value: 'anthropic' },
    // { label: 'Azure OpenAI', value: 'azure-openai' }
  ])
  const { t } = useTranslation()

  // 获取支持的提供商类型列表
  // useEffect(() => {
  //   const fetchProviderTypes = async () => {
  //     try {
  //       const response = await providerApi.getProviderTypes({})

  //       if (response.Code === 0 && response.Data) {
  //         setProviderTypes(
  //           response.Data?.records.map((item: any) => ({
  //             label: item.provider,
  //             value: item.uid
  //           }))
  //         )
  //       }
  //     } catch (error) {
  //       console.error('获取提供商类型失败:', error)
  //     }
  //   }

  //   fetchProviderTypes()
  // }, [])

  const onOk = async () => {
    if (name.trim().length === 0) return
    setLoading(true)
    try {
      const response = await providerApi.add({ name, uid: type })
      console.log('response', response)
      if (response.Code === 0) {
        message.success(`添加成功: ${response.Msg}`)
        resolve({ name, type: response.Data.uid as ProviderType })
        setOpen(false)
      } else {
        // 处理错误响应
        console.error('添加提供商失败:', response.Msg || '未知错误')
        message.error(`添加失败: ${response.Msg}`)
      }
    } catch (error) {
      console.error('操作失败:', error)
      message.error(`添加失败: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    setOpen(false)
    // resolve({ name: '', type: 'openai' })
    resolve(null)
  }

  const onClose = () => {
    // resolve({ name, type })
    // 关闭时不再返回数据，因为已在onOk中处理
  }

  const buttonDisabled = name.length === 0

  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      afterClose={onClose}
      width={360}
      closable={false}
      centered
      confirmLoading={loading}
      title={t('settings.provider.add.title')}
      okButtonProps={{ disabled: buttonDisabled }}>
      <Divider style={{ margin: '8px 0' }} />
      <Form layout="vertical" style={{ gap: 8 }}>
        <Form.Item label={t('settings.provider.add.name')} style={{ marginBottom: 8 }}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            placeholder={t('settings.provider.add.name.placeholder')}
            onKeyDown={(e) => e.key === 'Enter' && onOk()}
            maxLength={32}
          />
        </Form.Item>
        <Form.Item label={t('settings.provider.add.type')} style={{ marginBottom: 0 }}>
          <Select value={type} onChange={setType} options={providerTypes} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default class AddProviderPopup {
  static topviewId = 0
  static hide() {
    TopView.hide('AddProviderPopup')
  }
  static show(provider?: Provider) {
    return new Promise<Provider | null>((resolve) => {
      TopView.show(
        <PopupContainer
          provider={provider}
          resolve={(v: any) => {
            resolve(v)
            this.hide()
          }}
        />,
        'AddProviderPopup'
      )
    })
  }
}
