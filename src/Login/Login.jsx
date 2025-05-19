import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/GeneralStyles/Login.css";
import axios from "axios";
import { Form, Input, Button, Checkbox, Divider, message } from "antd";
import {
  GoogleOutlined,
  AppleFilled,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import backgroundLogin from "../assets/background_login.jpg";

/**
 * Route bảo vệ truy cập dựa trên role và token
 */
export const ProtectedRoute = ({ children, allowedRoles, redirectPath = "/" }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(role)) {
    switch (role) {
      case "admin": return <Navigate to="/admin" />;
      case "hr": return <Navigate to="/human" />;
      case "payroll": return <Navigate to="/payroll" />;
      case "employee": return <Navigate to="/employee/profile" />;
      default: return <Navigate to={redirectPath} />;
    }
  }

  return children;
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3001/api/auth/login", {
        username: values.username,
        password: values.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("employeeId", response.data.employeeId);
      localStorage.setItem("role", response.data.role);

      message.success("Đăng nhập thành công!");

      switch (response.data.role) {
        case "admin": navigate("/admin"); break;
        case "hr": navigate("/human"); break;
        case "payroll": navigate("/payroll"); break;
        default: navigate("/employee/profile"); break;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        form.setFieldValue("password", ""); 
        form.setFields([
          {
            name: "password",
            errors: ["Tài khoản hoặc mật khẩu không đúng"],
          },
        ]);
      } else {
        message.error("Không thể kết nối đến máy chủ!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <img src={backgroundLogin} alt="Login Background" className="login-image" />
        <div className="login-image-text">
          <h2>Streamline Your Workday with Kerjasa</h2>
          <p>
            Highlight how Kerjasa simplifies collaboration between HR and
            employees, with features like attendance tracking, leave management,
            and performance monitoring.
          </p>
        </div>
      </div>

      <div className="login-form-section">
        <Form
          form={form}
          name="login"
          className="login-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <h1>Hi, Welcome</h1>

          <div className="social-login-buttons">
            <Button icon={<GoogleOutlined />} block className="google-login-btn">
              Google
            </Button>
            <Button icon={<AppleFilled />} block className="apple-login-btn">
              Apple
            </Button>
          </div>

          <Divider>Or Sign in with</Divider>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Input your password"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
