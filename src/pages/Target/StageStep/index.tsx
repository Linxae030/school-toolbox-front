import { PopconfirmProps, Steps } from "antd";
import React from "react";
import "./index.less";
import { observer } from "mobx-react-lite";
import { StageStepConfig } from "@/apis/target/types";
import CheckSuccessIcon from "@/components/CheckSuccessIcon";
import { conditionalRender, ensureArray } from "@/utils";

type IProps = {
  title: React.ReactNode;
  stageStepConfig?: StageStepConfig;
  isComplete: boolean;
  isNew: boolean;
  showComplete: boolean;
  handleCompleteStage?: () => void;
  handleCompleteStep?: () => void;
};

const StageStep = observer((props: IProps) => {
  const {
    title,
    stageStepConfig,
    isComplete,
    isNew,
    showComplete,
    handleCompleteStage,
    handleCompleteStep,
  } = props;
  console.log("isComplete", isComplete);
  const { items, current, ...rest } = stageStepConfig ?? {};
  const formatItems = ensureArray(items).map((item, index) => {
    if (index === current) {
      return {
        ...item,
        title: (
          <span
            style={{
              display: "flex",
            }}
          >
            <span className="title-text">{item.title}</span>
            {!(item as any).new && showComplete ? (
              <CheckSuccessIcon
                popconfirmConfig={{
                  title: "确认将该步骤标记为为完成吗？",
                  onConfirm: handleCompleteStep,
                }}
              />
            ) : null}
          </span>
        ),
      };
    }
    return item;
  });
  return (
    <div className="stage-step">
      <div className="title">
        <span className="title-text">{title}</span>
        {showComplete ? (
          <CheckSuccessIcon
            popconfirmConfig={{
              title: "确认将该步骤标记为为完成吗？",
              onConfirm: handleCompleteStage,
            }}
          />
        ) : null}
      </div>
      {conditionalRender(stageStepConfig, () => (
        <Steps
          direction="vertical"
          size="small"
          items={formatItems}
          current={current}
          {...rest}
        />
      ))}
    </div>
  );
});

export default StageStep;
