import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { tenantAccountApi, accountApi, tenantApi } from '../services/api';
import { TenantAccountJoin, Account, Tenant } from '../types';

const { Option } = Select;

// 添加角色常量
const ROLES = [
  { value: 'owner', label: '所有者' },
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑者' },
  { value: 'normal', label: '成员' },
];

const TenantAccounts: React.FC = () => {
  const [joins, setJoins] = useState<TenantAccountJoin[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchJoins = React.useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await tenantAccountApi.listTenantAccounts(page);
      setJoins(response.data.data);
      setPagination(prev => ({
        ...prev,
        current: response.data.page,
        total: response.data.total,
      }));
    } catch (error) {
      message.error('获取关联关系列表失败');
      console.error('Error:', error);
    }
    setLoading(false);
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountApi.getAccounts(1);
      setAccounts(response.data.data);
    } catch (error) {
      message.error('获取用户列表失败');
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await tenantApi.getTenants(1);
      setTenants(response.data.data);
    } catch (error) {
      message.error('获取工作空间列表失败');
    }
  };

  useEffect(() => {
    fetchJoins();
    fetchAccounts();
    fetchTenants();
  }, [fetchJoins]);

  const columns = [
    { 
      title: '用户', 
      dataIndex: 'AccountID', 
      key: 'account',
      render: (accountId: string) => 
        accounts.find(a => a.ID === accountId)?.Name || accountId
    },
    { 
      title: '工作空间', 
      dataIndex: 'TenantID', 
      key: 'tenant',
      render: (tenantId: string) => 
        tenants.find(t => t.ID === tenantId)?.Name || tenantId
    },
    { 
      title: '角色', 
      dataIndex: 'Role', 
      key: 'role',
      render: (role: string, record: TenantAccountJoin) => (
        <Select
          value={role}
          style={{ width: 100 }}
          onChange={(newRole) => handleRoleChange(record.TenantID, record.AccountID, newRole)}
        >
          {ROLES.map(r => (
            <Option key={r.value} value={r.value}>{r.label}</Option>
          ))}
        </Select>
      )
    },
    { 
      title: '创建时间', 
      dataIndex: 'CreatedAt', 
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: TenantAccountJoin) => (
        <Button 
          type="link" 
          danger 
          onClick={() => handleDelete(record.TenantID, record.AccountID)}
        >
          删除
        </Button>
      ),
    },
  ];

  const handleAdd = async (values: any) => {
    try {
      await tenantAccountApi.addTenantAccount({
        account_id: values.account_id,
        tenant_id: values.tenant_id,
        role: values.role
      });
      message.success('添加关联关系成功');
      setVisible(false);
      form.resetFields();
      fetchJoins();
    } catch (error) {
      message.error('添加关联关系失败');
    }
  };

  const handleDelete = async (tenantId: string, accountId: string) => {
    try {
      await tenantAccountApi.deleteTenantAccount(accountId, tenantId);
      message.success('删除关联关系成功');
      fetchJoins();
    } catch (error) {
      message.error('删除关联关系失败');
    }
  };

  // 添加角色更改处理函数
  const handleRoleChange = async (tenantId: string, accountId: string, newRole: string) => {
    try {
      await tenantAccountApi.updateRole({
        tenant_id: tenantId,
        account_id: accountId,
        role: newRole
      });
      message.success('更新角色成功');
      fetchJoins();
    } catch (error) {
      message.error('更新角色失败');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
        style={{ marginBottom: 16 }}
      >
        添加关联关系
      </Button>

      <Table
        columns={columns}
        dataSource={joins}
        rowKey={(record) => `${record.TenantID}-${record.AccountID}`}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, pageSize) => {
            setPagination(prev => ({
              ...prev,
              current: page,
              pageSize: pageSize || 10
            }));
            fetchJoins(page);
          }
        }}
      />

      <Modal
        title="添加关联关系"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            name="account_id"
            label="用户"
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select>
              {accounts.map(account => (
                <Option key={account.ID} value={account.ID}>
                  {account.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="tenant_id"
            label="工作空间"
            rules={[{ required: true, message: '请选择工作空间' }]}
          >
            <Select>
              {tenants.map(tenant => (
                <Option key={tenant.ID} value={tenant.ID}>
                  {tenant.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            initialValue="normal"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              {ROLES.map(role => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TenantAccounts;