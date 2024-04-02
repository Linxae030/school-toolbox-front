import React, { useEffect, useState } from "react";
import "./index.less";
import * as _ from "lodash";

import {
  CloseOutlined,
  EditOutlined,
  FileAddOutlined,
  InboxOutlined,
  TagsOutlined,
} from "@ant-design/icons";

import {
  Divider,
  Form,
  Input,
  Select,
  SelectProps,
  Spin,
  UploadFile,
  UploadProps,
} from "antd";

import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import Dragger from "antd/es/upload/Dragger";
import FileTagList from "./FileTagList";
import FileList from "./FileList";

import ButtonGroup, { GroupButtonItem } from "@/components/ButtonGroup";
import useStore from "@/store";
import { useFormModal } from "@/components/Modal";
import { waitAndRefreshPage } from "@/utils";

type TagAddFormType = {
  name: string;
};

type UploadFileFormType = {
  tags: string[];
  files: UploadFile[];
};

const Files = observer(() => {
  const { fileStore } = useStore();
  const formModalHandler = useFormModal();
  const navigate = useNavigate();

  const {
    files,
    tags,
    selectedIds,
    selectedTags,
    updateSelectedIds,
    findAllTagsOpr,
    addTagOpr,
    updateTagOpr,
    deleteTagOpr,
    uploadFilesOpr,
    findFilesOpr,
  } = fileStore;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const renderAddTagForm = () => {
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

  const renderUploadFileForm = () => {
    const normFile = (e: any) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    const options: SelectProps["options"] = tags?.map((tag) => ({
      label: tag.name,
      value: tag._id,
    }));
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="文件标签"
          name="tags"
          rules={[{ required: true, message: "请选择标签" }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="请选择文件标签"
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="文件"
          name="files"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "请选择文件" }]}
        >
          <Dragger
            multiple
            action="/file/uploadImage"
            beforeUpload={(file, fileList) => {
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">将文件拖到这里上传</p>
            <p className="ant-upload-hint">支持单个或多个文件</p>
          </Dragger>
        </Form.Item>
      </Form>
    );
  };

  const onChange = async (ids: string[]) => {
    setLoading(true);
    updateSelectedIds(ids);
    await findFilesOpr(ids, () => setLoading(false));
  };

  const handleEditTag = async (name: string, id: string) => {
    await updateTagOpr(name, id);
    await waitAndRefreshPage(navigate, 0.5);
  };

  const handleAddTag = () => {
    formModalHandler.open<TagAddFormType>({
      modalProps: {
        title: "编辑标签",
        okText: "保存",
        cancelText: "取消",
        async onOk({ name }) {
          await addTagOpr(name);
          await waitAndRefreshPage(navigate, 0.5);
        },
      },
      formChildren: renderAddTagForm(),
    });
  };

  const handleDeleteTag = async (_id: string) => {
    await deleteTagOpr(_id);
    await waitAndRefreshPage(navigate, 0.5);
  };

  const handleUploadFile = async () => {
    formModalHandler.open<UploadFileFormType>({
      modalProps: {
        title: "上传文件",
        okText: "上传",
        cancelText: "取消",
        async onOk({ tags, files }) {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("files", file.originFileObj as any);
          });
          tags.forEach((tag) => {
            formData.append("tags", tag);
          });
          await uploadFilesOpr(formData);
          await waitAndRefreshPage(navigate, 0.5);
        },
      },
      formChildren: renderUploadFileForm(),
    });
  };

  const operationButtons: GroupButtonItem[] = _.compact([
    {
      children: "上传文件",
      type: "primary",
      icon: <FileAddOutlined />,
      onClick: handleUploadFile,
    },
    {
      children: "添加标签",
      type: "primary",
      icon: <TagsOutlined />,
      onClick: handleAddTag,
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

  useEffect(() => {
    setLoading(true);
    findAllTagsOpr();
    findFilesOpr([], () => setLoading(false));
  }, []);

  return (
    <div className="files">
      <aside className="side-bar">
        <div className="operations">
          <ButtonGroup buttons={operationButtons}></ButtonGroup>
        </div>
        <FileTagList
          tags={tags}
          isEditing={isEditing}
          onChange={onChange}
          onDelete={handleDeleteTag}
          onEdit={handleEditTag}
        ></FileTagList>
      </aside>
      <Divider type="vertical" />
      <main style={{ flex: 1 }}>
        <Spin tip="Loading..." spinning={loading} style={{ height: "100%" }}>
          <FileList selectedTags={selectedTags} files={files}></FileList>
        </Spin>
      </main>
    </div>
  );
});

export default Files;
