import React from "react";
import "./index.less";
import { Button, Empty, Steps, Timeline, TimelineProps } from "antd";
import { observer } from "mobx-react-lite";
import { Stage, Target } from "@/apis/target/types";
import StageStep from "../StageStep";
import { ensureArray, waitAndRefreshPage } from "@/utils";
import TargetStore from "@/store/target/TargetStore";

type IProps = TimelineProps & {
  target: Target;
  store: TargetStore;
  navigate: any;
};

const TargetPreviewer = observer((props: IProps) => {
  const { target, store, navigate } = props;
  const { stages } = target;
  const { firstUnCompleteIndex, completeStepOpr, completeStageOpr } = store;
  const handleCompleteStage = async (stageId: string) => {
    await completeStageOpr(target._id, stageId);
    await waitAndRefreshPage(navigate, 0.5);
  };
  const handleCompleteStep = async (stageId: string) => {
    await completeStepOpr(target._id, stageId);
    await waitAndRefreshPage(navigate, 0.5);
  };

  const formatStages = (stages: Stage[]) => {
    return ensureArray(stages).map((stage, index) => {
      const { innerStepConfig, stageName, stageTime, _id, ...restProps } =
        stage;
      return {
        ...restProps,
        children: (
          <StageStep
            title={stageName}
            stageStepConfig={innerStepConfig}
            handleCompleteStage={() => handleCompleteStage(_id)}
            handleCompleteStep={() => handleCompleteStep(_id)}
            isComplete={
              (innerStepConfig?.current ?? 0) >=
              (innerStepConfig?.items?.length ?? 0)
            }
            isNew={(stage as any).new}
            showComplete={firstUnCompleteIndex === index && !(stage as any).new}
          />
        ),
        label: stageTime,
        color: stage.status,
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
