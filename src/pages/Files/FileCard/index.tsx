import "./index.less";
import { Card, Avatar, Checkbox, Popconfirm, Flex, Tag, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { useCallback } from "react";
import * as _ from "lodash";
import * as cx from "classnames";
import { IFile, TagType } from "@/apis/files/types";
import {
  bytesToSize,
  ellipsis,
  ensureArray,
  extractFileExtension,
  formatISO,
  ICON_CLASSNAMES_MAP,
  iconfontCx,
} from "@/utils";

type IProps = {
  file: IFile;
  onDelete?: (_id: string) => void;
  onDownload?: (_id: string) => void;
  onEdit?: (_id: string, fileName: string, tags: TagType[]) => void;
};
const FileCard = (props: IProps) => {
  const { file, onDelete, onDownload, onEdit } = props;
  const { fileName, fileSize, fileType, tags, _id, updatedAt } = file;

  const renderAvatar = () => {
    const suffix = extractFileExtension(fileName);
    const hasKey = Object.keys(ICON_CLASSNAMES_MAP).some(
      (key) => key === suffix,
    );
    // @ts-expect-error 666
    const href = hasKey ? ICON_CLASSNAMES_MAP[suffix] : "weizhigeshi";

    return (
      <svg
        className="icon"
        aria-hidden="true"
        style={{
          fontSize: 50,
        }}
      >
        <use xlinkHref={`#icon-${href}`}></use>
      </svg>
    );
  };
  const renderDesc = useCallback(() => {
    return (
      <Flex gap="4px 0" wrap="wrap" vertical>
        <div className="size">{bytesToSize(fileSize)}</div>
        <div className="update-time">{formatISO(updatedAt)}</div>
        <div className="tags">
          {ensureArray(tags).map((tag) => (
            <Tag color="magenta" key={tag._id}>
              {tag.name}
            </Tag>
          ))}
        </div>
      </Flex>
    );
  }, [tags]);

  const renderTitle = () => {
    const title = ellipsis(fileName, 15);
    return <Tooltip title={fileName}>{title}</Tooltip>;
  };

  return (
    <div className="file-card">
      <Card
        style={{ width: "100%", marginTop: 16 }}
        actions={[
          <EditOutlined
            key="edit"
            onClick={() => onEdit?.(_id, fileName, tags)}
          />,
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
          avatar={renderAvatar()}
          title={renderTitle()}
          description={renderDesc()}
        />
      </Card>
    </div>
  );
};

export default FileCard;
