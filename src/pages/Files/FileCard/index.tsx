import React from "react";
import "./index.less";
import { Card, Avatar } from "antd";
import Meta from "antd/es/card/Meta";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { IFile } from "@/apis/files/types";

type IProps = {
  file: IFile;
};
const FileCard = (props: IProps) => {
  const { file } = props;
  const { fileName, fileSize, fileType, tags } = file;
  return (
    <div className="file-card">
      <Card
        style={{ width: 200, marginTop: 16 }}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
          }
          title={fileName}
          description="This is the description"
        />
      </Card>
    </div>
  );
};

export default FileCard;
