import React from "react";
import "./index.less";
import { Button, Steps, Timeline, TimelineProps } from "antd";
import { Target } from "@/apis/target/types";

type IProps = TimelineProps & {
  target: Target;
};

const TargetPreviewer = (props: IProps) => {
  const { target } = props;
  const { stages, targetName } = target;
  return (
    <div className="target-previewer">
      <div className="target-title">
        <span className="target-name">{targetName}</span>
        {/* <Button className="delete-btn">233</Button> */}
      </div>
      <Timeline mode="left" items={stages} />
    </div>
  );
};

export default TargetPreviewer;
