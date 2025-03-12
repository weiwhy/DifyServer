import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { datasetApi, tenantApi } from '../services/api';
import { Dataset, Tenant } from '../types/index';

const { Option } = Select;
const { TextArea } = Input;

const Datasets: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchDatasets = React.useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await datasetApi.getDatasets(page);
      setDatasets(response.data.data);
      setPagination(prev => ({
        ...prev,
        current: response.data.page,
        total: response.data.total,
      }));
    } catch (error) {
      message.error('获取知识库列表失败');
      console.error('Error:', error);
    }
    setLoading(false);
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await tenantApi.getTenants(1);
      setTenants(response.data.data);
    } catch (error) {
      message.error('获取工作空间列表失败');
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchTenants();
  }, [fetchDatasets]);

  const columns = [
    { title: '名称', dataIndex: 'Name', key: 'name' },
    { title: '描述', dataIndex: 'Description', key: 'description', ellipsis: true },
    { title: '工作空间', 
      dataIndex: 'TenantID', 
      key: 'tenant',
      render: (tenantId: string) => 
        tenants.find(t => t.ID === tenantId)?.Name || tenantId
    },
    { title: '权限', dataIndex: 'Permission', key: 'permission' },
    { title: '数据源类型', dataIndex: 'DataSourceType', key: 'dataSourceType' },
    { title: '索引技术', dataIndex: 'IndexingTechnique', key: 'indexingTechnique' },
    { 
      title: '创建时间', 
      dataIndex: 'CreatedAt', 
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString()
    },
  ];

  const handleAdd = async (values: any) => {
    try {
      // 先创建数据集
      const dataset = {
        name: values.name,
        description: values.description,
        permission: 'only_me',
        data_source_type: 'upload_file',
        indexing_technique: 'high_quality',
      };
      
      // 然后关联到工作空间
      await datasetApi.addDatasetTenant(dataset.name, values.tenant_id);
      
      message.success('添加知识库成功');
      setVisible(false);
      form.resetFields();
      fetchDatasets();
    } catch (error) {
      message.error('添加知识库失败');
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
        添加知识库
      </Button>

      <Table
        columns={columns}
        dataSource={datasets}
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
            fetchDatasets(page);
          }
        }}
      />

      <Modal
        title="添加知识库"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入知识库名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} />
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

export default Datasets;