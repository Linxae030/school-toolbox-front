import React from "react";
import "./index.less";
import { Menu } from "antd";
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { MenuItem } from "@/types";
import getMenuItem from "@/utils/getMenuItem";
import TargetPreviewer from "./TargetPreviewer";
import useStore from "@/store";
import ButtonGroup, { GroupButtonItem } from "@/components/ButtonGroup";
import TargetConfigPanel from "./TargetConfigPanel";

const Target = observer(() => {
  const { targetStore } = useStore();
  const { currentTarget, targetList, setCurrentTargetId } = targetStore;

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
        console.log("新建");
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
      <TargetConfigPanel target={currentTarget} />
    </div>
  );
});

export default Target;
