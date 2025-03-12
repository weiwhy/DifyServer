import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { accountApi } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // 修改检查登录状态的逻辑
  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // 只有当用户数据和token都存在时才重定向
        if (user.data && user.token) {
          navigate('/accounts');
        }
      } catch (e) {
        // 如果解析失败，清除无效的用户数据
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await accountApi.login(values);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        message.success('登录成功');
        setTimeout(() => {
          navigate('/accounts');
        }, 1000);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error(error.response.data.error);
      } else {
        message.error('登录失败，请稍后重试');
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5' 
    }}>
      <Card title="用户登录" style={{ width: 400 }}>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度至少为8位' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;