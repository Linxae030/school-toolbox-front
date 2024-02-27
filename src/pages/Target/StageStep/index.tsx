import { Steps } from "antd";
import React from "react";
import "./index.less";
import { observer } from "mobx-react-lite";
import { StageStepConfig } from "@/apis/target/types";
import CheckSuccessIcon from "@/components/CheckSuccessIcon";
import { ensureArray } from "@/utils";

type IProps = {
  title: React.ReactNode;
  config: StageStepConfig;
};

const StageStep = observer((props: IProps) => {
  const { title, config } = props;
  const { items, current, ...rest } = config;
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
          }}
        />
      </div>
      <Steps
        direction="vertical"
        size="small"
        items={formatItems}
        current={current}
        {...rest}
      />
    </div>
  );
});

export default StageStep;
