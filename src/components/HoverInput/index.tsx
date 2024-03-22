import { Input, InputProps } from "antd";
import "./index.less";
import { useEffect, useState } from "react";

type IProps = InputProps & {
  allowEmpty?: boolean;
};
const HoverInput = (props: IProps) => {
  const { allowEmpty, value } = props;

  const [status, setStatus] = useState<InputProps["status"]>("");

  useEffect(() => {
    setStatus(value ? "" : "error");
  }, [value]);

  return <Input className="hover-input" {...props} status={status} />;
};

export default HoverInput;
