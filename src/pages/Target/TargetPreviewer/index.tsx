import React from "react";
import "./index.less";
import { Button, Steps, Timeline, TimelineProps } from "antd";
import { observer } from "mobx-react-lite";
import { Stage, Target } from "@/apis/target/types";
import StageStep from "../StageStep";
import { ensureArray } from "@/utils";

type IProps = TimelineProps & {
  target: Target;
};

const TargetPreviewer = observer((props: IProps) => {
  const { target } = props;
  const { stages } = target;
  const formatStages = (stages: Stage[]) => {
    return ensureArray(stages).map((stage) => {
      const { innerStepConfig, stageName, stageTime, ...restProps } = stage;
      if (innerStepConfig) {
        const formattedStage = {
          ...restProps,
          label: stageTime,
          children: <StageStep title={stageName} config={innerStepConfig} />,
        };
        return formattedStage;
      }
      return {
        ...restProps,
        children: stageName,
        label: stageTime,
      };
    });
  };
  return (
    <div className="target-previewer">
      <Timeline mode="left" items={formatStages(stages)} />
    </div>
  );
});

export default TargetPreviewer;
