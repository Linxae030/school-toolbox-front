import "./index.less";
import {
  Checkbox,
  CheckboxOptionType,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Popconfirm,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import * as cx from "classnames";
import { ensureArray, mapRender } from "../../../utils/utils";
import { TagType } from "@/apis/files/types";
import { useFormModal } from "@/components/Modal";

type tagEditFormType = {
  name: string;
};

type IProps = {
  isEditing: boolean;
  tags: TagType[];
  onChange: (ids: string[]) => void;
  onDelete: (id: string) => void;
  onEdit: (name: string, id: string) => void;
};

const FileTagList = (props: IProps) => {
  const { tags, isEditing, onDelete, onEdit, onChange } = props;

  const isEmpty = ensureArray(tags).length === 0;

  const renderEditTagForm = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: "请输入标签名" }]}
        >
          <Input placeholder="请输入标签名" showCount maxLength={8} />
        </Form.Item>
      </Form>
    );
  };

  const handleChange = (value: string[]) => {
    onChange(value);
  };

  const formModalHandler = useFormModal();

  const options: CheckboxOptionType[] = tags?.map((tag) => ({
    label: tag.name,
    value: tag._id,
  }));

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const handleEdit = (id: string, name: string) => {
    formModalHandler.open<tagEditFormType>({
      modalProps: {
        title: "编辑标签",
        okText: "保存",
        cancelText: "取消",
        onOk({ name }) {
          onEdit(name, id);
        },
      },
      formChildren: renderEditTagForm(),
      initialValue: {
        name,
      },
    });
  };

  return (
    <div className="file-tag-list">
      <h1 className="side-title">文件标签</h1>
      <Checkbox.Group
        style={{
          width: "100%",
        }}
        onChange={handleChange as any}
        className={cx("checkbox-group", {
          "is-empty": isEmpty,
        })}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          {isEmpty ? (
            <Empty description="暂无标签~"></Empty>
          ) : (
            mapRender(options, (option) => (
              <div
                className={cx("target-row", {
                  "editing-row": isEditing,
                })}
                key={option.value as string}
              >
                {isEditing ? (
                  <>
                    <span>{option.label}</span>
                    <span className="operations">
                      <span
                        className="delete"
                        onClick={() =>
                          handleEdit(
                            option.value as string,
                            option.label as string,
                          )
                        }
                      >
                        <EditOutlined />
                      </span>
                      <Popconfirm
                        title="是否删除该标签"
                        okText="是"
                        cancelText="否"
                        description="确定要删除这个标签吗？"
                        onConfirm={() => handleDelete(option.value as string)}
                      >
                        <span className="edit">
                          <DeleteOutlined />
                        </span>
                      </Popconfirm>
                    </span>
                  </>
                ) : (
                  <Checkbox value={option.value}>{option.label}</Checkbox>
                )}
              </div>
            ))
          )}
        </Space>
      </Checkbox.Group>
    </div>
  );
};

export default FileTagList;
