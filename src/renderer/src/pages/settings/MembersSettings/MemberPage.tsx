import { ExclamationCircleOutlined } from '@ant-design/icons'
import { memberApi, MemberData } from '@renderer/api/member'
import { roleApi } from '@renderer/api/role'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { Button, Checkbox, Form, Input, Modal, Radio, Select, Space, Table } from 'antd'
import { message } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface MemberType {
  key: string
  memberName: string
  accountNo: string
  roleName: string
  status: string
  accountStatus: string
  uid: number
  psw: string
}

interface RoleType {
  value: string
  label: string
}

interface Permission {
  label: string
  value: string
}

interface PermissionModule {
  module: string
  permissions: Permission[]
}

const convertMemberData = (data: MemberData): MemberType => ({
  key: String(data.uid),
  memberName: data.name,
  accountNo: data.name,
  roleName: data.roleList?.map((role: any) => role.name).join('，') || '',
  status: data.exited === 0 ? '在职' : '离职',
  accountStatus: data.enable === 1 ? '启用' : '禁用',
  uid: data.uid,
  psw: data.psw
})

const MemberPage: FC = () => {
  const { t } = useTranslation()
  // const [selectedRole, setSelectedRole] = useState<string>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [authModalVisible, setAuthModalVisible] = useState(false)
  const [authForm] = Form.useForm()
  const [searchName, setSearchName] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined)
  const [currentMember, setCurrentMember] = useState<MemberType | null>(null)
  const [form] = Form.useForm()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editForm] = Form.useForm()
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false)
  const [resetPasswordForm] = Form.useForm()
  // const [disableModalVisible, setDisableModalVisible] = useState(false)
  const [assignRoleVisible, setAssignRoleVisible] = useState(false)
  const [assignRoleForm] = Form.useForm()
  const [roles, setRoles] = useState<RoleType[]>([
    // 示例数据，实际应从API获取
    { value: 'admin', label: '超级管理员' },
    { value: 'business', label: '业务员' }
  ])
  const [addMemberVisible, setAddMemberVisible] = useState(false)
  const [addMemberForm] = Form.useForm()
  const [roleList, setRoleList] = useState<MemberType[]>([])
  const [loading, setLoading] = useState(false)
  const [permissionData] = useState<PermissionModule[]>([
    {
      module: '对话界面',
      permissions: [
        { label: '助手', value: 'assistant' }
        // ... other permissions
      ]
    }
    // ... other modules
  ])

  // 表格列定义
  const columns = [
    {
      title: '会员姓名',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: '登录账号',
      dataIndex: 'accountNo',
      key: 'accountNo'
    },
    {
      title: '分配角色',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    // {
    //   title: '在职状态',
    //   dataIndex: 'status',
    //   key: 'status'
    // },
    {
      title: '账号状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MemberType) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          <a onClick={() => handleResetPassword(record)}>重置密码</a>
          <a onClick={() => handleAssignRole(record)}>分配角色</a>
          <a
            onClick={() => handleDisableAccount(record)}
            style={{ color: record.accountStatus === '启用' ? '#ff4d4f' : '#1890ff' }}>
            {record.accountStatus === '启用' ? '禁用' : '启用'}
          </a>
        </Space>
      )
    }
  ]

  // 获取会员列表
  const fetchMemberList = async (params?: { name?: string; enable?: number }) => {
    try {
      setLoading(true)
      const response: any = await memberApi.query(params || {})
      if (response.Data.records) {
        const tableData = response.Data.records.map(convertMemberData)
        setRoleList(tableData)
      }
    } catch (error) {
      message.error('获取会员列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取角色列表
  const fetchRoleList = async () => {
    try {
      const response: any = await roleApi.query({})
      if (response.Data?.records) {
        const roleOptions = response.Data.records.map((role) => ({
          value: String(role.uid),
          label: role.name,
          disabled: role.enable !== 1
        }))
        setRoles(roleOptions)
      }
    } catch (error) {
      message.error('获取角色列表失败')
    }
  }

  // 初始化加载
  useEffect(() => {
    fetchMemberList()
    fetchRoleList()
  }, [])

  // 当选中角色变化时，更新表单数据
  useEffect(() => {
    if (isModalVisible) {
      // 更新表单逻辑
    } else {
      // 重置表单逻辑
    }
  }, [isModalVisible])

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      // const values = await form.validateFields()
      if (currentMember) {
        // TODO: 调用修改 API
        message.success('修改成功')
      } else {
        // TODO: 调用新增 API
        message.success('添加成功')
      }
      setIsModalVisible(false)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 重置密码
  const handleResetPassword = (record: MemberType) => {
    setCurrentMember(record)
    console.log(record)
    resetPasswordForm.setFieldsValue({
      currentPassword: record.psw,
      newPassword: ''
    })
    setResetPasswordVisible(true)
  }

  // 处理重置密码提交
  const handleResetPasswordSubmit = async () => {
    try {
      const values = await resetPasswordForm.validateFields()
      if (!currentMember) return

      await memberApi.update({
        uid: currentMember.uid,
        name: currentMember.accountNo,
        psw: values.newPassword
      })

      message.success('密码重置成功')
      setResetPasswordVisible(false)
      fetchMemberList()
    } catch (error) {
      message.error('密码重置失败')
    }
  }

  // 分配角色
  const handleAssignRole = (record: MemberType) => {
    setCurrentMember(record)

    // 从角色名称字符串中提取角色ID
    const currentRoleNames = record.roleName ? record.roleName.split('，') : []
    const currentRoleIds = roles.filter((role) => currentRoleNames.includes(role.label)).map((role) => role.value)

    assignRoleForm.setFieldsValue({
      memberName: record.memberName,
      currentRole: record.roleName,
      newRole: currentRoleIds // 设置默认选中的角色ID
    })
    setAssignRoleVisible(true)
  }

  // 处理分配角色提交
  const handleAssignRoleSubmit = async () => {
    try {
      const values = await assignRoleForm.validateFields()
      if (!currentMember) return

      await memberApi.assignRole({
        userId: currentMember.uid,
        roleIdStr: values.newRole.join(';') // 使用分号连接多个角色ID
      })

      message.success('角色分配成功')
      setAssignRoleVisible(false)
      fetchMemberList() // 刷新会员列表
    } catch (error) {
      message.error('角色分配失败')
    }
  }

  // 搜索功能
  const handleSearch = (value: string) => {
    setSearchName(value)
    fetchMemberList({
      name: value,
      enable: selectedStatus !== undefined ? Number(selectedStatus) : undefined
    })
  }

  // 状态筛选处理
  const handleStatusChange = (status: number | undefined) => {
    setSelectedStatus(status)
    fetchMemberList({
      name: searchName,
      enable: status
    })
  }

  // 重置搜索
  const handleReset = () => {
    setSearchName('')
    setSelectedStatus(undefined)
    fetchMemberList()
  }

  // 处理修改提交
  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      if (currentMember) {
        await memberApi.update({
          uid: currentMember.uid,
          name: values.newAccountNo
        })
        message.success('修改成功')
        setEditModalVisible(false)
        fetchMemberList()
      }
    } catch (error) {
      message.error('修改失败')
    }
  }

  // 处理启用/禁用账号
  const handleDisableAccount = (record: MemberType) => {
    const isEnabling = record.accountStatus === '禁用'
    Modal.confirm({
      title: isEnabling ? '启用账号' : '禁用账号',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <div style={{ color: isEnabling ? '#52c41a' : '#ff4d4f', marginBottom: '8px' }}>
            <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
            {isEnabling ? '启用后该账号可正常使用CakaAI，是否确认启用？' : '禁用后该账号不可使用CakaAI，是否确认禁用？'}
          </div>
          <div>
            {isEnabling ? '启用' : '禁用'}当前账号：{record.accountNo}
          </div>
        </div>
      ),
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: !isEnabling },
      onOk: async () => {
        try {
          await memberApi.update({
            uid: record.uid,
            name: record.accountNo,
            enable: isEnabling ? 1 : 0
          })
          message.success(`账号${isEnabling ? '启用' : '禁用'}成功`)
          fetchMemberList()
        } catch (error) {
          message.error(`账号${isEnabling ? '启用' : '禁用'}失败`)
        }
      }
    })
  }

  // 处理添加会员
  const handleAddMember = () => {
    addMemberForm.resetFields()
    setAddMemberVisible(true)
  }

  // 处理添加会员提交
  const handleAddMemberSubmit = async () => {
    try {
      const values = await addMemberForm.validateFields()
      await memberApi.add({
        name: values.accountNo,
        psw: values.password
      })
      message.success('添加会员成功')
      setAddMemberVisible(false)
      fetchMemberList()
    } catch (error) {
      message.error('添加会员失败')
    }
  }

  const handleEdit = (record: MemberType) => {
    setCurrentMember(record)
    editForm.setFieldsValue({
      accountNo: record.accountNo,
      newAccountNo: ''
    })
    setEditModalVisible(true)
  }

  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('会员列表')}</NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        <Header>
          <SearchArea>
            <Input
              placeholder="请输入会员姓名"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="账号状态"
              value={selectedStatus}
              onChange={(value: any) => handleStatusChange(value)}
              style={{ width: 200 }}
              allowClear>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
            <Button onClick={() => handleSearch(searchName)}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </SearchArea>
          <Button type="primary" onClick={handleAddMember}>
            + 添加会员
          </Button>
        </Header>
        <Table
          columns={columns}
          dataSource={roleList}
          pagination={false}
          bordered
          size="middle"
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </ContentContainer>

      {/* 添加/修改角色弹窗 */}
      <Modal
        title={currentMember ? '修改会员' : '新增会员'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}>
        <Form form={form} layout="vertical" initialValues={currentMember || {}}>
          <Form.Item
            label="会员姓名"
            name="memberName"
            rules={[
              { required: true, message: '请输入会员姓名' },
              { max: 16, message: '会员姓名不能超过16个字' }
            ]}>
            <Input placeholder="请输入会员姓名" />
          </Form.Item>

          <Form.Item
            label="登录账号"
            name="accountNo"
            rules={[
              { required: true, message: '请输入登录账号' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' }
            ]}>
            <Input placeholder="请输入登录账号" disabled={!!currentMember} />
          </Form.Item>

          <Form.Item label="所属部门" name="departmentNo" rules={[{ required: true, message: '请选择所属部门' }]}>
            <Select placeholder="请选择所属部门">{/* TODO: 添加部门选项 */}</Select>
          </Form.Item>

          <Form.Item label="在职状态" name="status" rules={[{ required: true, message: '请选择在职状态' }]}>
            <Radio.Group>
              <Radio value="在职">在职</Radio>
              <Radio value="离职">离职</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="账号状态" name="accountStatus" rules={[{ required: true, message: '请选择账号状态' }]}>
            <Radio.Group>
              <Radio value="启用">启用</Radio>
              <Radio value="禁用">禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改授权弹窗 */}
      <Modal
        title="授权-行政主管"
        open={authModalVisible}
        onCancel={() => setAuthModalVisible(false)}
        onOk={() => {}}
        width={800}
        bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}>
        <Form form={authForm} layout="vertical">
          <Table
            bordered
            size="small"
            pagination={false}
            dataSource={permissionData}
            columns={[
              {
                title: '权限模块',
                dataIndex: 'module',
                width: '15%'
              },
              {
                title: '权限功能',
                width: '35%',
                render: (_, record) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {record.permissions.map((permission) => (
                      <Checkbox key={permission.value} value={permission.value}>
                        {permission.label}
                      </Checkbox>
                    ))}
                  </div>
                )
              },
              {
                title: '权限项目',
                width: '50%',
                render: (_, record) => <Checkbox value={record.module.toLowerCase()}>{record.module}</Checkbox>
              }
            ]}
          />
        </Form>
      </Modal>

      {/* 添加修改弹窗 */}
      <Modal
        title="修改"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        width={400}>
        <Form form={editForm} layout="vertical">
          <Form.Item label="当前会员账号" name="accountNo">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="修改后会员账号"
            name="newAccountNo"
            rules={[
              { required: true, message: '请输入修改后会员账号' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' },
              { max: 16, message: '账号长度不能超过16位' }
            ]}>
            <Input placeholder="请输入修改后会员账号" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={resetPasswordVisible}
        onOk={handleResetPasswordSubmit}
        onCancel={() => setResetPasswordVisible(false)}
        width={400}>
        <Form form={resetPasswordForm} layout="vertical">
          <Form.Item label="当前账号密码" name="currentPassword">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="修改后的密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6位' },
              { max: 11, message: '密码长度不能超过11位' },
              { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含大小写英文和数字' }
            ]}>
            <Input.Password placeholder="请输入修改后的密码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加分配角色弹窗 */}
      <Modal
        title="分配角色"
        open={assignRoleVisible}
        onOk={handleAssignRoleSubmit}
        onCancel={() => setAssignRoleVisible(false)}
        width={400}>
        <Form form={assignRoleForm} layout="vertical">
          <Form.Item label="会员姓名" name="memberName">
            <Input disabled />
          </Form.Item>

          {/* <Form.Item label="当前角色" name="currentRole">
            <Input disabled />
          </Form.Item> */}

          <Form.Item label="分配角色" name="newRole" rules={[{ required: true, message: '请选择要分配的角色' }]}>
            <Select mode="multiple" placeholder="请选择角色" style={{ width: '100%' }} options={roles} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加会员弹窗 */}
      <Modal
        title="新增会员"
        open={addMemberVisible}
        onOk={handleAddMemberSubmit}
        onCancel={() => setAddMemberVisible(false)}
        width={400}>
        <Form form={addMemberForm} layout="vertical">
          <Form.Item
            label="会员账号"
            name="accountNo"
            rules={[
              { required: true, message: '请输入会员账号' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' },
              { min: 3, message: '账号长度不能少于3位' },
              { max: 16, message: '账号长度不能超过16位' }
            ]}>
            <Input placeholder="请输入会员账号" />
          </Form.Item>

          <Form.Item
            label="登录密码"
            name="password"
            rules={[
              { required: true, message: '请输入登录密码' },
              { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含大小写英文和数字' },
              { min: 6, message: '密码长度不能少于6位' },
              { max: 11, message: '密码长度不能超过11位' }
            ]}>
            <Input.Password placeholder="请输入登录密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const ContentContainer = styled.div`
  padding: 15px;
  display: flex;
  flex: 1;
  flex-direction: column;
  verflow: auto; // 添加此行，使容器可滚动
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SearchArea = styled.div`
  display: flex;
  gap: 8px;
`

export default MemberPage
