import { CheckOutlined } from "@ant-design/icons";
import React from "react";
import "./index.less";
import { Popconfirm, PopconfirmProps } from "antd";

type IProps = {
  popconfirmConfig: PopconfirmProps;
};
const CheckSuccessIcon = (props: IProps) => {
  const { popconfirmConfig } = props;
  return (
    <Popconfirm okText="是" cancelText="否" {...popconfirmConfig}>
      <span className="check-success-icon">
        <CheckOutlined style={{ color: "#52c41a" }} />
      </span>
    </Popconfirm>
  );
};

export default CheckSuccessIcon;
