import React, { useState } from "react";
import "./index.less";
import * as _ from "lodash";
import {
  CloseOutlined,
  EditOutlined,
  FileAddOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import FileTagList from "./FileTagList";
import ButtonGroup, { GroupButtonItem } from "@/components/ButtonGroup";

const Files = () => {
  const tags = ["学校", "工作"];

  const [isEditing, setIsEditing] = useState(false);

  const operationButtons: GroupButtonItem[] = _.compact([
    {
      showPopconfirm: true,
      children: "上传文件",
      type: "primary",
      icon: <FileAddOutlined />,
    },
    {
      showPopconfirm: true,
      children: "添加标签",
      type: "primary",
      icon: <TagsOutlined />,
      // popConfirmProps: {
      //   title: "另存为新的简历",
      //   description: "确定要另存为新的简历吗？",
      //   onConfirm: () => {},
      // },
    },
    !isEditing
      ? {
          children: "编辑标签",
          type: "primary",
          icon: <EditOutlined />,
          onClick: () => setIsEditing(true),
        }
      : {
          children: "退出编辑",
          type: "primary",
          danger: true,
          icon: <EditOutlined />,
          onClick: () => setIsEditing(false),
        },
  ]);

  return (
    <div className="files">
      <aside className="side-bar">
        <div className="operations">
          <ButtonGroup buttons={operationButtons}></ButtonGroup>
        </div>
        <FileTagList tags={tags} isEditing={isEditing}></FileTagList>
      </aside>
      <Divider type="vertical" />
    </div>
  );
};

export default Files;
