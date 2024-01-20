import React from "react";
import "./index.less";
import { Card, CardProps } from "antd";

type IProps = CardProps & {
  linkList?: string[];
};
const gridStyle: React.CSSProperties = {
  width: "10%",
  textAlign: "center",
};
const LinkCard = (props: IProps) => {
  const { title } = props;
  return (
    <Card id="part-1" title={title} extra={<a>添加链接</a>}>
      <Card.Grid style={gridStyle}>Content</Card.Grid>
    </Card>
  );
};

export default LinkCard;
