import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GeneralStyles/Login.css';
import axios from 'axios';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  message
} from 'antd';
import {
  GoogleOutlined,
  AppleFilled,
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import backgroundLogin from '../assets/background_login.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Make API request to login endpoint
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username: values.username,
        password: values.password
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('employeeId', response.data.employeeId);
      localStorage.setItem('role', response.data.role);

      message.success('Login Successful!');

      // Redirect based on role
      switch (response.data.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'hr':
          navigate('/human');
          break;
        case 'payroll':
          navigate('/payroll');
          break;
        default:
          navigate('/employee/profile');
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data.error || 'Login failed');
      } else {
        message.error('Unable to connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Image Section */}
      <div className="login-image-section">
        <img src={backgroundLogin} alt="Login Background" className="login-image" />
        <div className="login-image-text">
          <h2>Streamline Your Workday with Kerjasa</h2>
          <p>
            Highlight how Kerjasa simplifies collaboration between HR and employees,
            with features like attendance tracking, leave management, and performance monitoring.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="login-form-section">
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <h1>Hi, Welcome</h1>

          <div className="social-login-buttons">
            <Button
              icon={<GoogleOutlined />}
              block
              className="google-login-btn"
            >
              Google
            </Button>
            <Button
              icon={<AppleFilled />}
              block
              className="apple-login-btn"
            >
              Apple
            </Button>
          </div>

          <Divider>Or Sign in with</Divider>

          <Form.Item
            name="username"
            rules={[{
              required: true,
              message: 'Please input your username!'
            }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{
              required: true,
              message: 'Please input your password!'
            }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Input your password"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a
              className="login-forgot-password"
              onClick={() => message.info("Chức năng đang phát triển")}
            >
              Forgot password
            </a>

          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="login-submit-btn"
              loading={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Login.css';
// import {
//   Form,
//   Input,
//   Button,
//   Checkbox,
//   Divider ,
//   message,
// } from 'antd';
// import {
//   GoogleOutlined,
//   AppleFilled,
//   MailOutlined,
//   LockOutlined,
//   UserOutlined
// } from '@ant-design/icons';
// import backgroundLogin from '../assets/background_login.jpg';


// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(values)
//       });

//       const data = await response.json();
//       if (response.ok) {
//         message.success(data.message);
//         // Điều hướng theo role
//         if (data.role === 'admin') navigate('/admin');
//         else if (data.role === 'hr_manager') navigate('/hr-manager');
//         else if (data.role === 'payroll_manager') navigate('/payroll-manager');
//         else navigate('/employee');
//       } else {
//         message.error(data.error);
//       }
//     } catch (error) {
//       message.error("Lỗi kết nối đến server!");
//     }
//   };


//   return (
//     <div className="login-container">
//       <h1>Login</h1>
//       <Form name="login" onFinish={onFinish}>
//         <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
//           <Input placeholder="Email" />
//         </Form.Item>
//         <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
//           <Input.Password placeholder="Password" />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default Login;