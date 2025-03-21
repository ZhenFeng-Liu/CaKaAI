import { memberApi } from '@renderer/api/member' // 添加这一行
import { userApi } from '@renderer/api/user' // 添加这一行
import DefaultAvatar from '@renderer/assets/images/avatar.png'
import useAvatar from '@renderer/hooks/useAvatar'
import { useSettings } from '@renderer/hooks/useSettings'
import ImageStorage from '@renderer/services/ImageStorage'
import { useAppDispatch } from '@renderer/store'
import { setAvatar } from '@renderer/store/runtime'
import { setUserName } from '@renderer/store/settings'
import { compressImage, isEmoji } from '@renderer/utils'
import { Avatar, Button, Dropdown, Form, Input, message, Modal, Popover, Upload } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import EmojiPicker from '../EmojiPicker'
import { Center, HStack, VStack } from '../Layout'
import { TopView } from '../TopView'

interface Props {
  resolve: (data: any) => void
}

const PopupContainer: React.FC<Props> = ({ resolve }) => {
  const [open, setOpen] = useState(true)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { t } = useTranslation()
  const { userName } = useSettings()
  const dispatch = useAppDispatch()
  const avatar = useAvatar()

  // 从缓存获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const cachedUserName = userInfo.name // 从缓存中获取用户名
  const cachedOldPassword = userInfo.psw // 从缓存中获取用户密码
  const onOk = () => {
    setOpen(false)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const onClose = () => {
    resolve({})
  }

  const handleEmojiClick = async (emoji: string) => {
    try {
      // set emoji string
      await ImageStorage.set('avatar', emoji)
      // update avatar display
      dispatch(setAvatar(emoji))
      setEmojiPickerOpen(false)
    } catch (error: any) {
      window.message.error(error.message)
    }
  }
  const handleReset = async () => {
    try {
      await ImageStorage.set('avatar', DefaultAvatar)
      dispatch(setAvatar(DefaultAvatar))
      setDropdownOpen(false)
    } catch (error: any) {
      window.message.error(error.message)
    }
  }
  const items = [
    {
      key: 'upload',
      label: (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Upload
            customRequest={() => {}}
            accept="image/png, image/jpeg, image/gif"
            itemRender={() => null}
            maxCount={1}
            onChange={async ({ file }) => {
              try {
                const _file = file.originFileObj as File
                if (_file.type === 'image/gif') {
                  await ImageStorage.set('avatar', _file)
                } else {
                  const compressedFile = await compressImage(_file)
                  await ImageStorage.set('avatar', compressedFile)
                }
                dispatch(setAvatar(await ImageStorage.get('avatar')))
                setDropdownOpen(false)
              } catch (error: any) {
                window.message.error(error.message)
              }
            }}>
            {t('settings.general.image_upload')}
          </Upload>
        </div>
      )
    },
    {
      key: 'emoji',
      label: (
        <div
          style={{ width: '100%', textAlign: 'center' }}
          onClick={(e) => {
            e.stopPropagation()
            setEmojiPickerOpen(true)
            setDropdownOpen(false)
          }}>
          {t('settings.general.emoji_picker')}
        </div>
      )
    },
    {
      key: 'reset',
      label: (
        <div
          style={{ width: '100%', textAlign: 'center' }}
          onClick={(e) => {
            e.stopPropagation()
            handleReset()
          }}>
          {t('settings.general.avatar.reset')}
        </div>
      )
    }
  ]

  // 处理修改密码
  const handleChangePassword = async () => {
    try {
      // 先确认是否要修改密码
      Modal.confirm({
        title: '确认修改密码',
        content: '确定要修改密码吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            // 调用修改密码 API
            await memberApi.update({
              uid: userInfo.uid,
              psw: form.getFieldValue('newPassword')
            })

            // 关闭并重置修改密码弹窗
            setPasswordModalVisible(false)
            form.resetFields()

            // 关闭头像弹窗
            setOpen(false)

            let secondsLeft = 10
            // 修改密码成功后的倒计时提示
            const modal = Modal.success({
              title: '密码修改成功',
              content: `系统将在${secondsLeft}秒后自动退出登录`,
              okText: '立即退出',
              onOk: () => {
                clearInterval(timer)
                modal.destroy()
                handleLogout()
              }
            })

            // 倒计时处理
            const timer = setInterval(() => {
              secondsLeft -= 1
              modal.update({
                content: `系统将在${secondsLeft}秒后自动退出登录`
              })

              if (secondsLeft <= 0) {
                clearInterval(timer)
                modal.destroy()
                handleLogout()
              }
            }, 1000)
          } catch (error) {
            message.error('密码修改失败')
          }
        }
      })
    } catch (error) {
      message.error('密码修改失败')
    }
  }

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // 调用退出登录接口
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      await userApi.logout({ uid: userInfo.uid })
      // 清除本地token
      localStorage.removeItem('token')
      // 清除本地用户信息
      localStorage.removeItem('userInfo')
      // 清除本地菜单权限
      localStorage.removeItem('menuPermissions')
      // 显示成功消息
      message.success('退出登录成功')

      // 触发自定义事件通知App组件更新认证状态
      const logoutEvent = new Event('app-logout')
      window.dispatchEvent(logoutEvent)

      // 关闭当前弹窗
      setOpen(false)
      // 使用路由导航到登录页
      window.location.href = '/#/login' // 使用 hash 路由

      // 重新加载页面以确保状态完全清除
      // window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
      message.error('退出登录失败，请重试')
    }
  }
  return (
    <>
      <Modal
        width="300px"
        open={open}
        footer={null}
        onOk={onOk}
        onCancel={onCancel}
        afterClose={onClose}
        transitionName="ant-move-down"
        centered>
        <Center mt="30px">
          <VStack alignItems="center" gap="10px">
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              open={dropdownOpen}
              align={{ offset: [0, 4] }}
              placement="bottom"
              onOpenChange={(visible) => {
                setDropdownOpen(visible)
                if (visible) {
                  setEmojiPickerOpen(false)
                }
              }}>
              <Popover
                content={<EmojiPicker onEmojiClick={handleEmojiClick} />}
                trigger="click"
                open={emojiPickerOpen}
                onOpenChange={(visible) => {
                  setEmojiPickerOpen(visible)
                  if (visible) {
                    setDropdownOpen(false)
                  }
                }}
                placement="bottom">
                {isEmoji(avatar) ? <EmojiAvatar>{avatar}</EmojiAvatar> : <UserAvatar src={avatar} />}
              </Popover>
            </Dropdown>
          </VStack>
        </Center>
        <HStack alignItems="center" gap="10px" p="20px">
          <Input
            placeholder={t('settings.general.user_name.placeholder')}
            value={cachedUserName || userName} // 优先使用缓存中的用户名
            onChange={(e) => dispatch(setUserName(e.target.value.trim()))}
            style={{ flex: 1, textAlign: 'center', width: '100%' }}
            maxLength={30}
            disabled={true} // 始终禁用输入框
          />
        </HStack>
        <HStack justifyContent="center" p="0 20px 20px">
          <Button type="primary" style={{ width: '100%' }} onClick={() => setPasswordModalVisible(true)}>
            修改密码
          </Button>
        </HStack>
        <HStack justifyContent="center" p="0 20px 20px">
          <Button type="primary" style={{ width: '100%' }} danger onClick={handleLogout}>
            退出登录
          </Button>
        </HStack>
      </Modal>
      {/* 修改密码弹窗 */}
      <Modal
        width="300px"
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false)
          form.resetFields() // 关闭弹窗时重置表单
        }}
        footer={null}
        centered>
        <Form form={form} onFinish={handleChangePassword}>
          <Form.Item
            name="oldPassword"
            rules={[
              { required: true, message: '请输入旧密码' },
              { min: 6, message: '密码长度不能少于6位' },
              {
                validator: (_, value) => {
                  if (value === cachedOldPassword) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('旧密码输入错误，请重新输入'))
                }
              }
            ]}>
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6位' },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: '密码只能包含大小写英文和数字'
              }
            ]}>
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}>
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  width: 80px;
  height: 80px;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`

const EmojiAvatar = styled.div`
  cursor: pointer;
  width: 80px;
  height: 80px;
  border-radius: 20%;
  background-color: var(--color-background-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  transition: opacity 0.3s ease;
  border: 0.5px solid var(--color-border);
  &:hover {
    opacity: 0.8;
  }
`

export default class UserPopup {
  static topviewId = 0
  static hide() {
    TopView.hide('UserPopup')
  }
  static show() {
    return new Promise<any>((resolve) => {
      TopView.show(
        <PopupContainer
          resolve={(v) => {
            resolve(v)
            this.hide()
          }}
        />,
        'UserPopup'
      )
    })
  }
}
