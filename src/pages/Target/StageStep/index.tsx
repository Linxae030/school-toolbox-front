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
  handleCompleteStage?: () => void;
  handleCompleteStep?: () => void;
};

const StageStep = observer((props: IProps) => {
  const { title, stageStepConfig, handleCompleteStage, handleCompleteStep } =
    props;
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
            <CheckSuccessIcon
              popconfirmConfig={{
                title: "确认将该步骤标记为为完成吗？",
                onConfirm: handleCompleteStep,
              }}
            />
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
        <CheckSuccessIcon
          popconfirmConfig={{
            title: "确认将该步骤标记为为完成吗？",
            onConfirm: handleCompleteStage,
          }}
        />
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
