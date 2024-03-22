import "./edit.less";
import * as _ from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
  FileAddOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import ResumePreviewer from "./ResumePreviewer";
import ConfigFormTree from "./ConfigFormTree";
import useStore from "@/store";
import HoverInput from "@/components/HoverInput";
import ButtonGroup, { GroupButtonItem } from "@/components/ButtonGroup";
import { waitAndRefreshPage } from "@/utils";
import { useFormModal } from "@/components/Modal";

const Edit = observer(() => {
  const navigate = useNavigate();
  const { _id } = useParams() ?? {};
  const formModalHandler = useFormModal();

  const { resumeStore } = useStore();

  /** 是否是编辑页 */
  const isEdit = !!_id;

  const {
    currentResumeData,
    getTreeData,
    setCurrentId,
    resetResumeData,
    modifyResumeData,
    createResumeOpr,
    updateResumeOpr,
    findOneResumeOpr,
    handleExportPNG,
    handleExportPDF,
  } = resumeStore;

  const { resumeName } = currentResumeData;

  const onNameChange = (e: any) => {
    modifyResumeData("resumeName", e.currentTarget?.value);
  };

  const handleCreateResume = async () => {
    if (!currentResumeData.resumeName) {
      message.error("简历名称不能为空");
      return;
    }
    await createResumeOpr();
    await waitAndRefreshPage(navigate, 0.5);
  };

  const handleSaveResume = async () => {
    if (!currentResumeData.resumeName) {
      message.error("简历名称不能为空");
      return;
    }
    await updateResumeOpr();
    await waitAndRefreshPage(navigate, 0.5);
  };

  const operationButtons: GroupButtonItem[] = _.compact([
    isEdit
      ? {
          showPopconfirm: true,
          children: "保存",
          type: "primary",
          icon: <FileOutlined />,
          popConfirmProps: {
            title: "保存简历",
            description: "确定要保存该简历吗？",
            onConfirm: handleSaveResume,
          },
        }
      : {
          showPopconfirm: true,
          children: "新建",
          type: "primary",
          icon: <FileOutlined />,
          popConfirmProps: {
            title: "新建简历",
            description: "确定要新建该简历吗？",
            onConfirm: handleCreateResume,
          },
        },
    isEdit
      ? {
          showPopconfirm: true,
          children: "另存为",
          type: "primary",
          icon: <FileAddOutlined />,
          popConfirmProps: {
            title: "另存为新的简历",
            description: "确定要另存为新的简历吗？",
            onConfirm: handleCreateResume,
          },
        }
      : null,
    {
      isDropDown: true,
      children: "导出",
      type: "primary",
      icon: <SendOutlined />,
      menu: {
        items: [
          {
            label: "导出为PNG",
            key: "1",
            icon: <FileImageOutlined />,
            onClick: () => handleExportPNG(_id ?? "default"),
          },
          {
            label: "导出为PDF",
            key: "2",
            icon: <FilePdfOutlined />,
            onClick: () => handleExportPDF(_id ?? "default"),
          },
        ],
      },
    },
  ]);

  useEffect(() => {
    if (_id) {
      setCurrentId(_id);
      findOneResumeOpr();
    } else {
      setCurrentId("default");
      resetResumeData();
    }
  }, [_id]);

  return (
    <div className="resume-edit-container">
      <div className="config-form-container">
        <div>
          <HoverInput onChange={(e) => onNameChange(e)} value={resumeName} />
          <ButtonGroup buttons={operationButtons} />
        </div>
        <ConfigFormTree treeData={getTreeData(formModalHandler)} />
      </div>
      <div className="previewer-container">
        <ResumePreviewer
          _id={_id ?? "default"}
          resumeConfig={currentResumeData?.resumeConfig}
        ></ResumePreviewer>
      </div>
    </div>
  );
});

export default Edit;
