import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import menuItems from "./config";
import "./index.less";
import useStore from "@/store";

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = observer(() => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const defaultSelectedKeys = location.pathname;
  const defaultOpenKeys = `/${defaultSelectedKeys.split("/")[1]}`;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { userStore } = useStore()
  const navigate = useNavigate();

  const { nickname } = userStore
  useEffect(() => {
    userStore.initUserProfile();
  }, [])


  return (
    <Layout className="layout-container">
      <Sider trigger={null} collapsible collapsed={collapsed} className="sider">
        <div className="sider-top-area">
          <div className="avatar"></div>
          <div className="user-info">
            <div>您好!</div>
            <div className="nickname">{nickname}</div>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[defaultSelectedKeys]}
          defaultOpenKeys={[defaultOpenKeys]}
          items={menuItems}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
});

export default AppLayout;
