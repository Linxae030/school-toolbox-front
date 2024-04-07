import { InboxOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import * as _ from "lodash";

type IProps = UploadProps;
const UniqueUpload = (props: IProps) => {
  const { onChange } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = _.unionBy(newFileList, (file) => file.name);
    onChange?.({ file: info.file, fileList: newFileList });
    setFileList(newFileList);
  };

  return (
    <Dragger
      {...props}
      multiple
      beforeUpload={() => false}
      onChange={handleChange}
      fileList={fileList}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">将文件拖到这里上传</p>
      <p className="ant-upload-hint">支持单个或多个文件</p>
    </Dragger>
  );
};

export default UniqueUpload;
