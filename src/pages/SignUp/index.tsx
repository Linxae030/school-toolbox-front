import React from "react";
import "./index.less";
import { Input, Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { SignUpPayLoad } from "@/apis/user/types";
import useStore from "@/store";

type FieldType = {
  account?: string;
  nickname?: string;
  password?: string;
  repeatedPassword?: string;
};

const SignUp = () => {
  const { loginStore } = useStore();
  const navigate = useNavigate();

  const onFinish = async (payload: SignUpPayLoad) => {
    const res = await loginStore.signUpOpr(payload);
    const { code } = res;
    if (code === 1) {
      const { data, msg } = res;
      navigate("/login");
      message.success(msg);
    } else {
      const { ret } = res;
      message.error(ret);
    }
  };

  const validateRepeatedPwd = (payload: any) => ({
    validator(_: any, value: string) {
      const { getFieldValue } = payload;
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("两次密码不匹配!"));
    },
  });

  return (
    <div className="signup-container">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="账户"
          name="account"
          rules={[{ required: true, message: "请输入账户" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="昵称"
          name="nickname"
          rules={[{ required: true, message: "请输入昵称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<FieldType>
          label="重复密码"
          name="repeatedPassword"
          rules={[
            { required: true, message: "请再次输入密码" },
            validateRepeatedPwd,
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div className="operations">
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => navigate("/login")}
            >
              去登录
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default SignUp;
