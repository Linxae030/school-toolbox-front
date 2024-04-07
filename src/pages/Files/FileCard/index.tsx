import "./index.less";
import { Card, Avatar, Checkbox, Popconfirm } from "antd";
import Meta from "antd/es/card/Meta";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { IFile } from "@/apis/files/types";

type IProps = {
  file: IFile;
  onDelete?: (_id: string) => void;
  onDownload?: (_id: string) => void;
};
const FileCard = (props: IProps) => {
  const { file, onDelete, onDownload } = props;
  const { fileName, fileSize, fileType, tags, _id } = file;
  return (
    <div className="file-card">
      <Card
        style={{ width: 200, marginTop: 16 }}
        actions={[
          <EditOutlined key="edit" />,
          <Popconfirm
            key="delete"
            title="下载文件"
            description="你确定要下载该文件吗？"
            okText="确定"
            cancelText="取消"
            icon={<CloudDownloadOutlined />}
            onConfirm={() => onDownload?.(_id)}
          >
            <CloudDownloadOutlined key="download" />
          </Popconfirm>,
          <Popconfirm
            key="delete"
            title="删除文件"
            description="你确定要删除该文件吗？"
            okText="确定"
            cancelText="取消"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDelete?.(_id)}
          >
            <DeleteOutlined key="delete" />
          </Popconfirm>,
          <Checkbox key="check" value={_id} />,
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
