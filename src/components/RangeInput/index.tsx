import { Input, InputNumber } from "antd";
import "./index.less";
import React, { useEffect, useState } from "react";
import cx from "classnames";
import { SwapRightOutlined } from "@ant-design/icons";

const RangeInput: React.FC = (props: any) => {
  const { onChange, value = {} } = props;

  const [start, setStart] = useState(value?.[0] ?? 1);
  const [end, setEnd] = useState(value?.[1] ?? 1);

  useEffect(() => {
    onChange([start, end]);
  }, [start, end]);

  return (
    <div className="range-input">
      <InputNumber
        className={cx("start", "input")}
        value={value.start || start}
        onChange={(e) => setStart(e)}
        placeholder="起始"
        min={1}
        max={end}
        addonAfter="周"
      ></InputNumber>
      <SwapRightOutlined className="icon" />
      <InputNumber
        className={cx("end", "input")}
        value={value.end || end}
        onChange={(e) => setEnd(e)}
        placeholder="结束"
        min={1}
        addonAfter="周"
      ></InputNumber>
    </div>
  );
};

export default RangeInput;
