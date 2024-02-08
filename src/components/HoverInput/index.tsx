import { Input, InputProps } from "antd";
import "./index.less";

type IProps = InputProps;
const HoverInput = (props: IProps) => {
  return <Input className="hover-input" {...props} />;
};

export default HoverInput;
