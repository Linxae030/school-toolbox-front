import { useEffect, useState } from "react";
import "./index.less";
import * as _ from "lodash";

import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  InboxOutlined,
  TagsOutlined,
} from "@ant-design/icons";

import {
  Button,
  Divider,
  FloatButton,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  SelectProps,
  Spin,
  UploadFile,
} from "antd";

import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import Dragger from "antd/es/upload/Dragger";
import FileTagList from "./FileTagList";
import FileList from "./FileList";

import ButtonGroup, { GroupButtonItem } from "@/components/ButtonGroup";
import useStore from "@/store";
import { useFormModal } from "@/components/Modal";
import { handleResponse, waitAndRefreshPage } from "@/utils";
import { checkFileUnique } from "@/apis/files";
import UniqueUpload from "@/components/UniqueUpload";
import FilterButton from "@/components/FilterButtons";
import { FilterCondition } from "@/store/file";

type TagAddFormType = {
  name: string;
};

type UploadFileFormType = {
  tags: string[];
  files: UploadFile[];
};

type DownloadFilesFormType = {
  zipName: string;
};

const Files = observer(() => {
  const { fileStore } = useStore();
  const formModalHandler = useFormModal();
  const navigate = useNavigate();

  const {
    files,
    filteredFiles,
    tags,
    selectedTagIds,
    selectedFileIds,
    selectedTags,
    resetData,
    setFilerCondition,
    updateSelectedTagIds,
    updateSelectedFileIds,
    findAllTagsOpr,
    addTagOpr,
    updateTagOpr,
    deleteTagOpr,
    uploadFilesOpr,
    findFilesOpr,
    deleteFileOpr,
    deleteFilesOpr,
    downloadFileOpr,
    downloadFilesOpr,
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
          <UniqueUpload />
        </Form.Item>
      </Form>
    );
  };

  const renderDownloadFileForm = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="压缩包名"
          name="zipName"
          rules={[{ required: true, message: "请输入压缩包名" }]}
        >
          <Input placeholder="请输入压缩包名" showCount maxLength={8} />
        </Form.Item>
      </Form>
    );
  };

  const onChange = async (ids: string[]) => {
    setLoading(true);
    updateSelectedTagIds(ids);
    await findFilesOpr(ids, () => setLoading(false));
  };

  const handleFileChecked = (ids: string[]) => {
    updateSelectedFileIds(ids);
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

  const handleDeleteFile = async (_id: string) => {
    await deleteFileOpr(_id);
    await waitAndRefreshPage(navigate, 0.5);
  };

  const handleDeleteFiles = async () => {
    await deleteFilesOpr();
    await waitAndRefreshPage(navigate, 0.5);
  };

  const handleUploadFile = async () => {
    formModalHandler.open<UploadFileFormType>({
      modalProps: {
        title: "上传文件",
        okText: "上传",
        cancelText: "取消",
        async onOk({ tags, files }) {
          console.log("files", files);
          const res = await checkFileUnique(files.map((file) => file.name));
          handleResponse(res, async (res) => {
            const { repeatNames } = res.data;
            if (repeatNames.length !== 0) {
              const msg = `${repeatNames.join(
                "、",
              )} 已存在同名文件，请重新选择。`;
              return message.error(msg, repeatNames.length * 1);
            }
            const formData = new FormData();
            files.forEach((file) => {
              formData.append("files", file.originFileObj as any);
            });
            tags.forEach((tag) => {
              formData.append("tags", tag);
            });
            await uploadFilesOpr(formData);
            await waitAndRefreshPage(navigate, 0.5);
          });
        },
      },
      formChildren: renderUploadFileForm(),
    });
  };

  const handleDownloadFile = async (_id: string) => {
    await downloadFileOpr(_id);
  };

  const handleDownloadFiles = async () => {
    const { selectedFileIds } = fileStore;
    if (selectedFileIds.length === 0) {
      message.warning("尚未选择文件");
      return;
    }

    formModalHandler.open<DownloadFilesFormType>({
      modalProps: {
        title: "下载文件压缩包",
        okText: "保存",
        cancelText: "取消",
        async onOk({ zipName }) {
          await downloadFilesOpr(selectedFileIds, zipName);
        },
      },
      formChildren: renderDownloadFileForm(),
    });
  };

  const handleFilterChange = (condition: FilterCondition) => {
    console.log("condition", condition);
    setFilerCondition(condition);
  };

  const operationButtons: GroupButtonItem[] = _.compact([
    {
      type: "primary",
      icon: <FileAddOutlined />,
      onClick: handleUploadFile,
    },
    {
      type: "primary",
      icon: <TagsOutlined />,
      onClick: handleAddTag,
    },
    !isEditing
      ? {
          type: "primary",
          icon: <EditOutlined />,
          onClick: () => setIsEditing(true),
        }
      : {
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
    return () => {
      resetData();
    };
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
          <FileList
            selectedTags={selectedTags}
            files={filteredFiles}
            onFileCheckChange={handleFileChecked}
            onFileDelete={handleDeleteFile}
            onFilesDelete={handleDeleteFiles}
            onFileDownload={handleDownloadFile}
            onFilterConditionChange={handleFilterChange}
          ></FileList>
        </Spin>
        <FloatButton.Group
          shape="square"
          style={{
            right: 94,
            display: selectedFileIds.length !== 0 ? "block" : "none",
          }}
        >
          <FloatButton
            icon={<CloudDownloadOutlined />}
            onClick={handleDownloadFiles}
          />
          <Popconfirm
            key="delete"
            title="删除文件"
            description="你确定要删除所选文件吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={handleDeleteFiles}
          >
            <FloatButton icon={<DeleteOutlined />} />
          </Popconfirm>
        </FloatButton.Group>
      </main>
    </div>
  );
});

export default Files;
