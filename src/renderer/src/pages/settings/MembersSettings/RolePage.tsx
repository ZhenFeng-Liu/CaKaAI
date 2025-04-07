import { ExclamationCircleOutlined, RollbackOutlined } from '@ant-design/icons'
import { menuApi } from '@renderer/api/menu'
import { roleApi, RoleMenuButtonParams } from '@renderer/api/role'
import { AddRoleParams, RoleData } from '@renderer/api/role'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { Button, Checkbox, Form, Input, message, Modal, Pagination, Radio, Space, Table, Tooltip } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
interface TableRoleData {
  key: string
  roleName: string
  isAdmin: string
  description: string
  isEnabled: string
  uid: number
}

const convertRoleData = (data: RoleData): TableRoleData => ({
  key: String(data.uid),
  roleName: data.name,
  isAdmin: data.admin === 1 ? '是' : '否',
  description: data.info,
  isEnabled: data.enable === 1 ? '是' : '否',
  uid: data.uid
})

const convertToApiParams = (values: any): AddRoleParams => {
  return {
    name: values.roleName,
    admin: values.isAdmin === '是' ? 1 : 0,
    info: values.description,
    enable: values.isEnabled === '是' ? 1 : 0
  }
}
const RolePage: FC = () => {
  // const { pathname } = useLocation()
  const { t } = useTranslation()
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [authModalVisible, setAuthModalVisible] = useState(false)
  const [authForm] = Form.useForm()
  const [searchName, setSearchName] = useState('')
  const [roleList, setRoleList] = useState<TableRoleData[]>([])
  const [loading, setLoading] = useState(false)
  const [menuData, setMenuData] = useState<any[]>([])
  // const isRoute = (path: string): string => (pathname.startsWith(path) ? 'active' : '')
  // 表格列定义
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: '20%'
    },
    {
      title: '是否管理员',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: '15%',
      render: (isAdmin: string) => isAdmin
    },
    {
      title: '角色说明',
      dataIndex: 'description',
      key: 'description',
      width: '25%'
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      width: '15%',
      render: (isEnabled: string) => isEnabled
    },
    {
      title: '操作',
      key: 'action',
      width: '25%',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          <a onClick={() => handleDelete(record)}>删除</a>
          <a onClick={() => handleToggleStatus(record)}>{record.isEnabled === '是' ? '禁用' : '启用'}</a>
          <a onClick={() => handleAuthorize(record)}>授权</a>
          <a onClick={() => handleCopy(record)}>复制</a>
        </Space>
      )
    }
  ]
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const fetchRoleList = async (name?: string, page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      setLoading(true)
      const response: any = await roleApi.query({ name, pageNum: page, pageSize })
      if (response.Data) {
        const tableData = response.Data.map(convertRoleData)
        setRoleList(tableData)

        // 更新分页信息
        setPagination({
          ...pagination,
          current: page,
          total: response.iRows || 0 // 使用接口返回的总记录数
        })
      }
    } catch (error) {
      message.error('获取角色列表失败')
      console.error('获取角色列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取菜单数据
  const fetchMenuData = async () => {
    try {
      const response = await menuApi.query()
      console.log('菜单数据', response)
      if (response.Code === 0 && response.Data) {
        // 使用 transformMenuData 转换数据
        const transformedData = menuApi.transformMenuData(response.Data)
        console.log('菜单数据:', transformedData)
        setMenuData(transformedData)
      }
    } catch (error) {
      message.error('获取菜单数据失败')
    }
  }
  useEffect(() => {
    fetchRoleList()
    fetchMenuData()
  }, [])

  // 当选中角色变化时，更新表单数据
  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue(selectedRole || {})
    } else {
      form.resetFields()
    }
  }, [isModalVisible, selectedRole])

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const params = convertToApiParams(values)

      // 清除可能存在的消息提示
      message.destroy()

      // 检查角色名称是否已存在
      const isDuplicate = roleList.some(
        (role) =>
          role.roleName === values.roleName && (!selectedRole || (selectedRole && role.uid !== selectedRole.uid))
      )

      if (isDuplicate) {
        message.error('角色名称已存在，请更换名称')
        return
      }

      if (selectedRole && !selectedRole.isCopy) {
        // 修改角色
        const response = await roleApi.update({
          ...params,
          uid: selectedRole.uid
        })
        console.log('修改角色response', response)
        if (response.Code !== 0) {
          message.error(response.Msg || '修改失败')
          return
        }
        message.success(response.Msg || '修改成功')
      } else {
        // 新增角色（包括复制的情况）
        const response = await roleApi.add(params)
        if (response.Code !== 0) {
          message.error(response.Msg || '添加失败')
          return
        }
        message.success(response.Msg || '添加成功')
      }
      setIsModalVisible(false)
      fetchRoleList()
    } catch (error: any) {
      console.error('表单验证失败:', error)
      message.error('表单填写有误或角色名称已存在，请检查输入内容')
    }
  }

  // 修改角色
  const handleEdit = (record: any) => {
    setSelectedRole(record)
    setIsModalVisible(true)
  }

  // 删除角色
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '删除角色',
      content: (
        <div>
          <div style={{ color: '#ff4d4f', marginBottom: '8px' }}>
            <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
            删除角色后，关联该角色的会员，同步解除相应功能授权，是否确认删除
          </div>
        </div>
      ),
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await roleApi.delete({ uid: record.uid })
          message.success('删除成功')
          fetchRoleList()
        } catch (error) {
          console.error('删除失败:', error)
          message.error('删除失败')
        }
      }
    })
  }

  // 禁用/启用角色
  const handleToggleStatus = async (record: TableRoleData) => {
    const newStatus = record.isEnabled === '是' ? '否' : '是'
    if (newStatus === '否') {
      Modal.confirm({
        title: '禁用角色',
        content: (
          <div>
            <div style={{ color: '#ff4d4f', marginBottom: '8px' }}>
              <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
              禁用角色后，关联该角色的会员，同步解除相应功能授权，是否确认禁用
            </div>
          </div>
        ),
        okText: '确定',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await roleApi.update({
              uid: record.uid,
              // name: record.roleName,
              // admin: record.isAdmin === '是' ? 1 : 0,
              // info: record.description,
              enable: 0
            })
            message.success('禁用成功')
            fetchRoleList()
          } catch (error) {
            message.error('禁用失败')
          }
        }
      })
    } else {
      try {
        await roleApi.update({
          uid: record.uid,
          // name: record.roleName,
          // admin: record.isAdmin === '是' ? 1 : 0,
          // info: record.description,
          enable: 1
        })
        message.success('启用成功')
        fetchRoleList()
      } catch (error) {
        message.error('启用失败')
      }
    }
  }

  // 复制角色
  const handleCopy = (record: TableRoleData) => {
    // 设置表单初始值，但清除 uid
    const initialValues = {
      roleName: `${record.roleName}_副本`,
      isAdmin: record.isAdmin,
      description: record.description,
      isEnabled: record.isEnabled
    }
    // setSelectedRole(null) // 设为 null 以触发新增逻辑
    setSelectedRole({ ...initialValues, isCopy: true }) // 设置 isCopy 为 true 以标识为复制角色
    form.setFieldsValue(initialValues)
    setIsModalVisible(true)
  }

  // 授权角色
  const handleAuthorize = async (record: any) => {
    setSelectedRole(record)
    setAuthModalVisible(true)

    // 重置表单
    authForm.resetFields()

    try {
      const response: any = await roleApi.query({ name: record.roleName })
      if (response.Data) {
        const currentPermissions = {}
        const modulePermissions = {}
        response.Data[0].Menus.forEach((perm: any) => {
          console.log('获取当前角色的权限perm', perm)
          // 在菜单数据中找到对应的菜单项
          const menuItem = menuData.find((item: any) => {
            console.log('获取当前角色的权限item', item)
            return item.label === perm.menu
          })
          console.log('获取当前角色的权限menuItem', menuItem)
          if (menuItem) {
            // 将每个模块的按钮ID数组存储到对应的模块ID下
            const buttonIds = perm.Buttons?.map((btn: any) => Number(btn.uid)) || []
            currentPermissions[menuItem.key] = buttonIds

            // 检查是否所有可用按钮都被选中
            // const allEnabledButtons = menuItem.buttons?.filter((btn) => btn.enable).map((btn) => Number(btn.key)) || []
            // modulePermissions[menuItem.key] = allEnabledButtons.every((id) => buttonIds.includes(id))

            // 如果有按钮被选中或模块被单独选中（通过 enable 字段判断），则将模块标记为选中
            modulePermissions[menuItem.key] = buttonIds.length > 0 || perm.enable === 1
          }
        })
        // 设置表单的默认值
        // console.log('获取当前角色的权限currentPermissions', currentPermissions)
        authForm.setFieldsValue({ permissions: currentPermissions, modulePermissions: modulePermissions })
      }
    } catch (error) {
      message.error('获取角色权限失败')
    }
  }

  // 处理授权提交
  const handleAuthSubmit = async () => {
    try {
      const values = await authForm.validateFields()
      const modulePermissions = values.modulePermissions || {}
      // 过滤出选中的模块，不再过滤按钮权限
      const permissionsData = Object.entries(values.permissions)
        .filter(([moduleId]) => modulePermissions[moduleId])
        .map(([moduleId, buttonIds]) => [
          moduleId,
          // 确保 buttonIds 始终是数组，即使是空数组
          Array.isArray(buttonIds) ? buttonIds : []
        ])
      console.log('授权数据:', permissionsData)
      // 准备接口所需的参数
      const params: RoleMenuButtonParams = {
        roleId: selectedRole.uid,
        menuIds: permissionsData.map(([moduleId]) => Number(moduleId)),
        buttonIds: permissionsData
          .map(([, buttonIds]) => buttonIds as number[])
          .flat()
          .filter((id) => id !== undefined)
      }

      // 调用授权接口
      await roleApi.rolemenubutton(params)
      message.success('授权成功')
      setAuthModalVisible(false)
    } catch (error) {
      console.error('授权失败:', error)
      message.error('授权失败')
    }
  }

  // 添加角色
  const handleAdd = () => {
    setSelectedRole(null)
    setIsModalVisible(true)
  }
  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    fetchRoleList(searchName, page, pageSize)
  }
  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    fetchRoleList(searchName, 1, size)
  }
  // 重置搜索
  const handleReset = () => {
    setSearchName('')
    setPagination({
      ...pagination,
      current: 1
    })
    fetchRoleList('', 1, pagination.pageSize)
  }

  const handleSearch = (value: string) => {
    setSearchName(value)
    setPagination({
      ...pagination,
      current: 1
    })
    fetchRoleList(value, 1, pagination.pageSize)
  }
  // ... 现有代码 ...
  const navigate = useNavigate()

  // 返回上一页函数
  const handleGoBack = () => {
    navigate(-1)
  }
  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('角色列表')}</NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        <Header>
          <SearchArea>
            <Button onClick={handleGoBack} icon={<RollbackOutlined />}></Button>
            <Input.Search
              placeholder="请输入角色名称"
              style={{ width: 200 }}
              onSearch={handleSearch}
              value={searchName} // 添加 value 属性
              onChange={(e) => setSearchName(e.target.value)} // 添加 onChange 事件
            />
            <Button onClick={handleReset}>重置</Button>
          </SearchArea>
          <Button type="primary" onClick={handleAdd}>
            + 添加角色
          </Button>
        </Header>
        <Table
          columns={columns}
          dataSource={roleList}
          pagination={false} // 禁用分页
          bordered // 添加边框
          size="middle" // 紧凑型表格
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

      {/* 添加/修改角色弹窗 */}
      <Modal
        title={selectedRole ? (selectedRole.isCopy ? '复制角色' : '修改角色') : '新增角色'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        width={500}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isAdmin: '否',
            isEnabled: '是'
          }}>
          <Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item label="是否管理员" name="isAdmin" rules={[{ required: true, message: '请选择是否为管理员' }]}>
            <Radio.Group>
              <Radio value="是">是</Radio>
              <Radio value="否">否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="角色说明" name="description" rules={[{ required: true, message: '请输入角色说明' }]}>
            <Input.TextArea placeholder="请输入角色说明" rows={4} maxLength={200} showCount />
          </Form.Item>

          <Form.Item label="是否启用" name="isEnabled" rules={[{ required: true, message: '请选择是否启用' }]}>
            <Radio.Group>
              <Radio value="是">是</Radio>
              <Radio value="否">否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改授权弹窗 */}
      <Modal
        title={`授权-${selectedRole?.roleName || ''}`}
        open={authModalVisible}
        onCancel={() => setAuthModalVisible(false)}
        onOk={handleAuthSubmit}
        width={800}>
        <Form form={authForm} layout="vertical">
          <Table
            bordered
            size="small"
            pagination={false}
            dataSource={menuData}
            rowKey="key"
            columns={[
              {
                title: '功能模块',
                dataIndex: 'label',
                width: '20%',
                render: (text, record) => (
                  <Form.Item
                    noStyle
                    name={['modulePermissions', record.key]}
                    valuePropName="checked"
                    initialValue={false}>
                    <Checkbox
                      onChange={(e) => {
                        // 获取当前模块所有按钮的ID
                        // const allButtonIds = record.buttons?.map((btn) => Number(btn.key)) || []
                        // 获取当前表单中该模块的权限值
                        // const currentPermissions = authForm.getFieldValue(['permissions', record.key]) || []

                        // 如果模块被选中，选中所有未禁用的按钮
                        if (e.target.checked) {
                          const enabledButtonIds =
                            record.buttons?.filter((btn) => btn.enable).map((btn) => Number(btn.key)) || []
                          authForm.setFieldValue(['permissions', record.key], enabledButtonIds)
                        } else {
                          // 如果模块被取消选中，清空所有按钮选择
                          authForm.setFieldValue(['permissions', record.key], [])
                        }
                      }}>
                      {text}
                    </Checkbox>
                  </Form.Item>
                )
              },
              {
                title: '功能权限',
                width: '80%',
                render: (_, record) => (
                  <Form.Item noStyle name={['permissions', record.key]} initialValue={[]}>
                    <Checkbox.Group
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                      onChange={(checkedValues) => {
                        // 当按钮选择变化时，更新模块的选中状态
                        const enabledButtons = record.buttons?.filter((btn) => btn.enable) || []
                        // 如果没有启用的按钮，则模块不会被选中
                        if (enabledButtons.length === 0) {
                          authForm.setFieldValue(['modulePermissions', record.key], false)
                          return
                        }

                        // 检查是否有任何按钮被选中
                        const hasCheckedButtons = checkedValues.length > 0
                        authForm.setFieldValue(['modulePermissions', record.key], hasCheckedButtons)
                      }}>
                      {record.buttons?.map((button) => (
                        <Checkbox
                          key={button.key}
                          value={Number(button.key)}
                          disabled={!button.enable}
                          style={{ marginRight: '8px', marginBottom: '8px' }}>
                          <Tooltip title={button.info || '暂无说明'}>{button.label}</Tooltip>
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                )
              }
            ]}
          />
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
  overflow: auto; // 添加此行，使容器可滚动
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
export default RolePage
