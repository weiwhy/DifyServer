import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { tenantApi } from '../services/api';
import { Tenant } from '../types';

const { Option } = Select;

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns = [
    { title: '名称', dataIndex: 'Name', key: 'name' },
    { title: '计划', dataIndex: 'Plan', key: 'plan' },
    { title: '状态', dataIndex: 'Status', key: 'status' },
    { 
      title: '创建时间', 
      dataIndex: 'CreatedAt', 
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString()
    },
    { 
      title: '更新时间', 
      dataIndex: 'UpdatedAt', 
      key: 'updated_at',
      render: (text: string) => new Date(text).toLocaleString()
    },
  ];

  const fetchTenants = React.useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await tenantApi.getTenants(page);
      setTenants(response.data.data);
      setPagination(prev => ({
        ...prev,
        current: response.data.page,
        total: response.data.total,
      }));
    } catch (error) {
      message.error('获取工作空间列表失败');
      console.error('Error:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleAdd = async (values: any) => {
    try {
      await tenantApi.addTenant({
        ...values,
        status: 'normal',
        plan: values.plan || 'basic',
      });
      message.success('添加工作空间成功');
      setVisible(false);
      form.resetFields();
      fetchTenants();
    } catch (error) {
      message.error('添加工作空间失败');
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
        添加工作空间
      </Button>

      <Table
        columns={columns}
        dataSource={tenants}
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
            fetchTenants(page);
          }
        }}
      />

      <Modal
        title="添加工作空间"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入工作空间名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="plan"
            label="计划"
            initialValue="basic"
          >
            <Select>
              <Option value="basic">基础版</Option>
              <Option value="pro">专业版</Option>
              <Option value="enterprise">企业版</Option>
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

export default Tenants;