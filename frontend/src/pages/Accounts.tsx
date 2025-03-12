import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { accountApi } from '../services/api';
import { Account } from '../types';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [passwordForm] = Form.useForm();

  const handleSetPassword = async (values: { password: string }) => {
    try {
      await accountApi.setPassword(currentUserId, values.password);
      message.success('设置密码成功');
      setPasswordVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('设置密码失败');
    }
  };

  const columns = [
    { title: '名称', dataIndex: 'Name', key: 'name' },
    { title: '邮箱', dataIndex: 'Email', key: 'email' },
    { title: '语言', dataIndex: 'InterfaceLanguage', key: 'interface_language' },
    { title: '主题', dataIndex: 'InterfaceTheme', key: 'interface_theme' },
    { title: '时区', dataIndex: 'Timezone', key: 'timezone' },
    { title: '状态', dataIndex: 'Status', key: 'status' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Account) => (
        <>
          <Button 
            type="link" 
            onClick={() => {
              setCurrentUserId(record.ID);
              setPasswordVisible(true);
            }}
          >
            设置密码
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record.ID)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  const fetchAccounts = React.useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await accountApi.getAccounts(page);
      setAccounts(response.data.data);
      setPagination(prev => ({
        ...prev,
        current: response.data.page,
        total: response.data.total,
      }));
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('Error:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleAdd = async (values: any) => {
    try {
      await accountApi.addAccount(values);
      message.success('添加用户成功');
      setVisible(false);
      form.resetFields();
      fetchAccounts();
    } catch (error) {
      message.error('添加用户失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await accountApi.deleteAccount(id);
      message.success('删除用户成功');
      fetchAccounts();
    } catch (error) {
      message.error('删除用户失败');
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
        添加用户
      </Button>

      <Table
        columns={columns}
        dataSource={accounts}
        rowKey={(record) => record.ID || Math.random().toString()}
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
            fetchAccounts(page);
          }
        }}
      />

      <Modal
        title="添加用户"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加设置密码的对话框 */}
      <Modal
        title="设置密码"
        open={passwordVisible}
        onCancel={() => setPasswordVisible(false)}
        footer={null}
      >
        <Form form={passwordForm} onFinish={handleSetPassword} layout="vertical">
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Accounts;