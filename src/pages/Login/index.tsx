import React from "react";
import "./index.less";
import { Input, Button, Form, message, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LoginPayLoad } from "@/apis/user/types";
import useStore from "@/store";
import { setLocalStorageItem } from "@/utils";

const Login = () => {
  const { loginStore, userStore } = useStore();
  const navigate = useNavigate();

  const onFinish = async (payload: LoginPayLoad) => {
    const res = await loginStore.loginOpr(payload);
    const { code } = res;
    if (code === 1) {
      const { data, msg } = res;
      const { token, nickname } = data;
      setLocalStorageItem("access_token", token);
      userStore.setNickname(nickname);
      navigate("/timetable");
      message.success(msg);
    } else {
      const { ret } = res;
      message.error(ret);
    }
  };

  return (
    <div className="login-container">
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="account"
          rules={[{ required: true, message: "请输入账号!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="账号"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
          或 <a onClick={() => navigate("/signup")}>现在注册!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
