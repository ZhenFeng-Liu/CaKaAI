import { ExclamationCircleOutlined, RollbackOutlined } from '@ant-design/icons'
// import { memberApi } from '@renderer/api/member'
import { helperApi } from '@renderer/api/helper'
import { roleApi } from '@renderer/api/role'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { Button, Checkbox, Form, Input, Modal, Pagination, Select, Space, Table } from 'antd'
import { message } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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

const convertMemberData = (data: any): MemberType => ({
  ...data,
  key: String(data.uid),
  memberName: data.name,
  accountNo: data.url,
  roleName: data.Roles?.map((role: any) => role.name).join('，') || '',
  status: data.exited === 0 ? '在职' : '离职',
  accountStatus: data.enable === 1 ? '启用' : '禁用',
  uid: data.uid,
  psw: data.psw
})

const AssistantPage: FC = () => {
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
      title: '助手名称',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: '助手链接',
      dataIndex: 'accountNo',
      key: 'accountNo'
    },
    {
      title: '助手状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MemberType) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          {/* <a onClick={() => handleResetPassword(record)}>重置密码</a> */}
          {/* <a onClick={() => handleAssignRole(record)}>分配角色</a> */}
          <a
            onClick={() => handleDisableAccount(record)}
            style={{ color: record.accountStatus === '启用' ? '#ff4d4f' : '#1890ff' }}>
            {record.accountStatus === '启用' ? '禁用' : '启用'}
          </a>
          <a onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
        </Space>
      )
    }
  ]
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  // 获取会员列表
  const fetchMemberList = async (params?: { name?: string; enable?: number; pageNum?: number; pageSize?: number }) => {
    try {
      setLoading(true)
      const queryParams = {
        name: params?.name || searchName,
        enable: params?.enable !== undefined ? params.enable : selectedStatus,
        pageNum: params?.pageNum || pagination.current,
        pageSize: params?.pageSize || pagination.pageSize
      }
      const response: any = await helperApi.query(queryParams)
      console.log('获取助手列表response', response)
      if (response.Data) {
        const tableData = response.Data.map(convertMemberData)
        setRoleList(tableData)
        // 更新分页信息
        setPagination({
          ...pagination,
          current: queryParams.pageNum,
          total: response.iRows || 0 // 使用接口返回的总记录数
        })
      }
    } catch (error) {
      message.error('获取会员列表失败')
    } finally {
      setLoading(false)
    }
  }
  // 处理分页变化
  const handlePageChange = (page: number) => {
    fetchMemberList({ pageNum: page })
  }

  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    fetchMemberList({ pageNum: 1, pageSize: size })
  }
  // 获取角色列表
  const fetchRoleList = async () => {
    try {
      const response: any = await roleApi.query({})
      if (response.Data) {
        console.log('response.Data', response.Data)
        const roleOptions = response.Data.map((role: any) => ({
          value: role.uid,
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

  // 修改处理函数
  const handleEdit = (record: MemberType) => {
    setCurrentMember(record)
    // 设置表单初始值
    form.setFieldsValue({
      memberName: record.memberName,
      accountNo: record.accountNo
    })
    setIsModalVisible(true)
  }

  // 修改 handleSubmit 函数
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (currentMember) {
        // 修改助手
        await helperApi.update({
          uid: currentMember.uid,
          name: values.memberName,
          url: values.accountNo
        })
        message.success('修改成功')
      } else {
        // 添加助手
        await helperApi.add({
          name: values.memberName,
          url: values.accountNo
        })
        message.success('添加成功')
      }
      setIsModalVisible(false)
      fetchMemberList() // 刷新列表
    } catch (error) {
      console.error('表单验证失败:', error)
      message.error('操作失败，请检查输入内容')
    }
  }

  // 重置密码
  // const handleResetPassword = (record: MemberType) => {
  //   setCurrentMember(record)
  //   console.log(record)
  //   resetPasswordForm.setFieldsValue({
  //     currentPassword: record.psw,
  //     newPassword: ''
  //   })
  //   setResetPasswordVisible(true)
  // }

  // 处理重置密码提交
  const handleResetPasswordSubmit = async () => {
    try {
      const values = await resetPasswordForm.validateFields()
      if (!currentMember) return

      await helperApi.update({
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
  // const handleAssignRole = (record: any) => {
  //   setCurrentMember(record)
  //   console.log('分配角色', record)

  //   // 直接使用 Roles 数组数据
  //   const currentRoleIds = record.Roles?.map((role: any) => role.uid) || []
  //   console.log('currentRoleIds', currentRoleIds)
  //   assignRoleForm.setFieldsValue({
  //     memberName: record.memberName,
  //     currentRole: record.roleName,
  //     newRole: currentRoleIds // 直接使用角色ID数组
  //   })
  //   setAssignRoleVisible(true)
  // }

  // 处理分配角色提交
  // const handleAssignRoleSubmit = async () => {
  //   try {
  //     const values = await assignRoleForm.validateFields()
  //     if (!currentMember) return

  //     await helperApi.assignRole({
  //       userId: currentMember.uid,
  //       roleIds: values.newRole.map(Number) // 确保所有元素都是number类型
  //     })

  //     message.success('角色分配成功')
  //     setAssignRoleVisible(false)
  //     fetchMemberList() // 刷新会员列表
  //   } catch (error) {
  //     message.error('角色分配失败')
  //   }
  // }

  // 搜索功能
  const handleSearch = (value: string) => {
    setSearchName(value)
    fetchMemberList({
      name: value,
      enable: selectedStatus !== undefined ? Number(selectedStatus) : undefined,
      pageNum: 1 // 搜索时重置到第一页
    })
  }

  // 状态筛选处理
  const handleStatusChange = (status: number | undefined) => {
    setSelectedStatus(status)
    fetchMemberList({
      name: searchName,
      enable: status,
      pageNum: 1 // 筛选时重置到第一页
    })
  }

  // 重置搜索
  const handleReset = () => {
    setSearchName('')
    setSelectedStatus(undefined)
    fetchMemberList({
      name: '',
      enable: undefined,
      pageNum: 1 // 重置时回到第一页
    })
  }

  // 处理修改提交
  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      if (currentMember) {
        // 检查新账号是否与当前账号相同
        if (values.newAccountNo === currentMember.accountNo) {
          message.error('新账号不能与当前账号相同')
          return
        }
        await helperApi.update({
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
          await helperApi.update({
            uid: record.uid,
            // name: record.accountNo,
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
  const handleAdd = () => {
    setCurrentMember(null)
    form.resetFields()
    // 手动设置表单值为空
    form.setFieldsValue({
      memberName: '',
      accountNo: ''
    })
    setIsModalVisible(true)
  }

  // 处理添加会员提交
  const handleAddMemberSubmit = async () => {
    try {
      const values = await addMemberForm.validateFields()
      await helperApi.add({
        name: values.accountNo,
        psw: values.password
      })
      message.success('添加会员成功')
      setAddMemberVisible(false)
      fetchMemberList()
    } catch (error) {
      message.error('会员账号已存在，请更改后再试')
    }
  }

  // 处理删除助手
  const handleDelete = (record: MemberType) => {
    Modal.confirm({
      title: '删除助手',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除该助手吗？',
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await helperApi.delete({ uid: record.uid })
          message.success('删除成功')
          fetchMemberList()
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }

  const navigate = useNavigate()

  // 返回上一页函数
  const handleGoBack = () => {
    navigate(-1)
  }
  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('助手列表')}</NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        <Header>
          <SearchArea>
            <Button onClick={handleGoBack} icon={<RollbackOutlined />}></Button>

            <Input
              placeholder="请输入助手名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="助手状态"
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
          <Button type="primary" onClick={handleAdd}>
            + 添加助手
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
        <PaginationContainer>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
            showTotal={(total) => `共 ${total} 条记录`}
          />
        </PaginationContainer>
      </ContentContainer>

      {/* 添加/修改助手弹窗 */}
      <Modal
        title={currentMember ? '修改助手' : '新增助手'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setCurrentMember(null)
          form.resetFields()
        }}
        width={400}>
        <Form
          form={form}
          layout="vertical"
          initialValues={
            currentMember
              ? {
                  memberName: currentMember.memberName,
                  accountNo: currentMember.accountNo
                }
              : undefined
          }>
          <Form.Item
            label="助手名称"
            name="memberName"
            rules={[
              { required: true, message: '请输入助手名称' },
              { max: 50, message: '助手名称不能超过50个字符' }
            ]}>
            <Input placeholder="请输入助手名称" />
          </Form.Item>

          <Form.Item
            label="助手链接"
            name="accountNo"
            rules={[
              { required: true, message: '请输入助手链接' },
              {
                pattern: /^https?:\/\/.+/,
                message: '请输入有效的URL地址（以http://或https://开头）'
              }
            ]}>
            <Input placeholder="请输入助手链接" />
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
        // onOk={handleAssignRoleSubmit}
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
            <Select
              mode="multiple"
              placeholder="请选择角色"
              style={{ width: '100%' }}
              options={roles}
              onDeselect={(value, option) => {
                // 如果尝试取消选择默认角色，则阻止操作
                if (option.label === '默认角色') {
                  // 获取当前选中的值
                  const currentValues = assignRoleForm.getFieldValue('newRole') || []
                  // 确保默认角色仍在选中列表中
                  if (!currentValues.includes(value)) {
                    // 将默认角色重新添加到选中列表
                    assignRoleForm.setFieldValue('newRole', [...currentValues, value])
                  }
                  message.warning('默认角色不能被移除')
                  return false
                }
                return true
              }}
            />
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

// 添加分页容器样式
const PaginationContainer = styled.div`
  position: sticky;
  // bottom: 16px;
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  margin-top: auto;
  background-color: var(--color-background);
  z-index: 10;
`
export default AssistantPage
