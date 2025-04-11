import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GeneralStyles/Login.css';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Divider ,
  message,
} from 'antd';
import { 
  GoogleOutlined, 
  AppleFilled, 
  MailOutlined, 
  LockOutlined,
  UserOutlined 
} from '@ant-design/icons';
import backgroundLogin from '../assets/background_login.jpg';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // Simple login validation (you'd typically replace this with actual authentication)
    if (values.email && values.id && values.password) {
      // Simulating successful login
      message.success('Login Successful!');
      
      // Navigate to homepage after successful login
      navigate('/payroll');
    } else {
      message.error('Login Failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      {/* Left Image Section */}
      <div className="login-image-section">
        <img src={backgroundLogin} alt="Login Background" className="login-image"/>
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
            name="email"
            rules={[{ 
              required: true, 
              message: 'Please input your email!' 
            }]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Input your email"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="id"
            rules={[{ 
              required: true, 
              message: 'Please input your ID!' 
            }]}
          >
            <Input 
              prefix={<UserOutlined /> }
              placeholder="Input your ID"
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

            <button 
            className="login-forgot-password" 
            onClick={() => message.info("Chức năng đang phát triển")}
            >
            Forgot password
            </button>

          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              className="login-submit-btn"
            >
              Login
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