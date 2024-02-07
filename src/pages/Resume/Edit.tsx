import React from "react";
import { observer } from "mobx-react-lite";
import ResumePreviewer from "./ResumePreviewer";
import { ResumeConfig } from "@/apis/resume";
import "./edit.less";
import ConfigFormTree from "./ConfigFormTree";
import useStore from "@/store";

const Edit = observer(() => {
  const { resumeStore } = useStore();
  const { currentResumeData, treeData } = resumeStore;
  return (
    <div className="resume-edit-container">
      <div className="config-form-container">
        <ConfigFormTree treeData={treeData} />
      </div>
      <div className="previewer-container">
        <ResumePreviewer
          resumeConfig={currentResumeData?.resumeConfig}
        ></ResumePreviewer>
      </div>
    </div>
  );
});

export default Edit;
