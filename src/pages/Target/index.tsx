import React, { useEffect } from "react";
import "./index.less";
import { Form, Input, Menu } from "antd";
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@/types";
import getMenuItem from "@/utils/getMenuItem";
import TargetPreviewer from "./TargetPreviewer";
import useStore from "@/store";
import ButtonGroup, { GroupButtonItem } from "@/components/ButtonGroup";
import TargetConfigPanel from "./TargetConfigPanel";
import { useFormModal } from "@/components/Modal";
import { waitAndRefreshPage } from "@/utils";

type TargetFormType = {
  targetName: string;
};

const Target = observer(() => {
  const navigate = useNavigate();
  const { targetStore } = useStore();
  const {
    currentTarget,
    targetList,
    setCurrentTargetId,
    createTargetOpr,
    findAllTargetOpr,
  } = targetStore;

  const formModalHandler = useFormModal();

  const renderTargetFormModalChildren = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="目标名"
          name="targetName"
          rules={[{ required: true, message: "请输入目标名" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  };

  const handleCreateTarget = async (targetName: string) => {
    await createTargetOpr(targetName);
    waitAndRefreshPage(navigate, 1);
  };

  useEffect(() => {
    findAllTargetOpr();
  }, []);

  const menuItems = targetList.map((target) =>
    getMenuItem(target.targetName, target._id),
  );
  const oprButtons: GroupButtonItem[] = [
    {
      children: "新建目标",
      icon: <FileAddOutlined />,
      style: {
        width: "100%",
      },
      onClick: () => {
        formModalHandler.open<TargetFormType>({
          modalProps: {
            title: "新建目标",
            cancelText: "取消",
            okText: "创建",
            onOk: ({ targetName }) => handleCreateTarget(targetName),
          },
          formChildren: renderTargetFormModalChildren(),
        });
      },
    },
  ];

  return (
    <div className="target-container">
      <div className="menu-container">
        <ButtonGroup buttons={oprButtons} />
        <Menu
          className="menu"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          onClick={(item) => setCurrentTargetId(item.key)}
        />
      </div>
      <TargetPreviewer target={currentTarget}></TargetPreviewer>
      <TargetConfigPanel
        target={currentTarget}
        store={targetStore}
        navigate={navigate}
      />
    </div>
  );
});

export default Target;
