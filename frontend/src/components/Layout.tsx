import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Accounts from '../pages/Accounts';
import Tenants from '../pages/Tenants';
import TenantAccounts from '../pages/TenantAccounts';
import Datasets from '../pages/Datasets';
import Login from '../pages/Login';

const { Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 检查是否已登录
  const isAuthenticated = localStorage.getItem('user') !== null;

  // 如果未登录，只渲染登录页面
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const menuItems = [
    {
      key: '/accounts',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/tenants',
      icon: <TeamOutlined />,
      label: '工作空间',
    },
    {
      key: '/tenant-accounts',
      icon: <TeamOutlined />,
      label: '关联关系',
    },
    {
      key: '/datasets',
      icon: <DatabaseOutlined />,
      label: '知识库',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ 
          height: 32, 
          margin: 16, 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src="/logo192.png" 
            alt="Dify Logo" 
            style={{ 
              height: '100%',
              maxWidth: '100%',
              objectFit: 'contain'
            }} 
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Routes>
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/tenant-accounts" element={<TenantAccounts />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/" element={<Navigate to="/accounts" replace />} />
            <Route path="*" element={<Navigate to="/accounts" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;